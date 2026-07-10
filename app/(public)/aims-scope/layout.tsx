import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aims & Scope — IST Journal Research Topics & Subject Areas",
  description:
    "Explore IST Journal's aims and scope covering Information Science, Computer Science, Artificial Intelligence, Data Science, Cybersecurity, and Technology research for global scholarly submission.",
  keywords: [
    "journal aims and scope",
    "information science research topics",
    "technology journal scope",
    "AI research publication",
    "data science journal",
    "computer science journal scope",
    "research manuscript subject areas",
    "journal submission topics",
    "scholarly research areas",
  ],
  alternates: { canonical: "https://ist-journal.com/aims-scope" },
  openGraph: {
    title: "Aims & Scope — IST Journal Research Topics",
    description:
      "Discover the broad research scope of IST Journal spanning AI, Data Science, Cybersecurity, IoT, and all Information & Technology disciplines.",
    url: "https://ist-journal.com/aims-scope",
  },
};

export default function AimsScopeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
