import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { paperID: string } }
) {
  const session = await auth();

  if (!session?.user?.id || (session.user.role !== "ASSOCIATE_EDITOR" && session.user.role !== "EDITOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const paperID = parseInt(params.paperID);

  try {
    // Query from new relational Review model, joining assignment and reviewer user details
    const reviews = await prisma.review.findMany({
      where: {
        assignment: {
          submission: {
            paperID: paperID
          }
        },
        recommendation: { not: null } // completed reviews have recommendations
      },
      include: {
        reviewer: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        submittedAt: "asc"
      }
    });

    // Format the response to be backward-compatible with the UI
    const formattedReviews = reviews.map((r) => ({
      id: r.id,
      paperID: paperID,
      reviewerId: r.reviewerId,
      reviewerName: r.reviewer.user?.name || "Reviewer",
      commentsToAuthor: r.commentsForAuthor,
      commentsToEditor: r.commentsForEditor,
      recommendation: r.recommendation,
      status: "COMPLETED",
      createdAt: r.submittedAt,
      updatedAt: r.submittedAt
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error("Error fetching paper reviews:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
