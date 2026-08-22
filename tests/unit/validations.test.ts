import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  emailSchema,
  phoneSchema,
  whatsappSchema,
  urlSchema,
  formatZodErrors,
  loginSchema,
  adminLoginSchema,
  registerCompanySchema,
  loginCompanySchema,
  updateCompanyProfileSchema,
  createJobSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  contactFormSchema,
  reportJobSchema,
  newsletterSchema,
  categorySchema,
} from "@/lib/validations";

describe("1. Common Primitives & Error Formatter", () => {
  describe("emailSchema", () => {
    it("should accept valid emails and normalize/lowercase them", () => {
      const result = emailSchema.safeParse("  User@Perusahaan.COM ");
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data, "user@perusahaan.com");
      }
    });

    it("should reject invalid email formats", () => {
      const invalidEmails = ["bukan-email", "@domain.com", "user@", "user@.com", ""];
      for (const email of invalidEmails) {
        const result = emailSchema.safeParse(email);
        assert.strictEqual(result.success, false, `Expected ${email} to fail`);
      }
    });
  });

  describe("phoneSchema & whatsappSchema", () => {
    it("should accept valid Indonesian phone formats", () => {
      const validPhones = ["081234567890", "+6281234567890", "0812-3456-7890", "(0901) 321123"];
      for (const phone of validPhones) {
        const result = phoneSchema.safeParse(phone);
        assert.strictEqual(result.success, true, `Expected ${phone} to be valid`);
      }
    });

    it("should reject invalid phone numbers", () => {
      const invalidPhones = ["1234", "08123abcde", ""];
      for (const phone of invalidPhones) {
        const result = phoneSchema.safeParse(phone);
        assert.strictEqual(result.success, false, `Expected ${phone} to be invalid`);
      }
    });

    it("should accept valid WhatsApp formats", () => {
      const validWa = ["081234567890", "+6281234567890", "6281234567890"];
      for (const wa of validWa) {
        const result = whatsappSchema.safeParse(wa);
        assert.strictEqual(result.success, true, `Expected ${wa} to be valid`);
      }
    });
  });

  describe("urlSchema", () => {
    it("should accept valid HTTP and HTTPS URLs", () => {
      const validUrls = [
        "https://lokertimika.com",
        "http://perusahaan.co.id/karir",
        "https://sub.domain.com/apply?id=123",
      ];
      for (const url of validUrls) {
        const result = urlSchema.safeParse(url);
        assert.strictEqual(result.success, true, `Expected ${url} to be valid`);
      }
    });

    it("should reject invalid or non-HTTP protocols", () => {
      const invalidUrls = ["ftp://example.com", "javascript:alert(1)", "not-a-url"];
      for (const url of invalidUrls) {
        const result = urlSchema.safeParse(url);
        assert.strictEqual(result.success, false, `Expected ${url} to be invalid`);
      }
    });
  });

  describe("formatZodErrors", () => {
    it("should correctly separate field errors and general errors", () => {
      const result = contactFormSchema.safeParse({
        name: "",
        email: "invalid-email",
        category: "general",
        subject: "",
        message: "",
      });

      assert.strictEqual(result.success, false);
      if (!result.success) {
        const formatted = formatZodErrors(result.error);
        assert.ok(formatted.fieldErrors.name, "Expected field error for name");
        assert.ok(formatted.fieldErrors.email, "Expected field error for email");
        assert.ok(formatted.fieldErrors.subject, "Expected field error for subject");
        assert.ok(formatted.fieldErrors.message, "Expected field error for message");
        assert.ok(Array.isArray(formatted.generalErrors));
      }
    });
  });
});

