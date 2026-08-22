import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit } from "@/lib/rate-limit";

describe("5. Rate Limiting System", () => {
  it("should allow requests under the defined limit", () => {
    const testId = `test-ip-${Date.now()}-1`;
    const action = "contact_form";
    const limit = 3;
    const windowMs = 5000;

    const res1 = checkRateLimit(action, testId, limit, windowMs);
    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.remaining, 2);

    const res2 = checkRateLimit(action, testId, limit, windowMs);
    assert.strictEqual(res2.success, true);
    assert.strictEqual(res2.remaining, 1);

    const res3 = checkRateLimit(action, testId, limit, windowMs);
    assert.strictEqual(res3.success, true);
    assert.strictEqual(res3.remaining, 0);
  });

  it("should block requests when exceeding limit and return helpful retry message", () => {
    const testId = `test-ip-${Date.now()}-2`;
    const action = "login_attempt";
    const limit = 2;
    const windowMs = 60000;

    checkRateLimit(action, testId, limit, windowMs);
    checkRateLimit(action, testId, limit, windowMs);

    const blocked = checkRateLimit(action, testId, limit, windowMs);
    assert.strictEqual(blocked.success, false);
    assert.strictEqual(blocked.remaining, 0);
    assert.ok(blocked.error?.includes("Terlalu banyak permintaan"));
  });

  it("should isolate limits between different actions for the same identifier", () => {
    const testId = `test-ip-${Date.now()}-3`;
    
    // Action A
    const resA1 = checkRateLimit("action_a", testId, 1, 10000);
    assert.strictEqual(resA1.success, true);
    const resA2 = checkRateLimit("action_a", testId, 1, 10000);
    assert.strictEqual(resA2.success, false);

    // Action B with same IP should still be allowed
    const resB1 = checkRateLimit("action_b", testId, 1, 10000);
    assert.strictEqual(resB1.success, true);
  });

  it("should isolate limits between different identifiers for the same action", () => {
    const action = "report_job";
    const ip1 = `ip-alpha-${Date.now()}`;
    const ip2 = `ip-beta-${Date.now()}`;

    checkRateLimit(action, ip1, 1, 10000);
    const ip1Blocked = checkRateLimit(action, ip1, 1, 10000);
    assert.strictEqual(ip1Blocked.success, false);

    const ip2Allowed = checkRateLimit(action, ip2, 1, 10000);
    assert.strictEqual(ip2Allowed.success, true);
  });
});
