import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Board — IST Journal Expert Reviewers & Academic Editors",
  description:
    "Meet the IST Journal editorial board — distinguished academics and research experts who oversee the peer review process, ensure scientific quality, and guide editorial decisions for published research.",
  keywords: [
    "IST Journal editorial board",
    "academic journal editors",
    "peer review board members",
    "research journal committee",
    "editorial advisory board",
    "scientific committee journal",
    "journal editor in chief",
    "associate editors academic journal",
  ],
  alternates: { canonical: "https://ist-journal.com/editorial-board" },
  openGraph: {
    title: "Editorial Board — IST Journal Expert Academic Editors",
    description:
      "Explore the distinguished editorial board of IST Journal, comprising leading international researchers and academics who uphold the highest standards of scholarly peer review.",
    url: "https://ist-journal.com/editorial-board",
  },
};

export default function EditorialBoardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
