import SecondaryNavbar from "@/components/layout/nav-secondary";
// import "../globals.css";

export const metadata = {
  title: "Submit Your Research Manuscript — Author Guidelines | IST Journal",
  description:
    "Submit your research paper to IST Journal. Read our comprehensive author guidelines, manuscript formatting requirements, peer review process, and publication ethics for online submission.",
  keywords: [
    "submit research paper online",
    "manuscript submission guidelines",
    "author instructions journal",
    "online manuscript submission system",
    "academic paper submission process",
    "scholarly article submission",
    "how to submit research paper",
    "journal publication guidelines",
  ],
  alternates: { canonical: "https://ist-journal.com/publish" },
  openGraph: {
    title: "Submit Research Manuscript — Author Guidelines | IST Journal",
    description:
      "Comprehensive guide for submitting your research manuscript to IST Journal including formatting requirements, peer review workflow, and publication policies.",
    url: "https://ist-journal.com/publish",
  },
};

export default async function RootPublishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SecondaryNavbar />
      {children}
    </div>
  );
}
