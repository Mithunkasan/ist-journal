import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parsePaperId } from "@/lib/utils/utils";

export async function POST(request: any) {
  const body = await request.json();
  const parsedId = parsePaperId(body.data);

  if (parsedId === null) {
    return NextResponse.json([]);
  }

  const exist = await prisma.submittedJournals.findFirst({
    where: {
      paperID: parsedId,
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
      isSubmitted: true,
      isAssigndToEditor: true,
      isReviewerAssigned: true,
      isAssociatedEditorAssigned: true,
      isPublished: true,
      updatedAt: true,
      createdAt: true,
      status: true,
    },
  });

  return NextResponse.json(exist ? [exist] : []);
}
