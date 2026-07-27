import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [reviews, papers] = await Promise.all([
      prisma.reviewLegacy.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.submittedJournals.findMany({
        select: {
          paperID: true,
          title: true,
        },
      }),
    ]);

    // Create a map of paperID to title
    const paperTitles = new Map<number, string>();
    papers.forEach((p) => {
      if (p.paperID) {
        paperTitles.set(p.paperID, p.title || "");
      }
    });

    const reviewsWithTitles = reviews.map((review) => ({
      ...review,
      paperTitle: paperTitles.get(review.paperID) || "Unknown Title",
    }));

    return NextResponse.json(reviewsWithTitles);
  } catch (error) {
    console.error("Error fetching reviews for admin:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
