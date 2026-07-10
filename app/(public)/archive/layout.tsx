import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal Archive — Browse Published Research Articles | IST Journal",
  description:
    "Browse the complete archive of peer-reviewed research articles published in IST Journal. Access published papers in Information Science, Technology, AI, and related disciplines. Free open-access download.",
  keywords: [
    "journal archive",
    "published research papers",
    "academic articles archive",
    "open access research archive",
    "scientific papers database",
    "research article library",
    "published journal issues",
    "IST Journal past issues",
    "free research paper download",
    "academic publication archive",
  ],
  alternates: { canonical: "https://ist-journal.com/archive" },
  openGraph: {
    title: "Journal Archive — Browse All Published Research | IST Journal",
    description:
      "Access the full archive of IST Journal's peer-reviewed, open-access research articles across all volumes and issues.",
    url: "https://ist-journal.com/archive",
  },
};

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
