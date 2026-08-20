import { z } from "zod";
import { emailSchema, whatsappSchema, urlSchema } from "./common";

export const step1Schema = z
  .object({
    isNewCompany: z.boolean(),
    companyId: z.string().optional().nullable(),
    newCompanyName: z.string().trim().max(100, "Nama perusahaan terlalu panjang").optional().nullable(),
    newCompanyLocation: z.string().trim().max(150, "Alamat perusahaan terlalu panjang").optional().nullable(),
    newCompanyDesc: z.string().trim().max(2000, "Deskripsi perusahaan terlalu panjang").optional().nullable(),
    email: emailSchema,
    picName: z.string().trim().max(100, "Nama penanggung jawab maksimal 100 karakter").optional().nullable().or(z.literal("")),
    imageUrl: urlSchema,
  })
  .refine(
    (data) => {
      if (data.isNewCompany) {
        return !!data.newCompanyName && data.newCompanyName.trim().length >= 2;
      }
      return !!data.companyId && data.companyId.trim().length > 0;
    },
    {
      message: "Nama perusahaan wajib diisi",
      path: ["newCompanyName"],
    }
  )
  .refine(
    (data) => {
      if (data.isNewCompany) {
        return !!data.newCompanyLocation && data.newCompanyLocation.trim().length >= 2;
      }
      return true;
    },
    {
      message: "Alamat perusahaan wajib diisi",
      path: ["newCompanyLocation"],
    }
  )
  .refine(
    (data) => {
      if (data.isNewCompany) {
        return !!data.newCompanyDesc && data.newCompanyDesc.trim().length >= 20;
      }
      return true;
    },
    {
      message: "Deskripsi perusahaan minimal 20 karakter",
      path: ["newCompanyDesc"],
    }
  );

export const step2Schema = z
  .object({
    title: z.string().trim().min(3, "Posisi pekerjaan minimal 3 huruf").max(120, "Posisi pekerjaan terlalu panjang"),
    category: z.string().trim().min(1, "Silakan pilih kategori pekerjaan"),
    location: z.string().trim().min(1, "Lokasi penempatan masih kosong, harap diisi").max(150, "Lokasi penempatan terlalu panjang"),
    description: z.string().trim().min(10, "Deskripsi pekerjaan minimal 10 huruf").max(20000, "Deskripsi pekerjaan terlalu panjang"),
    requirementsRaw: z.string().trim().min(5, "Persyaratan minimal 5 huruf").max(10000, "Persyaratan terlalu panjang"),
    whatsapp: whatsappSchema,
    applicationLink: urlSchema,
    salaryMinStr: z.string().optional().nullable().or(z.literal("")),
    salaryMaxStr: z.string().optional().nullable().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.salaryMinStr && data.salaryMaxStr && data.salaryMinStr !== "" && data.salaryMaxStr !== "") {
        const min = parseInt(data.salaryMinStr, 10);
        const max = parseInt(data.salaryMaxStr, 10);
        if (!isNaN(min) && !isNaN(max) && max < min) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Gaji maksimal tidak boleh lebih kecil dari gaji minimal",
      path: ["salaryMaxStr"],
    }
  );

