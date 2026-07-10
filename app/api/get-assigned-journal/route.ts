import prisma from "@/lib/prisma";
import { withPrivateShortCache } from "../../../lib/apiCache";

export async function POST(request: any) {
  try {
    const Users = await prisma.assignedJournals.findMany({
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            Status: true,
            createdDate: true,
            updatedAt: true,
            areaOfExpertise: true,
          },
        },
        reviewers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            Status: true,
            createdDate: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        txtUrl: true,
        status: true,
      },
    });
    return withPrivateShortCache(Users, 10);
  } catch (error) {
    console.error("Error Assigned Journals data:", error);
    return new Response("Failed to fetch Assigned Journals data", {
      status: 500,
    });
  }
}

