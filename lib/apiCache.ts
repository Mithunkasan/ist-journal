import { NextResponse } from "next/server";

/**
 * Wraps a NextResponse with HTTP caching headers.
 *
 * @param data         — The JSON data to return
 * @param maxAge       — How long (seconds) the browser/CDN should cache the response (default: 30s)
 * @param staleWhileRevalidate — Extra seconds for stale-while-revalidate (default: 60s)
 * @param status       — HTTP status code (default: 200)
 *
 * How it works:
 * - `s-maxage`              → CDN (Vercel Edge, Cloudflare) caches for this long
 * - `stale-while-revalidate` → Serve stale cache while revalidating in background
 * - `public`               → Allow CDN/proxy caching
 *
 * For mutation routes (POST/PATCH/DELETE), do NOT use this — they must not be cached.
 */
export function withCache(
  data: unknown,
  maxAge = 30,
  staleWhileRevalidate = 60,
  status = 200
): NextResponse {
  const res = NextResponse.json(data, { status });
  res.headers.set(
    "Cache-Control",
    `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  );
  return res;
}

/**
 * Returns a NextResponse with no-cache headers (for private/user-specific data).
 */
export function withPrivateCache(data: unknown, status = 200): NextResponse {
  const res = NextResponse.json(data, { status });
  res.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate"
  );
  return res;
}

/**
 * Short browser-only cache for private GET responses that are safe to reuse
 * briefly, such as dashboard list reads and user lookup lists.
 */
export function withPrivateShortCache(
  data: unknown,
  maxAge = 10,
  status = 200
): NextResponse {
  const res = NextResponse.json(data, { status });
  res.headers.set("Cache-Control", `private, max-age=${maxAge}, must-revalidate`);
  return res;
}
