import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const body = await request.json();
  const {
    userId,
    type,
    title,
    abstract,
    paperUrl,
    primaryDomain,
    secondaryDomain,
    country,
    authorNames,
    authorEmail,
    howToKnow,
    editorName,
    paperID,
    keywords,
  } = body.data;

  try {
    const journal = await prisma.assignedJournals.create({
      data: {
        type,
        title,
        abstract,
        paperUrl,
        primaryDomain,
        secondaryDomain,
        country,
        authorNames,
        authorEmail,
        howToKnow,
        editorName,
        paperID,
        createdAt: new Date(),
        status: "ASSIGNED_TO_EDITOR",
        isSubmitted: true,
        isAssigndToEditor: true,
        keywords,
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(journal); // Use NextResponse.json here
  } catch (error) {
    return new NextResponse("Failed to Assigned journal entry", {
      status: 500,
    });
  }
}
