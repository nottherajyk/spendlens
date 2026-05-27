// Simple in-memory IP-based rate limiter
// TODO: this rate limit is in-memory and won't work in a multi-instance serverless deploy. Move to Redis (Upstash) at scale.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Check if an IP has exceeded the rate limit.
 * @param ip - The IP address to check
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 1 hour)
 * @returns true if the request is allowed, false if rate limited
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get remaining requests for an IP
 */
export function getRemainingRequests(
  ip: string,
  maxRequests: number = 10
): number {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    return maxRequests;
  }

  return Math.max(0, maxRequests - entry.count);
}
