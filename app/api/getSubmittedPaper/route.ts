import { withPrivateShortCache } from "../../../lib/apiCache";
import prisma from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const response = await prisma.submittedJournals.findMany({
      where: {
        isAccepted: false,
      },
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
        howToKnow: true,
        isSubmitted: true,
        isAssigndToEditor: true,
        associateEditor: true,
        isReviewerAssigned: true,
        isAssociatedEditorAssigned: true,
        isPublished: true,
        updatedAt: true,
        createdAt: true,
        isAccepted: true,
        status: true,
        supportingFilesUrl: true,
        category: true,
        doi: true,
        productionStep: true,
        revisionComments: true,
        responseLetterUrl: true,
        orcid: true,
      },
    });
    return withPrivateShortCache(response, 10);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
