import type { MetadataRoute } from "next";

/**
 * Dynamic robots.txt — Next.js App Router
 * Allows all public pages; blocks all dashboard, auth, and API routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/aims-scope",
          "/editorial-board",
          "/archive",
          "/publish",
          "/indexing",
          "/journal-insights",
          "/announcements",
          "/conference",
          "/contact",
        ],
        disallow: [
          "/admin",
          "/author",
          "/editor",
          "/reviewer",
          "/associate-editor",
          "/api/",
          "/login",
          "/register",
          "/_next/",
        ],
      },
      // Prevent AI scrapers from training on content
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
    ],
    sitemap: "https://ist-journal.com/sitemap.xml",
    host: "https://ist-journal.com",
  };
}
