import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact IST Journal — Editorial Office & Submission Support",
  description:
    "Contact the IST Journal editorial office for submission support, peer review inquiries, publication status updates, or general academic publishing questions. We respond within 2 business days.",
  keywords: [
    "contact IST Journal",
    "journal editorial office",
    "submission support",
    "academic publishing contact",
    "research journal contact",
    "editorial contact",
    "manuscript inquiry",
  ],
  alternates: { canonical: "https://ist-journal.com/contact" },
  openGraph: {
    title: "Contact IST Journal — Editorial Office",
    description:
      "Reach the IST Journal editorial team for submission inquiries, peer review questions, and publication support.",
    url: "https://ist-journal.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
