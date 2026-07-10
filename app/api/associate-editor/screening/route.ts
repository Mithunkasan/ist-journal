import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ASSOCIATE_EDITOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Fetch all submitted journals that haven't been assigned to an editor yet
    // This serves as the queue for initial screening
    const papers = await prisma.submittedJournals.findMany({
      where: {
        status: "UNDER_EDITOR_REVIEW",
        associateEditor: session.user.name,
      },
      orderBy: {
        createdAt: 'desc',
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
        associateEditor: true,
        isAssociatedEditorAssigned: true,
        status: true,
        category: true,
        createdAt: true,
      },
    });

    return NextResponse.json(papers);
  } catch (error) {
    console.error("Error fetching screening papers:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
