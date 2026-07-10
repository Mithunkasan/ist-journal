import type { MetadataRoute } from "next";

const BASE_URL = "https://ist-journal.com";

/**
 * Dynamic XML Sitemap — Next.js App Router
 * Covers all public-facing routes.
 * Dashboard / auth routes are intentionally excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    /* ── Home ─────────────────────────────────────────────────────── */
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },

    /* ── About ────────────────────────────────────────────────────── */
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    /* ── Aims & Scope ─────────────────────────────────────────────── */
    {
      url: `${BASE_URL}/aims-scope`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    /* ── Editorial Board ──────────────────────────────────────────── */
    {
      url: `${BASE_URL}/editorial-board`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    /* ── Archive ──────────────────────────────────────────────────── */
    {
      url: `${BASE_URL}/archive`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    /* ── Publish / Author Guidelines ─────────────────────────────── */
    {
      url: `${BASE_URL}/publish`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },

    /* ── Indexing ─────────────────────────────────────────────────── */
    {
      url: `${BASE_URL}/indexing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    /* ── Journal Insights ─────────────────────────────────────────── */
    {
      url: `${BASE_URL}/journal-insights`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    /* ── Announcements ────────────────────────────────────────────── */
    {
      url: `${BASE_URL}/announcements`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },

    /* ── Conference ───────────────────────────────────────────────── */
    {
      url: `${BASE_URL}/conference`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },

    /* ── Contact ──────────────────────────────────────────────────── */
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
