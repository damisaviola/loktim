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
  adminLegacyLoginSchema,
  registerCompanySchema,
  loginCompanySchema,
  updateCompanyProfileSchema,
  createJobSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  updateJobSchema,
  contactFormSchema,
  reportJobSchema,
  newsletterSchema,
  categorySchema,
} from "./index";

describe("1. Common Primitives & Error Formatter", () => {
  describe("emailSchema", () => {
    it("should accept valid emails and trim/normalize them", () => {
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

  describe("phoneSchema", () => {
    it("should accept valid Indonesian phone formats", () => {
      const validPhones = ["081234567890", "+6281234567890", "0812-3456-7890", "(0901) 321123"];
      for (const phone of validPhones) {
        const result = phoneSchema.safeParse(phone);
        assert.strictEqual(result.success, true, `Expected ${phone} to be valid`);
      }
    });

    it("should reject too short or invalid character numbers", () => {
      const invalidPhones = ["1234", "08123abcde", ""];
      for (const phone of invalidPhones) {
        const result = phoneSchema.safeParse(phone);
        assert.strictEqual(result.success, false, `Expected ${phone} to be invalid`);
      }
    });
  });

  describe("whatsappSchema", () => {
    it("should accept 9-15 digit whatsapp numbers and optional/empty values", () => {
      assert.strictEqual(whatsappSchema.safeParse("081234567890").success, true);
      assert.strictEqual(whatsappSchema.safeParse("").success, true);
      assert.strictEqual(whatsappSchema.safeParse(null).success, true);
      assert.strictEqual(whatsappSchema.safeParse(undefined).success, true);
    });

    it("should reject numbers with fewer than 9 digits or more than 15 digits", () => {
      assert.strictEqual(whatsappSchema.safeParse("081234").success, false);
      assert.strictEqual(whatsappSchema.safeParse("081234567890123456").success, false);
    });
  });

  describe("urlSchema", () => {
    it("should accept valid http/https URLs and optional values", () => {
      assert.strictEqual(urlSchema.safeParse("https://lokertimika.com").success, true);
      assert.strictEqual(urlSchema.safeParse("http://perusahaan.co.id/career").success, true);
      assert.strictEqual(urlSchema.safeParse("").success, true);
      assert.strictEqual(urlSchema.safeParse(null).success, true);
    });

    it("should reject invalid protocols or strings", () => {
      assert.strictEqual(urlSchema.safeParse("ftp://invalid.com").success, false);
      assert.strictEqual(urlSchema.safeParse("bukan-url-valid").success, false);
    });
  });

  describe("formatZodErrors helper", () => {
    it("should correctly map issues to fieldErrors map", () => {
      const schema = categorySchema;
      const result = schema.safeParse({ name: "a" });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        const { fieldErrors } = formatZodErrors(result.error);
        assert.ok(fieldErrors.name);
        assert.match(fieldErrors.name, /minimal 2 karakter/i);
      }
    });
  });
});

describe("2. Auth & Admin Login Schemas", () => {
  describe("loginSchema (Company / User)", () => {
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

    it("should validate valid admin email format as username", () => {
      const valid = adminLoginSchema.safeParse({
        username: "admin@lokertimika.com",
        password: "securePassword123",
      });
      assert.strictEqual(valid.success, true);
    });

    it("should trim whitespace around username", () => {
      const result = adminLoginSchema.safeParse({
        username: "  admin_mimika  ",
        password: "password123",
      });
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.username, "admin_mimika");
      }
    });

    it("should fail when username is shorter than 3 characters", () => {
      const result = adminLoginSchema.safeParse({
        username: "ad",
        password: "password123",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        const { fieldErrors } = formatZodErrors(result.error);
        assert.ok(fieldErrors.username);
        assert.match(fieldErrors.username, /minimal 3 karakter/i);
      }
    });

    it("should fail when password is shorter than 6 characters", () => {
      const result = adminLoginSchema.safeParse({
        username: "admin_user",
        password: "123",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        const { fieldErrors } = formatZodErrors(result.error);
        assert.ok(fieldErrors.password);
        assert.match(fieldErrors.password, /minimal 6 karakter/i);
      }
    });

    it("should fail when username or password is empty", () => {
      const empty = adminLoginSchema.safeParse({
        username: "",
        password: "",
      });
      assert.strictEqual(empty.success, false);
      if (!empty.success) {
        const { fieldErrors } = formatZodErrors(empty.error);
        assert.ok(fieldErrors.username);
        assert.ok(fieldErrors.password);
      }
    });
  });
});

describe("3. Company Schemas", () => {
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

  it("should validate a complete valid company registration", () => {
    const result = registerCompanySchema.safeParse(validCompanyData);
    assert.strictEqual(result.success, true);
  });

  it("should fail when password and confirmPassword do not match", () => {
    const result = registerCompanySchema.safeParse({
      ...validCompanyData,
      confirmPassword: "DifferentPassword123!",
    });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      const { fieldErrors } = formatZodErrors(result.error);
      assert.ok(fieldErrors.confirmPassword);
      assert.match(fieldErrors.confirmPassword, /tidak cocok/i);
    }
  });

  it("should fail when company description (about) is under 20 characters", () => {
    const result = registerCompanySchema.safeParse({
      ...validCompanyData,
      about: "Terlalu pendek",
    });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      const { fieldErrors } = formatZodErrors(result.error);
      assert.ok(fieldErrors.about);
    }
  });

  it("should fail when agreeTerms is false", () => {
    const result = registerCompanySchema.safeParse({
      ...validCompanyData,
      agreeTerms: false,
    });
    assert.strictEqual(result.success, false);
  });

  it("should validate company profile updates", () => {
    const updateResult = updateCompanyProfileSchema.safeParse({
      name: "PT Baru Mimika",
      industry: "Logistik & Transportasi",
      location: "Portsite, Mimika",
      about: "Perusahaan logistik darat dan laut terpercaya di Papua Tengah.",
      website: "https://barumimika.co.id",
      picName: "Maria Korwa",
      phone: "082198765432",
      logoUrl: null,
    });
    assert.strictEqual(updateResult.success, true);
  });
});

describe("4. Job Posting Schemas", () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  const futureDateStr = futureDate.toISOString().split("T")[0];

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
    if (!result.success) {
      const { fieldErrors } = formatZodErrors(result.error);
      assert.ok(fieldErrors.salaryMaxStr);
      assert.match(fieldErrors.salaryMaxStr, /lebih kecil/i);
    }
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
    if (!result.success) {
      const { fieldErrors } = formatZodErrors(result.error);
      assert.ok(fieldErrors.deadlineStr);
      assert.match(fieldErrors.deadlineStr, /sudah lewat/i);
    }
  });

  it("should validate Step 1 (Company Info) independently", () => {
    const step1Valid = step1Schema.safeParse({
      isNewCompany: true,
      newCompanyName: "PT Baru",
      newCompanyLocation: "Timika",
      newCompanyDesc: "Deskripsi perusahaan yang cukup panjang dan informatif lebih dari 20 huruf.",
      email: "hrd@perusahaan.com",
      picName: "Admin",
      imageUrl: null,
    });
    assert.strictEqual(step1Valid.success, true);
  });

  it("should validate Step 2 (Job Details) independently", () => {
    const step2Valid = step2Schema.safeParse({
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
    assert.strictEqual(step2Valid.success, true);
  });

  it("should validate Step 3 (Requirements & Submission) independently", () => {
    const step3Valid = step3Schema.safeParse({
      type: "Kontrak",
      education: "D3 / S1",
      experience: "1-2 Tahun",
      gender: "Semua",
      ageRange: "Bebas",
      deadlineStr: futureDateStr,
      terms: true,
    });
    assert.strictEqual(step3Valid.success, true);
  });
});

