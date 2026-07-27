-- Enable Row Level Security on tables
ALTER TABLE "Job" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Company" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JobReport" ENABLE ROW LEVEL SECURITY;

-- Helper to safely cast auth.uid() if needed, though in Supabase it returns uuid.
-- Note: Prisma's authUserId is a String. We should compare it properly.
-- auth.uid() returns uuid. authUserId is text.

-- 1. Admin Table Policies
-- Admins can read the Admin table if they are in it.
CREATE POLICY "Admins can view admins" ON "Admin" FOR SELECT USING (
  "authUserId" = auth.uid()::text
);

-- 2. Company Table Policies
-- Anyone can view companies
CREATE POLICY "Public can view companies" ON "Company" FOR SELECT USING (true);
-- Companies can update their own profile
CREATE POLICY "Companies can update own profile" ON "Company" FOR UPDATE USING (
  "authUserId" = auth.uid()::text
) WITH CHECK (
  "authUserId" = auth.uid()::text
);
-- Admins can update any company
CREATE POLICY "Admins can update any company" ON "Company" FOR UPDATE USING (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);
-- Admins can insert/delete companies
CREATE POLICY "Admins can insert companies" ON "Company" FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);
CREATE POLICY "Admins can delete companies" ON "Company" FOR DELETE USING (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);

-- 3. Job Table Policies
-- Anyone can view jobs
CREATE POLICY "Public can view jobs" ON "Job" FOR SELECT USING (true);
-- Companies can insert jobs for themselves
CREATE POLICY "Companies can insert own jobs" ON "Job" FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM "Company" WHERE "authUserId" = auth.uid()::text AND id = "Job"."companyId")
);
-- Companies can update their own jobs
CREATE POLICY "Companies can update own jobs" ON "Job" FOR UPDATE USING (
  EXISTS (SELECT 1 FROM "Company" WHERE "authUserId" = auth.uid()::text AND id = "Job"."companyId")
) WITH CHECK (
  EXISTS (SELECT 1 FROM "Company" WHERE "authUserId" = auth.uid()::text AND id = "Job"."companyId")
);
-- Companies can delete their own jobs
CREATE POLICY "Companies can delete own jobs" ON "Job" FOR DELETE USING (
  EXISTS (SELECT 1 FROM "Company" WHERE "authUserId" = auth.uid()::text AND id = "Job"."companyId")
);
-- Admins can do anything on Jobs
CREATE POLICY "Admins can do anything on Jobs (INSERT)" ON "Job" FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);
CREATE POLICY "Admins can do anything on Jobs (UPDATE)" ON "Job" FOR UPDATE USING (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);
CREATE POLICY "Admins can do anything on Jobs (DELETE)" ON "Job" FOR DELETE USING (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);

-- 4. Category Table Policies
-- Anyone can view categories
CREATE POLICY "Public can view categories" ON "Category" FOR SELECT USING (true);
-- Only admins can insert/update/delete
CREATE POLICY "Admins manage categories (INSERT)" ON "Category" FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);
CREATE POLICY "Admins manage categories (UPDATE)" ON "Category" FOR UPDATE USING (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);
CREATE POLICY "Admins manage categories (DELETE)" ON "Category" FOR DELETE USING (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);

-- 5. JobReport Policies
-- Anyone can create a job report
CREATE POLICY "Public can insert job report" ON "JobReport" FOR INSERT WITH CHECK (true);
-- Only admins can view, update or delete job reports
CREATE POLICY "Admins can view job reports" ON "JobReport" FOR SELECT USING (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);
CREATE POLICY "Admins can update job reports" ON "JobReport" FOR UPDATE USING (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);
CREATE POLICY "Admins can delete job reports" ON "JobReport" FOR DELETE USING (
  EXISTS (SELECT 1 FROM "Admin" WHERE "authUserId" = auth.uid()::text)
);
