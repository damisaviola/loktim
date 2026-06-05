import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Creating 'images' bucket in Supabase Storage...");
    
    // Create bucket if it doesn't exist
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES ('images', 'images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    
    console.log("Bucket 'images' ensured.");

    // Create policy for public read (SELECT)
    try {
      await prisma.$executeRawUnsafe(`
        CREATE POLICY "Public Select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'images');
      `);
      console.log("Read policy created.");
    } catch (e: any) {
      if (!e.message.includes("already exists")) {
        console.log("Read policy already exists or error:", e.message);
      }
    }

    // Create policy for public upload (INSERT)
    try {
      await prisma.$executeRawUnsafe(`
        CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'images');
      `);
      console.log("Upload policy created.");
    } catch (e: any) {
      if (!e.message.includes("already exists")) {
        console.log("Upload policy already exists or error:", e.message);
      }
    }

    console.log("Setup completed successfully!");
  } catch (error) {
    console.error("Error setting up bucket:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