describe("5. Contact Form Schemas", () => {
  it("should validate valid contact form submissions", () => {
    const result = contactFormSchema.safeParse({
      name: "Agus Pratama",
      email: "agus@gmail.com",
      phone: "081234567890",
      organization: "Komunitas Pemuda Timika",
      category: "general_question",
      subject: "Informasi Kerjasama Pemasangan Loker",
      message: "Halo admin, kami ingin berdiskusi mengenai kerjasama publikasi info loker untuk talenta lokal.",
    });
    assert.strictEqual(result.success, true);
  });

  it("should reject contact message if too short", () => {
    const result = contactFormSchema.safeParse({
      name: "Agus",
      email: "agus@gmail.com",
      phone: null,
      organization: null,
      category: "feedback",
      subject: "Hai",
      message: "Tes",
    });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      const { fieldErrors } = formatZodErrors(result.error);
      assert.ok(fieldErrors.message);
    }
  });
});

describe("6. Job Report & Newsletter Schemas", () => {
  it("should validate job reporting schema", () => {
    const valid = reportJobSchema.safeParse({
      jobId: "job_12345",
      reason: "Minta Biaya / Pungutan Liar",
      details: "Diminta transfer uang pendaftaran sebesar 500rb via WhatsApp.",
    });
    assert.strictEqual(valid.success, true);

    const invalid = reportJobSchema.safeParse({
      jobId: "",
      reason: "No",
    });
    assert.strictEqual(invalid.success, false);
  });

  it("should validate newsletter email subscription", () => {
    assert.strictEqual(newsletterSchema.safeParse({ email: "subscriber@gmail.com" }).success, true);
    assert.strictEqual(newsletterSchema.safeParse({ email: "invalid-email" }).success, false);
  });
});
