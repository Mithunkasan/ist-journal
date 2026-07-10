import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const body = await request.json();
  const {
    rejectedPerson,
    rejectedReasons,
    type,
    title,
    paperID,
    abstract,
    paperUrl,
    primaryDomain,
    secondaryDomain,
    country,
    authorNames,
    authorEmail,
    editorName,
    updatedAt,
    isAssigndToEditor,
    isAssociatedEditorAssigned,
    isReviewerAssigned,
    isSubmitted,
    createdAt,
    status,
  } = body.data;

  try {
    const journal = await prisma.rejectedJournal.create({
      data: {
        rejectedPerson,
        rejectedReasons,
        type,
        title,
        paperID,
        abstract,
        paperUrl,
        primaryDomain,
        secondaryDomain,
        country,
        editorName,
        authorNames,
        authorEmail,
        updatedAt,
        isAssigndToEditor,
        isAssociatedEditorAssigned,
        isReviewerAssigned,
        isSubmitted,
        createdAt: new Date(),
        status,
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