export const step3Schema = z
  .object({
    type: z.string().trim().min(1, "Silakan pilih tipe kontrak"),
    education: z.string().default("Semua").nullable(),
    experience: z.string().default("Tanpa Pengalaman").nullable(),
    gender: z.string().default("Pria/Wanita").nullable(),
    ageRange: z.string().default("Bebas").nullable(),
    deadlineStr: z.string().optional().nullable().or(z.literal("")),
    terms: z.boolean().refine((val) => val === true, {
      message: "Anda harus menyetujui Panduan & Ketentuan terlebih dahulu",
    }),
  })
  .refine(
    (data) => {
      if (data.deadlineStr && data.deadlineStr.trim() !== "") {
        const deadline = new Date(data.deadlineStr);
        if (isNaN(deadline.getTime())) {
          return false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deadline < today) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Tanggal batas lamaran tidak boleh sudah lewat",
      path: ["deadlineStr"],
    }
  );

export const createJobSchema = z
  .object({
    isNewCompany: z.boolean(),
    companyId: z.string().optional().nullable(),
    newCompanyName: z.string().trim().max(100, "Nama perusahaan terlalu panjang").optional().nullable(),
    newCompanyLocation: z.string().trim().max(150, "Alamat perusahaan terlalu panjang").optional().nullable(),
    newCompanyDesc: z.string().trim().min(20, "Deskripsi perusahaan minimal 20 huruf").max(2000, "Deskripsi perusahaan terlalu panjang").optional().nullable(),
    email: emailSchema,
    picName: z.string().trim().max(100, "Nama penanggung jawab maksimal 100 karakter").optional().nullable().or(z.literal("")),
    imageUrl: urlSchema,
    title: z.string().trim().min(3, "Posisi pekerjaan minimal 3 huruf").max(120, "Posisi pekerjaan terlalu panjang"),
    category: z.string().trim().min(1, "Silakan pilih kategori pekerjaan"),
    location: z.string().trim().min(1, "Lokasi penempatan masih kosong, harap diisi").max(150, "Lokasi penempatan terlalu panjang"),
    description: z.string().trim().min(10, "Deskripsi pekerjaan minimal 10 huruf").max(20000, "Deskripsi pekerjaan terlalu panjang"),
    requirementsRaw: z.string().trim().min(5, "Persyaratan minimal 5 huruf").max(10000, "Persyaratan terlalu panjang"),
    type: z.string().trim().min(1, "Silakan pilih tipe kontrak"),
    education: z.string().default("Semua").nullable(),
    experience: z.string().default("Tanpa Pengalaman").nullable(),
    gender: z.string().default("Pria/Wanita").nullable(),
    ageRange: z.string().default("Bebas").nullable(),
    whatsapp: whatsappSchema,
    salaryMinStr: z.string().optional().nullable().or(z.literal("")),
    salaryMaxStr: z.string().optional().nullable().or(z.literal("")),
    deadlineStr: z.string().optional().nullable().or(z.literal("")),
    applicationLink: urlSchema,
    terms: z.boolean().refine((val) => val === true, {
      message: "Anda harus menyetujui Panduan & Ketentuan terlebih dahulu",
    }),
  })
  .refine(
    (data) => {
      if (data.isNewCompany) {
        return !!data.newCompanyName && !!data.newCompanyLocation;
      }
      return !!data.companyId;
    },
    {
      message: "Nama dan alamat perusahaan baru wajib diisi",
      path: ["newCompanyName"],
    }
  )
  .refine(
    (data) => {
      if (data.isNewCompany) {
        return !!data.newCompanyDesc;
      }
      return true;
    },
    {
      message: "Deskripsi perusahaan wajib diisi",
      path: ["newCompanyDesc"],
    }
  )
  .refine(
    (data) => {
      if (data.salaryMinStr && data.salaryMaxStr && data.salaryMinStr !== "" && data.salaryMaxStr !== "") {
        const min = parseInt(data.salaryMinStr, 10);
        const max = parseInt(data.salaryMaxStr, 10);
        if (!isNaN(min) && !isNaN(max) && max < min) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Gaji maksimal tidak boleh lebih kecil dari gaji minimal",
      path: ["salaryMaxStr"],
    }
  )
  .refine(
    (data) => {
      if (data.deadlineStr && data.deadlineStr.trim() !== "") {
        const deadline = new Date(data.deadlineStr);
        if (isNaN(deadline.getTime())) {
          return false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deadline < today) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Tanggal batas lamaran tidak boleh sudah lewat",
      path: ["deadlineStr"],
    }
  );

export type CreateJobInput = z.infer<typeof createJobSchema>;

export const updateJobSchema = z.object({
  email: emailSchema,
  picName: z.string().trim().max(100, "Nama penanggung jawab maksimal 100 karakter").optional().nullable().or(z.literal("")),
  imageUrl: urlSchema,
  title: z.string().trim().min(3, "Posisi pekerjaan minimal 3 huruf").max(120, "Posisi pekerjaan terlalu panjang"),
  category: z.string().trim().min(1, "Silakan pilih kategori pekerjaan"),
  location: z.string().trim().min(1, "Lokasi penempatan masih kosong, harap diisi").max(150, "Lokasi penempatan terlalu panjang"),
  description: z.string().trim().min(10, "Deskripsi pekerjaan minimal 10 huruf").max(20000, "Deskripsi pekerjaan terlalu panjang"),
  requirementsRaw: z.string().trim().min(5, "Persyaratan minimal 5 huruf").max(10000, "Persyaratan terlalu panjang"),
  type: z.string().trim().min(1, "Silakan pilih tipe kontrak"),
  education: z.string().default("Semua").nullable(),
  experience: z.string().default("Tanpa Pengalaman").nullable(),
  gender: z.string().default("Pria/Wanita").nullable(),
  ageRange: z.string().default("Bebas").nullable(),
  whatsapp: whatsappSchema,
  salaryMinStr: z.string().optional().nullable().or(z.literal("")),
  salaryMaxStr: z.string().optional().nullable().or(z.literal("")),
  deadlineStr: z.string().optional().nullable().or(z.literal("")),
  applicationLink: urlSchema,
});

export type UpdateJobInput = z.infer<typeof updateJobSchema>;
