import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ASSOCIATE_EDITOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { selectedPaperId: true }
    });

    const whereClause: any = {
      NOT: {
        status: "UNDER_EDITOR_REVIEW"
      }
    };

    if (user?.selectedPaperId) {
      whereClause.paperID = user.selectedPaperId;
    } else {
      whereClause.OR = [
        { associateEditor: session.user.name },
        { editorName: session.user.name }
      ];
    }

    const papers = await prisma.assignedJournals.findMany({
      where: whereClause,
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
