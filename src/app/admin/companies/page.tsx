import { getAdminCompaniesAction } from "@/app/actions/job";
import CompaniesClient from "./CompaniesClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Perusahaan | Admin Dashboard",
  description: "Daftar perusahaan dan tempat usaha terdaftar di LokerTimika.",
};

export default async function CompaniesPage() {
  const initialCompanies = await getAdminCompaniesAction();

  return <CompaniesClient initialCompanies={initialCompanies} />;
}
