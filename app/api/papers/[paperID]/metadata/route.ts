// app/api/papers/[paperID]/metadata/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { paperID: string } }
) {
  const { paperID } = params;
  const numericPaperID = Number(paperID);

  if (isNaN(numericPaperID)) {
    return NextResponse.json({ error: "Invalid paper ID format" }, { status: 400 });
  }

  try {
    // 1. Attempt to find the paper in the Published table
    let paper: any = await prisma.published.findFirst({
      where: { paperID: numericPaperID },
    });

    // 2. Fallback to SubmittedJournals
    if (!paper) {
      paper = await prisma.submittedJournals.findFirst({
        where: { paperID: numericPaperID },
      });
    }

    // 3. Fallback to AssignedJournals
    if (!paper) {
      paper = await prisma.assignedJournals.findFirst({
        where: { paperID: numericPaperID },
      });
    }

    if (!paper) {
      return NextResponse.json({ error: "Paper metadata not found" }, { status: 404 });
    }

    // Extract publish / create date
    const dateObj = paper.createdAt ? new Date(paper.createdAt) : new Date();
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    // Parse authors
    const authorNamesList = paper.authorNames
      ? paper.authorNames.split(",").map((n: string) => n.trim())
      : [];
    const authorEmailsList = paper.authorEmail
      ? paper.authorEmail.split(",").map((e: string) => e.trim())
      : [];
    const keywordsList = paper.keywords
      ? paper.keywords.split(",").map((k: string) => k.trim())
      : [];

    // Parse URL parameter to check for Crossref format
    const format = request.nextUrl.searchParams.get("format");

    if (format === "crossref") {
      // Return Crossref deposit schema XML
      const crossrefXml = `<?xml version="1.0" encoding="UTF-8"?>
<doi_batch version="4.4.2" xmlns="http://www.crossref.org/schema/4.4.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.crossref.org/schema/4.4.2 http://www.crossref.org/schema/deposit/crossref4.4.2.xsd">
  <head>
    <doi_batch_id>istj_batch_${paper.paperID || paper.id}</doi_batch_id>
    <timestamp>${Date.now()}</timestamp>
    <depositor>
      <depositor_name>IST Journal Office</depositor_name>
      <email_address>editor@istjournal.ly</email_address>
    </depositor>
    <registrant>Faculty of Information Technology, University of Tripoli</registrant>
  </head>
  <body>
    <journal>
      <journal_metadata language="en">
        <full_title>IST Online Journal</full_title>
        <abbrev_title>ISTJ</abbrev_title>
        <issn media_type="electronic">2584-180X</issn>
      </journal_metadata>
      <journal_issue>
        <publication_date media_type="online">
          <year>${year}</year>
        </publication_date>
        <journal_volume>
          <volume>${escapeXml(paper.volume || "1")}</volume>
        </journal_volume>
        <issue>${escapeXml(paper.issue || "1")}</issue>
      </journal_issue>
      <journal_article publication_type="full_text">
        <titles>
          <title>${escapeXml(paper.title)}</title>
        </titles>
        <contributors>
          ${authorNamesList.map((name: string, idx: number) => {
            const parts = name.split(" ");
            const surname = parts[parts.length - 1] || "";
            const givenName = parts.slice(0, -1).join(" ") || name;
            return `
            <person_name sequence="${idx === 0 ? "first" : "additional"}" contributor_role="author">
              <given_name>${escapeXml(givenName)}</given_name>
              <surname>${escapeXml(surname)}</surname>
              ${paper.orcid && idx === 0 ? `<ORCID>https://orcid.org/${escapeXml(paper.orcid)}</ORCID>` : ""}
            </person_name>`;
          }).join("")}
        </contributors>
        <publication_date media_type="online">
          <month>${month}</month>
          <day>${day}</day>
          <year>${year}</year>
        </publication_date>
        <doi_data>
          <doi>${escapeXml(paper.doi || `10.5281/istj.Volume${paper.volume || "1"}.Issue${paper.issue || "1"}.${paper.paperID}`)}</doi>
          <resource>https://istjournal.ly/archive/published-paper/${paper.id}</resource>
        </doi_data>
      </journal_article>
    </journal>
  </body>
</doi_batch>`;

      return new NextResponse(crossrefXml, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Content-Disposition": `inline; filename="crossref_metadata_${paper.paperID}.xml"`,
        },
      });
    }

    // Default to NLM JATS XML Metadata Schema
    const jatsXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Publishing DTD v1.2 20190208//EN" "JATS-journalpublishing1.dtd">
