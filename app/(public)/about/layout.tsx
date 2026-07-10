import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About IST Journal — Mission, History & Open-Access Academic Publishing",
  description:
    "Learn about IST Journal's mission to advance global scientific knowledge through rigorous peer review, open access publishing, and international collaboration in Information Science & Technology.",
  keywords: [
    "about IST Journal",
    "academic journal mission",
    "open access publishing",
    "scientific research journal",
    "scholarly publishing platform history",
    "international academic journal",
    "peer review journal about",
  ],
  alternates: { canonical: "https://ist-journal.com/about" },
  openGraph: {
    title: "About IST Journal — Mission & Open-Access Academic Publishing",
    description:
      "Discover IST Journal's commitment to advancing global science through rigorous peer review and open-access publication of Information Science & Technology research.",
    url: "https://ist-journal.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
