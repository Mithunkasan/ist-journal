import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [submittedPapers, assignedPapers, reviewAssignments] = await Promise.all([
      prisma.submittedJournals.findMany({
        orderBy: {
          updatedAt: "desc",
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
          isAssociatedEditorAssigned: true,
          isReviewerAssigned: true,
          status: true,
          category: true,
          updatedAt: true,
          createdAt: true,
          coverLetterUrl: true,
          supportingFilesUrl: true,
          doi: true,
          orcid: true,
        },
      }),
      prisma.assignedJournals.findMany({
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
          isAssociatedEditorAssigned: true,
          isReviewerAssigned: true,
          status: true,
          category: true,
          updatedAt: true,
          createdAt: true,
          coverLetterUrl: true,
          supportingFilesUrl: true,
          doi: true,
          orcid: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          reviewers: {
            select: {
              name: true,
              id: true,
              email: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.submission.findMany({
        select: {
          paperID: true,
          reviewAssignments: {
            select: {
              reviewer: {
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    const papersByPaperId = new Map<number, any>();
    const reviewersByPaperId = new Map<number, any[]>();

    reviewAssignments.forEach((submission) => {
      if (submission.paperID === null || submission.paperID === undefined) return;
      const reviewers = submission.reviewAssignments
        .map((assignment) => assignment.reviewer.user)
        .filter(Boolean)
        .filter((reviewer, index, all) => {
          return all.findIndex((item) => item.id === reviewer.id) === index;
        });

      reviewersByPaperId.set(submission.paperID, reviewers);
    });

    submittedPapers.forEach((paper) => {
      if (!paper.paperID) return;

      papersByPaperId.set(paper.paperID, {
        ...paper,
        reviewers: reviewersByPaperId.get(paper.paperID) || [],
        user: null,
      });
    });

    assignedPapers.forEach((paper) => {
      if (!paper.paperID) return;

      const reviewers = reviewersByPaperId.get(paper.paperID);

      papersByPaperId.set(paper.paperID, {
        ...paper,
        reviewers: reviewers?.length ? reviewers : (paper.reviewers || []),
      });
    });

    const papers = Array.from(papersByPaperId.values())
      .sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

    return NextResponse.json(papers);
  } catch (error) {
    console.error("Error fetching admin submissions:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
