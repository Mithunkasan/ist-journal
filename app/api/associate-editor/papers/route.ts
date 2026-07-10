import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ASSOCIATE_EDITOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const papers = await prisma.assignedJournals.findMany({
      where: {
        associateEditor: session.user.name,
        NOT: {
          status: "UNDER_EDITOR_REVIEW"
        }
      },
      select: {
        id: true,
        paperID: true,
        type: true,
        title: true,
        abstract: true,
        paperUrl: true,
        primaryDomain: true,
        secondaryDomain: true,
        country: true,
        authorNames: true,
        authorEmail: true,
        keywords: true,
        associateEditor: true,
        isReviewerAssigned: true,
        status: true,
        category: true,
        supportingFilesUrl: true,
        doi: true,
        productionStep: true,
        revisionComments: true,
        responseLetterUrl: true,
        updatedAt: true,
        createdAt: true,
        reviewers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(papers);
  } catch (error) {
    console.error("Error fetching associate editor papers:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
