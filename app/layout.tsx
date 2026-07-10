import "./globals.css";
import { Suspense } from "react";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import { ReduxStoreProvider } from "./Provider";
import AuthProvider from "@/components/layout/auth-provider";
import { LanguageProvider } from "@/lib/LanguageContext";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import type { Metadata, Viewport } from "next";

/* ─── Viewport export (Next.js 14 best practice) ─────────────────────────── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#004b23",
};

/* ─── Root Metadata ───────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL("https://ist-journal.com"),

  title: {
    default:
      "IST Journal — International Scientific & Technological Research Publication",
    template: "%s | IST Journal",
  },

  description:
    "IST Journal is a peer-reviewed, open-access academic journal publishing monthly research in Information Science & Technology. Submit your manuscript online today. ISSN: 2584-180X",

  keywords: [
    // Target keyword groups
    "research paper submission",
    "academic publishing",
    "journal management system",
    "peer review process",
    "scientific research publication",
    "online manuscript submission",
    "scholarly publishing platform",
    "research article management",
    "academic journal workflow",
    "research collaboration platform",
    // Additional brand & topical keywords
    "IST Journal",
    "open access journal",
    "information science journal",
    "technology research journal",
    "international scientific journal",
    "double blind peer review",
    "academic paper submission online",
    "research journal ISSN 2584-180X",
    "submit research manuscript",
    "indexed academic journal",
  ],

  authors: [{ name: "IST Journal Editorial Board", url: "https://ist-journal.com/editorial-board" }],
  creator: "IST Journal",
  publisher: "International Scientific and Technological Journal",

  /* ── Open Graph ──────────────────────────────────────────────────────────── */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ist-journal.com",
    siteName: "IST Journal",
    title: "IST Journal — International Scientific & Technological Research Publication",
    description:
      "A peer-reviewed, open-access journal publishing cutting-edge research in Information Science & Technology. Submit manuscripts online. ISSN: 2584-180X",
    images: [
      {
        url: "/uploads/journalimage.webp",
        width: 1200,
        height: 630,
        alt: "IST Journal — International Scientific and Technological Journal",
      },
    ],
  },

  /* ── Twitter Card ────────────────────────────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "IST Journal — International Scientific & Technological Research",
    description:
      "Peer-reviewed, open-access academic journal. Submit your research manuscript online. ISSN: 2584-180X",
    images: ["/uploads/journalimage.webp"],
    creator: "@ISTJournal",
    site: "@ISTJournal",
  },

  /* ── Robots ──────────────────────────────────────────────────────────────── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Canonical ───────────────────────────────────────────────────────────── */
  alternates: {
    canonical: "https://ist-journal.com",
    languages: {
      "en-US": "https://ist-journal.com",
      "ar": "https://ist-journal.com",
    },
  },

  /* ── Verification ────────────────────────────────────────────────────────── */
  verification: {
    google: "your-google-site-verification-token",
  },

  /* ── App metadata ────────────────────────────────────────────────────────── */
  applicationName: "IST Journal",
  referrer: "origin-when-cross-origin",
  category: "Academic Publishing",
};

/* ─── Schema.org JSON-LD ──────────────────────────────────────────────────── */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "International Scientific and Technological Journal",
  alternateName: "IST Journal",
  url: "https://ist-journal.com",
  logo: "https://ist-journal.com/uploads/journalimage.webp",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Editorial",
    url: "https://ist-journal.com/contact",
    availableLanguage: ["English", "Arabic"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "IST Journal",
  url: "https://ist-journal.com",
  description:
    "Peer-reviewed, open-access academic journal for Information Science & Technology research.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://ist-journal.com/archive?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const scholarlyArticleSchema = {
  "@context": "https://schema.org",
  "@type": "Periodical",
  name: "IST Journal",
  issn: "2584-180X",
  publisher: {
    "@type": "Organization",
    name: "International Scientific and Technological Journal",
  },
  inLanguage: ["en", "ar"],
  isAccessibleForFree: true,
  url: "https://ist-journal.com",
};

/* ─── Root Layout ─────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(scholarlyArticleSchema),
          }}
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${cx(sfPro.variable, inter.variable)} flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <ReduxStoreProvider>
            <AuthProvider>
              <Suspense fallback={null} />
              <LoadingOverlay />
              <main className="flex-1">{children}</main>
            </AuthProvider>
          </ReduxStoreProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
