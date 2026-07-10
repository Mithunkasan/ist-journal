import { withCache } from "../../../lib/apiCache";
import prisma from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const publishedPapers = await prisma.published.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        editorName: true,
        associateEditor: true,
        type: true,
        title: true,
        paperID: true,
        volume: true,
        issue: true,
        isSubmitted: true,
        isAssigndToEditor: true,
        isReviewerAssigned: true,
        isAssociatedEditorAssigned: true,
        isPublished: true,
        paperUrl: true,
        abstract: true,
        country: true,
        primaryDomain: true,
        secondaryDomain: true,
        authorNames: true,
        authorEmail: true,
        keywords: true,
        updatedAt: true,
        createdAt: true,
        status: true,
        doi: true,
        orcid: true,
      },
    });

    return withCache(publishedPapers, 30, 60);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
