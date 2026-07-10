import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IST Journal — Peer-Reviewed International Scientific & Technology Research",
  description:
    "IST Journal publishes peer-reviewed research in Information Science & Technology. Submit your research paper online for double-blind peer review. Open access. ISSN: 2584-180X.",
  keywords: [
    "IST Journal home",
    "academic journal submission",
    "peer reviewed research publication",
    "online manuscript submission",
    "open access science journal",
    "research paper submission portal",
    "scholarly publishing platform",
    "ISSN 2584-180X",
    "information technology research journal",
  ],
  alternates: {
    canonical: "https://ist-journal.com",
  },
  openGraph: {
    title: "IST Journal — International Scientific & Technological Research Publication",
    description:
      "Submit your research manuscript to IST Journal — peer-reviewed, open-access, internationally indexed. ISSN: 2584-180X.",
    url: "https://ist-journal.com",
    images: [{ url: "/uploads/journalimage.webp", width: 1200, height: 630, alt: "IST Journal" }],
  },
};

import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
