import { withPrivateShortCache } from "../../../lib/apiCache";
import prisma from "../../../lib/prisma";
import { Status } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 100;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (statusParam) {
      // Validate that status matches a valid Status enum value
      if (Object.values(Status).includes(statusParam as Status)) {
        where.status = statusParam as Status;
      }
    }

    const journals = await prisma.submittedJournals.findMany({
      where,
      skip,
      take: limit,
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

    return withPrivateShortCache(journals, 10);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

