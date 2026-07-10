import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "REVIEWER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const papers = await prisma.assignedJournals.findMany({
      where: {
        reviewers: {
          some: {
            id: session.user.id,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
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
        updatedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(papers);
  } catch (error) {
    console.error("Error fetching reviewer papers:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
