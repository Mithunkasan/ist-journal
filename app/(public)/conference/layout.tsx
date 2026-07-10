import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "International Conference — IST Journal Academic Research Events",
  description:
    "Explore IST Journal's international academic conferences and research events. Submit papers, attend workshops, and collaborate with scientists and researchers worldwide in Information Science & Technology.",
  keywords: [
    "international science conference",
    "academic research conference",
    "technology research event",
    "scientific conference submission",
    "research collaboration conference",
    "academic workshop events",
    "IST Journal conference",
    "online academic conference",
  ],
  alternates: { canonical: "https://ist-journal.com/conference" },
  openGraph: {
    title: "International Conference — IST Journal Research Events",
    description:
      "Join IST Journal's international academic conferences connecting researchers worldwide in Information Science & Technology.",
    url: "https://ist-journal.com/conference",
  },
};

export default function ConferenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
