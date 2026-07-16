import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "AUTHOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true }
    });

    if (!user?.email) {
      return new NextResponse("User email not found", { status: 400 });
    }

    const [submitted, assigned, published, rejected] = await Promise.all([
      prisma.submittedJournals.findMany({
        where: { authorEmail: { contains: user.email, mode: 'insensitive' } },
        orderBy: { updatedAt: 'desc' },
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
          isSubmitted: true,
          isAssigndToEditor: true,
          isReviewerAssigned: true,
          isAssociatedEditorAssigned: true,
          isPublished: true,
          status: true,
          category: true,
          updatedAt: true,
          createdAt: true,
          supportingFilesUrl: true,
          coverLetterUrl: true,
          orcid: true,
        },
      }),
      prisma.assignedJournals.findMany({
        where: { authorEmail: { contains: user.email, mode: 'insensitive' } },
        orderBy: { updatedAt: 'desc' },
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
          isSubmitted: true,
          isAssigndToEditor: true,
          isReviewerAssigned: true,
          isAssociatedEditorAssigned: true,
          isPublished: true,
          status: true,
          category: true,
          updatedAt: true,
          createdAt: true,
          supportingFilesUrl: true,
          coverLetterUrl: true,
          orcid: true,
        },
      }),
      prisma.published.findMany({
        where: { authorEmail: { contains: user.email, mode: 'insensitive' } },
        orderBy: { updatedAt: 'desc' },
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
          isSubmitted: true,
          isAssigndToEditor: true,
          isReviewerAssigned: true,
          isAssociatedEditorAssigned: true,
          isPublished: true,
          status: true,
          volume: true,
          issue: true,
          updatedAt: true,
          createdAt: true,
          coverLetterUrl: true,
          orcid: true,
        },
      }),
      prisma.rejectedJournal.findMany({
        where: { authorEmail: { contains: user.email, mode: 'insensitive' } },
        orderBy: { updatedAt: 'desc' },
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
          isSubmitted: true,
          isAssigndToEditor: true,
          isReviewerAssigned: true,
          isAssociatedEditorAssigned: true,
          status: true,
          rejectedPerson: true,
          rejectedReasons: true,
          updatedAt: true,
          createdAt: true,
          coverLetterUrl: true,
        },
      }),
    ]);

    // Use paperID as the unique identifier to combine results
    // We prioritize more advanced states (published > assigned > submitted)
    const papersMap = new Map();

    submitted.forEach(p => papersMap.set(p.paperID, p));
    assigned.forEach(p => papersMap.set(p.paperID, p));
    rejected.forEach(p => papersMap.set(p.paperID, p));
    published.forEach(p => papersMap.set(p.paperID, p));

    const combinedPapers = Array.from(papersMap.values()).sort((a: any, b: any) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json(combinedPapers);
  } catch (error) {
    console.error("Error fetching author papers:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
