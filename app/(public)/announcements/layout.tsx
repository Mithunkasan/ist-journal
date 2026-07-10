import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal Announcements — Latest News & Updates | IST Journal",
  description:
    "Stay up to date with the latest announcements from IST Journal including call for papers, special issues, editorial board updates, indexing achievements, and publication milestones.",
  keywords: [
    "journal announcements",
    "call for papers",
    "academic journal news",
    "research publication updates",
    "special issue call",
    "journal latest news",
    "IST Journal announcements",
    "scholarly journal updates",
  ],
  alternates: { canonical: "https://ist-journal.com/announcements" },
  openGraph: {
    title: "Announcements & News | IST Journal",
    description:
      "Latest announcements from IST Journal including calls for papers, special issues, and editorial updates.",
    url: "https://ist-journal.com/announcements",
  },
};

export default function AnnouncementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
