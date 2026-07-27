import { getAdminCompaniesAction } from "@/app/actions/job";
import CompaniesClient from "./CompaniesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perusahaan Mitra | Admin Dashboard",
  description: "Kelola daftar perusahaan mitra di Admin Dashboard.",
};

export default async function CompaniesPage() {
  const initialCompanies = await getAdminCompaniesAction();

  return <CompaniesClient initialCompanies={initialCompanies} />;
}
