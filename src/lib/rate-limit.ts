import { headers } from "next/headers";

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitStore>();

// Cleanup stale keys periodically to avoid memory leaks
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (now > value.resetAt) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  if (typeof cleanupTimer.unref === "function") {
    cleanupTimer.unref();
  }
}

/**
 * Gets client IP address from Next.js request headers
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = headerList.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
  } catch (error) {
    // Ignore error if outside request context
  }
  return "127.0.0.1";
}

/**
 * Check and record rate limit for a specific action and key
 * @param action Prefix identifier for the action (e.g. 'post_job', 'login', 'report')
 * @param identifier Unique key like IP address or user ID
 * @param limit Maximum allowed requests in the time window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  action: string,
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; error?: string; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const key = `${action}:${identifier}`;
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
    const minutes = Math.ceil(resetInSeconds / 60);
    return {
      success: false,
      error: `Terlalu banyak permintaan. Silakan coba lagi dalam ${minutes > 1 ? `${minutes} menit` : `${resetInSeconds} detik`}.`,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.count += 1;
  store.set(key, record);

  return {
    success: true,
    remaining: limit - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}
