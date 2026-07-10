import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const body = await request.json();
  const {
    editorName,
    type,
    title,
    abstract,
    paperID,
    paperUrl,
    primaryDomain,
    secondaryDomain,
    country,
    keywords,
    authorNames,
    authorEmail,
    updatedAt,
    isAssigndToEditor,
    isAssociatedEditorAssigned,
    isReviewerAssigned,
    isSubmitted,
    isPublished,
    associateEditor,
    issue,
    volume,
    createdAt,
    status,
    doi,
    orcid,
  } = body.data;

  try {
    const journal = await prisma.published.create({
      data: {
        editorName,
        associateEditor,
        type,
        keywords,
        title,
        paperID,
        abstract,
        paperUrl,
        primaryDomain,
        secondaryDomain,
        country,
        authorNames,
        authorEmail,
        issue,
        volume,
        updatedAt,
        isSubmitted,
        isAssigndToEditor,
        isReviewerAssigned,
        isPublished,
        isAssociatedEditorAssigned,
        createdAt: new Date(),
        status: "PUBLISHED",
        doi,
        orcid,
      },
    });

    return NextResponse.json(journal); // Use NextResponse.json here
  } catch (error) {
    console.error("Error creating Assigned journal entry:", error);
    return new NextResponse("Failed to Assigned journal entry", {
      status: 500,
    });
  }
}
