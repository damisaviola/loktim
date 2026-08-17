import type { Metadata } from "next";
import CompanyRegisterForm from "@/components/CompanyRegisterForm";

export const metadata: Metadata = {
  title: "Daftar Akun Perusahaan | Pasang Lowongan Kerja LokerTimika",
  description:
    "Daftarkan perusahaan Anda di LokerTimika untuk mulai mempublikasikan lowongan kerja, mengelola pelamar, dan menjaring talenta terbaik di wilayah Mimika dan Papua Tengah.",
  keywords: [
    "daftar perusahaan timika",
    "pasang loker timika",
    "lowongan kerja mimika",
    "rekruter timika",
    "pasang lowongan kerja papua",
  ],
};

export default function CompanyRegisterPage() {
  return <CompanyRegisterForm />;
}