describe("2. Authentication Schemas", () => {
  describe("loginSchema (Company / User Login)", () => {
    it("should validate valid login credentials", () => {
      const valid = loginSchema.safeParse({
        email: "hrd@perusahaan.com",
        password: "password123",
      });
      assert.strictEqual(valid.success, true);
    });

    it("should reject invalid email or short password", () => {
      const invalid = loginSchema.safeParse({
        email: "bukan-email",
        password: "123",
      });
      assert.strictEqual(invalid.success, false);
    });
  });

  describe("adminLoginSchema (Admin Portal Login)", () => {
    it("should validate valid admin username and password", () => {
      const valid = adminLoginSchema.safeParse({
        username: "superadmin",
        password: "adminPassword123!",
      });
      assert.strictEqual(valid.success, true);
      if (valid.success) {
        assert.strictEqual(valid.data.username, "superadmin");
      }
    });

    it("should fail when username is shorter than 3 characters", () => {
      const result = adminLoginSchema.safeParse({
        username: "ad",
        password: "password123",
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("registerCompanySchema", () => {
    const validCompanyData = {
      name: "PT Freeport Partner Indonesia",
      industry: "Pertambangan & Energi",
      location: "Kuala Kencana, Mimika, Papua Tengah",
      about: "Perusahaan yang bergerak di bidang pendukung operasional pertambangan dan logistik di Mimika.",
      website: "https://freeportpartner.com",
      picName: "Yohanes Maturbongs",
      phone: "081234567890",
      email: "recruitment@freeportpartner.com",
      password: "Password123!",
      confirmPassword: "Password123!",
      logoUrl: null,
      agreeTerms: true,
    };

    it("should accept valid company registration payload", () => {
      const result = registerCompanySchema.safeParse(validCompanyData);
      assert.strictEqual(result.success, true);
    });

    it("should reject company registration when password and confirmPassword do not match", () => {
      const result = registerCompanySchema.safeParse({
        ...validCompanyData,
        confirmPassword: "DifferentPassword123!",
      });
      assert.strictEqual(result.success, false);
    });

    it("should reject company registration with weak password (< 6 chars)", () => {
      const result = registerCompanySchema.safeParse({
        ...validCompanyData,
        password: "123",
        confirmPassword: "123",
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("loginCompanySchema", () => {
    it("should accept valid company login payload", () => {
      const result = loginCompanySchema.safeParse({
        email: "hr@company.com",
        password: "MySecurePassword",
      });
      assert.strictEqual(result.success, true);
    });
  });
});

describe("3. Contact Form & Feedback Schemas", () => {
  describe("contactFormSchema", () => {
    it("should accept valid contact form payload", () => {
      const result = contactFormSchema.safeParse({
        name: "Maria Rumkorem",
        email: "maria@gmail.com",
        phone: "081234567890",
        organization: "Toko Berkah Timika",
        category: "general",
        subject: "Kerjasama Publikasi Loker",
        message: "Halo tim LokerTimika, kami ingin bekerjasama memasang iklan lowongan pekerjaan.",
      });
      assert.strictEqual(result.success, true);
    });

    it("should accept valid contact form with category default and minimal info", () => {
      const result = contactFormSchema.safeParse({
        name: "Yohanes Kogoya",
        email: "yohanes@gmail.com",
        category: "general",
        subject: "Pertanyaan seputar lowongan kerja",
        message: "Apakah ada lowongan untuk lulusan SMA di Timika?",
      });
      assert.strictEqual(result.success, true);
    });

    it("should reject message shorter than minimum length", () => {
      const result = contactFormSchema.safeParse({
        name: "Yohanes",
        email: "yohanes@gmail.com",
        category: "general",
        subject: "Halo",
        message: "Tes",
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("reportJobSchema", () => {
    it("should accept valid job report payload", () => {
      const result = reportJobSchema.safeParse({
        jobId: "cuid1234567890",
        reason: "Indikasi Penipuan / Pungutan Biaya",
        details: "Pelamar diminta mentransfer uang sejumlah Rp 500.000 untuk biaya seragam.",
        reporterContact: "081234567890",
      });
      assert.strictEqual(result.success, true);
    });

    it("should reject report with empty reason", () => {
      const result = reportJobSchema.safeParse({
        jobId: "cuid1234567890",
        reason: "",
        details: "Loker ini palsu.",
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("newsletterSchema", () => {
    it("should accept valid email subscription", () => {
      const result = newsletterSchema.safeParse({
        email: "subscriber@lokertimika.com",
      });
      assert.strictEqual(result.success, true);
    });
  });
});

describe("4. Job Wizard & Creation Schemas", () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30);
  const futureDateStr = tomorrow.toISOString().split("T")[0];

  const validJobData = {
    isNewCompany: true,
    companyId: null,
    newCompanyName: "PT Tambang Mimika Jaya",
    newCompanyLocation: "Mile 38, Timika",
    newCompanyDesc: "Perusahaan kontraktor alat berat dan mechanical maintenance.",
    email: "hrd@tambangmimika.com",
    picName: "Budi Santoso",
    imageUrl: null,
    title: "Senior Heavy Equipment Mechanic",
    category: "Teknik & Konstruksi",
    location: "Tembagapura, Mimika",
    description: "Bertanggung jawab atas perawatan rutin dan troubleshooting unit excavator CAT 320D.",
    requirementsRaw: "Pengalaman minimal 3 tahun, sertifikasi BMC, bersedia roster 6:2 di jobsite.",
    type: "Full-time",
    education: "SMK / D3 Teknik Mesin",
    experience: "Minimal 3 Tahun",
    gender: "Pria",
    ageRange: "23 - 40 Tahun",
    whatsapp: "081234567890",
    salaryMinStr: "8000000",
    salaryMaxStr: "12000000",
    deadlineStr: futureDateStr,
    applicationLink: "https://tambangmimika.com/apply",
    terms: true,
  };

  describe("createJobSchema (Full Schema)", () => {
    it("should validate a complete valid job posting", () => {
      const result = createJobSchema.safeParse(validJobData);
      assert.strictEqual(result.success, true);
    });

    it("should fail if salaryMax is lower than salaryMin", () => {
      const result = createJobSchema.safeParse({
        ...validJobData,
        salaryMinStr: "10000000",
        salaryMaxStr: "5000000",
      });
      assert.strictEqual(result.success, false);
    });

    it("should fail if application deadline has already passed", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const pastDateStr = pastDate.toISOString().split("T")[0];

      const result = createJobSchema.safeParse({
        ...validJobData,
        deadlineStr: pastDateStr,
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("step1Schema (Company Info)", () => {
    it("should validate Step 1 (Company Info) independently", () => {
      const result = step1Schema.safeParse({
        isNewCompany: true,
        newCompanyName: "PT Baru Mimika",
        newCompanyLocation: "Timika",
        newCompanyDesc: "Deskripsi perusahaan yang cukup panjang dan informatif lebih dari 20 huruf.",
        email: "hrd@perusahaan.com",
        picName: "Admin",
        imageUrl: null,
      });
      assert.strictEqual(result.success, true);
    });
  });

  describe("step2Schema (Job Details)", () => {
    it("should validate Step 2 (Job Details) independently", () => {
      const result = step2Schema.safeParse({
        title: "Staff IT Support",
        category: "Teknologi & IT",
        location: "Timika Kota",
        description: "Mengelola jaringan dan perangkat keras kantor cabang.",
        requirementsRaw: "Paham Mikrotik, Windows Server, troubleshooting LAN.",
        whatsapp: "081234567890",
        applicationLink: null,
        salaryMinStr: "4000000",
        salaryMaxStr: "6000000",
      });
      assert.strictEqual(result.success, true);
    });
  });

  describe("step3Schema (Requirements & Submission)", () => {
    it("should validate Step 3 (Requirements & Submission) independently", () => {
      const result = step3Schema.safeParse({
        type: "Kontrak",
        education: "D3 / S1",
        experience: "1-2 Tahun",
        gender: "Semua",
        ageRange: "Bebas",
        deadlineStr: futureDateStr,
        terms: true,
      });
      assert.strictEqual(result.success, true);
    });
  });
});
