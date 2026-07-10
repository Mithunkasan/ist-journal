// next.config.js

/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevents clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevents MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy for privacy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disables browser features not needed
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Strict Transport Security (HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

module.exports = {
  // ── Performance ──────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ── Images ───────────────────────────────────────────────────────
  images: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "mirrors.creativecommons.org",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── Security Headers ─────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // ── Webpack (node file loader) ────────────────────────────────────
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.node$/,
      use: "file-loader",
    });
    return config;
  },
};
