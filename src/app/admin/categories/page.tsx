import { getAdminCategoriesAction } from "@/app/actions/job";
import CategoriesClient from "./CategoriesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategori Pekerjaan | Admin Dashboard",
  description: "Kelola daftar kategori lowongan kerja di Admin Dashboard.",
};

export default async function CategoriesPage() {
  const initialCategories = await getAdminCategoriesAction();

  return <CategoriesClient initialCategories={initialCategories} />;
}
