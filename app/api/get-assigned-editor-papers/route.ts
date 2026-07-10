import { withPrivateShortCache } from "@/lib/apiCache";
import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (req.method !== "GET") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    const journal = await prisma.assignedJournals.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        paperID: true,
        authorNames: true,
        authorEmail: true,
        type: true,
        title: true,
        abstract: true,
        keywords: true,
        paperUrl: true,
        primaryDomain: true,
        secondaryDomain: true,
        country: true,
        editorName: true,
        isPublished: true,
        associateEditor: true,
        isEditable: true,
        isReviewerAssigned: true,
        isAssigndToEditor: true,
        isAssociatedEditorAssigned: true,
        isSubmitted: true,
        createdAt: true,
        updatedAt: true,
        txtUrl: true,
        status: true,
        reviewers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            Status: true,
          },
        },
      },
    });

    return withPrivateShortCache(journal, 10);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
