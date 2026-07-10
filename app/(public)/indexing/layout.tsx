import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indexing & Abstracting — IST Journal Global Database Listings",
  description:
    "IST Journal is indexed in leading academic databases and abstracting services worldwide. Discover all major indexing platforms including Scopus, Google Scholar, DOAJ, and more for global research visibility.",
  keywords: [
    "journal indexing",
    "Scopus indexed journal",
    "Google Scholar indexed",
    "DOAJ open access journal",
    "academic database listing",
    "research journal abstracting",
    "IST Journal indexing",
    "international journal indexing services",
    "research visibility database",
  ],
  alternates: { canonical: "https://ist-journal.com/indexing" },
  openGraph: {
    title: "Indexing & Abstracting Services | IST Journal",
    description:
      "IST Journal's global indexing coverage across major academic databases for maximum research visibility and citation impact.",
    url: "https://ist-journal.com/indexing",
  },
};

export default function IndexingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
