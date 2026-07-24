"use server";

import prisma from "@/lib/prisma";
import { getUserSession } from "./auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
});

export async function getCategoriesAction() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function createCategoryAction(name: string) {
  try {
    const user = await getUserSession();
    if (!user) throw new Error("Unauthorized");

    const validatedData = categorySchema.safeParse({ name });
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const safeName = DOMPurify.sanitize(validatedData.data.name.trim());

    const category = await prisma.category.create({
      data: { name: safeName }
    });
    
    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return { success: false, error: error.message };
  }
}

export async function updateCategoryAction(id: string, oldName: string, newName: string) {
  try {
    const user = await getUserSession();
    if (!user) throw new Error("Unauthorized");

    const validatedData = categorySchema.safeParse({ name: newName });
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const safeNewName = DOMPurify.sanitize(validatedData.data.name.trim());

    // Update the Category table
    const category = await prisma.category.update({
      where: { id },
      data: { name: safeNewName }
    });

    // Sync all existing jobs that had the old category string
    if (oldName !== safeNewName) {
      await prisma.job.updateMany({
        where: { category: oldName },
        data: { category: safeNewName }
      });
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/jobs");
    revalidatePath("/dashboard");
    return { success: true, category };
  } catch (error: any) {
    console.error("Failed to update category:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const user = await getUserSession();
    if (!user) throw new Error("Unauthorized");

    await prisma.category.delete({
      where: { id }
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    return { success: false, error: error.message };
  }
}