<article article-type="research-article" dtd-version="1.2" xml:lang="en" xmlns:mml="http://www.w3.org/1998/Math/MathML" xmlns:xlink="http://www.w3.org/1999/xlink">
  <front>
    <journal-meta>
      <journal-id journal-id-type="publisher-id">ISTJ</journal-id>
      <journal-title-group>
        <journal-title>IST Online Journal</journal-title>
        <abbrev-journal-title abbrev-type="publisher">ISTJ</abbrev-journal-title>
      </journal-title-group>
      <issn pub-type="epub">2584-180X</issn>
      <publisher>
        <publisher-name>Faculty of Information Technology, University of Tripoli</publisher-name>
      </publisher>
    </journal-meta>
    <article-meta>
      <article-id pub-id-type="publisher-id">${paper.paperID || paper.id}</article-id>
      ${paper.doi ? `<article-id pub-id-type="doi">${escapeXml(paper.doi)}</article-id>` : ""}
      <article-categories>
        <subj-group subj-group-type="heading">
          <subject>${escapeXml(paper.category || "Information Technology")}</subject>
        </subj-group>
      </article-categories>
      <title-group>
        <article-title>${escapeXml(paper.title)}</article-title>
      </title-group>
      <contrib-group>
        ${authorNamesList.map((name: string, idx: number) => {
          const parts = name.split(" ");
          const surname = parts[parts.length - 1] || "";
          const givenName = parts.slice(0, -1).join(" ") || name;
          const email = authorEmailsList[idx] || authorEmailsList[0] || "";
          return `
        <contrib contrib-type="author">
          <name>
            <surname>${escapeXml(surname)}</surname>
            <given-names>${escapeXml(givenName)}</given-names>
          </name>
          ${email ? `<email>${escapeXml(email)}</email>` : ""}
          ${paper.orcid && idx === 0 ? `<contrib-id contrib-id-type="orcid">https://orcid.org/${escapeXml(paper.orcid)}</contrib-id>` : ""}
        </contrib>`;
        }).join("")}
      </contrib-group>
      <pub-date pub-type="epub">
        <day>${day}</day>
        <month>${month}</month>
        <year>${year}</year>
      </pub-date>
      <volume>${escapeXml(paper.volume || "1")}</volume>
      <issue>${escapeXml(paper.issue || "1")}</issue>
      <permissions>
        <copyright-statement>© ${year} IST Online Journal. All rights reserved.</copyright-statement>
        <license license-type="open-access" xlink:href="http://creativecommons.org/licenses/by/4.0/">
          <license-p>This work is licensed under a Creative Commons Attribution 4.0 International License.</license-p>
        </license>
      </permissions>
      <abstract>
        <p>${escapeXml(paper.abstract)}</p>
      </abstract>
      ${keywordsList.length > 0 ? `
      <kwd-group xml:lang="en">
        ${keywordsList.map((kwd: string) => `<kwd>${escapeXml(kwd)}</kwd>`).join("\n        ")}
      </kwd-group>` : ""}
    </article-meta>
  </front>
</article>`;

    return new NextResponse(jatsXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `inline; filename="jats_metadata_${paper.paperID}.xml"`,
      },
    });
  } catch (error) {
    console.error("Error generating XML metadata:", error);
    return NextResponse.json({ error: "Failed to generate metadata XML" }, { status: 500 });
  }
}
