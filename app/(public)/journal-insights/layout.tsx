import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal Insights — Impact Factor, Citation Metrics & Statistics | IST Journal",
  description:
    "Access IST Journal's publication metrics, citation statistics, impact factor data, acceptance rates, and journal performance insights for authors and researchers evaluating submission suitability.",
  keywords: [
    "journal impact factor",
    "citation metrics journal",
    "journal statistics",
    "academic journal insights",
    "publication metrics",
    "journal acceptance rate",
    "h-index journal",
    "research journal performance",
    "IST Journal statistics",
    "journal quality metrics",
  ],
  alternates: { canonical: "https://ist-journal.com/journal-insights" },
  openGraph: {
    title: "Journal Insights — Impact Metrics & Publication Statistics | IST Journal",
    description:
      "Explore IST Journal's citation metrics, impact factor, acceptance rate, and comprehensive publication statistics.",
    url: "https://ist-journal.com/journal-insights",
  },
};

export default function JournalInsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
