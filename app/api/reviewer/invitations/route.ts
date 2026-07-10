import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "REVIEWER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const pendingReviews = await prisma.reviewLegacy.findMany({
      where: {
        reviewerId: session.user.id,
        status: "INVITED"
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        paperID: true,
        deadline: true,
        createdAt: true,
      },
    });

    const paperIds = pendingReviews.map((review) => review.paperID);
    const papers = await prisma.submittedJournals.findMany({
      where: { paperID: { in: paperIds } },
      select: {
        paperID: true,
        title: true,
        abstract: true,
        category: true,
      },
    });

    const papersById = new Map(papers.map((paper) => [paper.paperID, paper]));
    const enrichedInvitations = pendingReviews.flatMap((review) => {
      const paper = papersById.get(review.paperID);
      if (!paper) return [];

      return {
        reviewID: review.id,
        paperID: review.paperID,
        title: paper.title,
        abstract: paper.abstract,
        category: paper.category || "General",
        deadline: review.deadline,
        createdAt: review.createdAt,
      };
    });

    return NextResponse.json(enrichedInvitations);
  } catch (error) {
    console.error("Error fetching reviewer invitations:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
