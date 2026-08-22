import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("7. Job Search, Multi-Filter & Presentation Logic", () => {
  const mockJobs = [
    {
      id: "job-1",
      title: "Mekanik Alat Berat",
      type: "Full Time",
      category: "Pertambangan",
      location: "Tembagapura, Timika",
      salaryMin: 8000000,
      salaryMax: 12000000,
      isSalaryNegotiable: false,
      status: "approved",
      createdAt: new Date("2026-08-20T10:00:00Z"),
      company: { name: "PT Freeport Partner" },
    },
    {
      id: "job-2",
      title: "Staff Akuntansi & Pajak",
      type: "Full Time",
      category: "Keuangan",
      location: "Kuala Kencana",
      salaryMin: 5000000,
      salaryMax: null,
      isSalaryNegotiable: false,
      status: "approved",
      createdAt: new Date("2026-08-15T08:00:00Z"),
      company: { name: "PT Papua Makmur" },
    },
    {
      id: "job-3",
      title: "Barista & Kasir Cafe",
      type: "Part Time",
      category: "F&B",
      location: "Timika Kota",
      salaryMin: null,
      salaryMax: null,
      isSalaryNegotiable: true,
      status: "pending",
      createdAt: new Date("2026-08-22T04:00:00Z"),
      company: { name: "Kopi Amungme" },
    },
    {
      id: "job-4",
      title: "Driver Operasional Logistik",
      type: "Kontrak",
      category: "Logistik",
      location: "Pelabuhan Poumako",
      salaryMin: null,
      salaryMax: null,
      isSalaryNegotiable: false,
      status: "rejected",
      createdAt: new Date("2026-08-10T02:00:00Z"),
      company: { name: "CV Poumako Jaya" },
    },
  ];

  // Helper for salary formatting
  const formatSalary = (job: typeof mockJobs[0]) => {
    if (job.salaryMin && job.salaryMax) {
      return `Rp ${job.salaryMin.toLocaleString("id-ID")} - Rp ${job.salaryMax.toLocaleString("id-ID")}`;
    } else if (job.salaryMin) {
      return `Mulai Rp ${job.salaryMin.toLocaleString("id-ID")}`;
    } else if (job.isSalaryNegotiable) {
      return "Negosiasi";
    }
    return "Dirahasiakan";
  };

  describe("Salary Formatting Logic", () => {
    it("should format min-max salary range correctly", () => {
      const formatted = formatSalary(mockJobs[0]);
      assert.strictEqual(formatted, "Rp 8.000.000 - Rp 12.000.000");
    });

    it("should format minimum salary only correctly", () => {
      const formatted = formatSalary(mockJobs[1]);
      assert.strictEqual(formatted, "Mulai Rp 5.000.000");
    });

    it("should display 'Negosiasi' when negotiable flag is true", () => {
      const formatted = formatSalary(mockJobs[2]);
      assert.strictEqual(formatted, "Negosiasi");
    });

    it("should display 'Dirahasiakan' when no salary details are present", () => {
      const formatted = formatSalary(mockJobs[3]);
      assert.strictEqual(formatted, "Dirahasiakan");
    });
  });

  describe("Search & Multi-Filter Logic", () => {
    it("should search jobs by position title", () => {
      const results = mockJobs.filter(j => j.title.toLowerCase().includes("mekanik"));
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].id, "job-1");
    });

    it("should search jobs by company name", () => {
      const results = mockJobs.filter(j => j.company.name.toLowerCase().includes("amungme"));
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].id, "job-3");
    });

    it("should search jobs by location", () => {
      const results = mockJobs.filter(j => j.location.toLowerCase().includes("poumako"));
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].id, "job-4");
    });

    it("should filter jobs by status", () => {
      const approvedJobs = mockJobs.filter(j => j.status === "approved");
      assert.strictEqual(approvedJobs.length, 2);

      const pendingJobs = mockJobs.filter(j => j.status === "pending");
      assert.strictEqual(pendingJobs.length, 1);
    });

    it("should combine status, category, and employment type filters", () => {
      const combined = mockJobs.filter(
        j => j.status === "approved" && j.category === "Pertambangan" && j.type === "Full Time"
      );
      assert.strictEqual(combined.length, 1);
      assert.strictEqual(combined[0].id, "job-1");
    });
  });

  describe("Sorting Algorithms", () => {
    it("should sort jobs by newest first", () => {
      const sorted = [...mockJobs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      assert.strictEqual(sorted[0].id, "job-3"); // 2026-08-22
      assert.strictEqual(sorted[sorted.length - 1].id, "job-4"); // 2026-08-10
    });

    it("should sort jobs alphabetically by title (A-Z)", () => {
      const sorted = [...mockJobs].sort((a, b) => a.title.localeCompare(b.title));
      assert.strictEqual(sorted[0].title, "Barista & Kasir Cafe");
      assert.strictEqual(sorted[sorted.length - 1].title, "Staff Akuntansi & Pajak");
    });
  });

  describe("Pagination Slicing", () => {
    it("should slice items correctly per page", () => {
      const itemsPerPage = 2;
      const page1 = mockJobs.slice(0, itemsPerPage);
      const page2 = mockJobs.slice(itemsPerPage, itemsPerPage * 2);

      assert.strictEqual(page1.length, 2);
      assert.strictEqual(page1[0].id, "job-1");
      assert.strictEqual(page2.length, 2);
      assert.strictEqual(page2[0].id, "job-3");
    });
  });
});
