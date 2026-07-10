import prisma from "@/lib/prisma";
import { withPrivateCache } from "../../../lib/apiCache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body?.data || {};

    const authorName = data.authorName ? String(data.authorName) : "";
    const paperTitle = data.paperTitle ? String(data.paperTitle) : "";
    const paperType = data.paperType ? String(data.paperType) : "";
    const country = data.country ? String(data.country) : "";
    const editorName = data.editorName ? String(data.editorName) : "";

    const exist = await prisma.assignedJournals.findMany({
      where: {
        AND: [
          {
            authorNames: {
              contains: authorName,
              mode: "insensitive",
            },
          },
          {
            title: {
              contains: paperTitle,
              mode: "insensitive",
            },
          },
          {
            type: {
              contains: paperType,
              mode: "insensitive",
            },
          },
          {
            country: {
              contains: country,
              mode: "insensitive",
            },
          },
          {
            status: {
              notIn: ["ACCEPTED", "REJECTED", "ASSIGNED_TO_EDITOR"],
            },
          },
          ...(editorName
            ? [
                {
                  editorName: {
                    equals: editorName,
                  },
                },
              ]
            : []),
        ],
      },
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
      },
    });

    return withPrivateCache(exist);
  } catch (error) {
    console.error("Error filtering papers:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

