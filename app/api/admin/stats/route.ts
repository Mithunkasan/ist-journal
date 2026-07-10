import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [totalUsers, totalSubmissions, pendingReviews, publishedPapers] = await Promise.all([
      prisma.user.count(),
      prisma.submittedJournals.count(),
      // Pending reviews could mean assigned to a reviewer but not yet accepted or rejected
      prisma.assignedJournals.count({
        where: {
          isReviewerAssigned: true,
          status: {
            notIn: ["ACCEPTED", "REJECTED", "PUBLISHED"],
          },
        },
      }),
      prisma.published.count(),
    ]);

    return NextResponse.json({
      totalUsers,
      totalSubmissions,
      pendingReviews,
      publishedPapers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
