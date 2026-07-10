import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Ensure prisma is imported correctly
import { withPrivateShortCache } from "@/lib/apiCache";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (req.method === "GET") {
    try {
      const journal = await prisma?.rejectedJournal?.findMany({
        where: {
          status: "REJECTED",
        },
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          rejectedPerson: true,
          rejectedReasons: true,
          type: true,
          title: true,
          editorName: true,
          paperID: true,
          paperUrl: true,
          abstract: true,
          country: true,
          primaryDomain: true,
          secondaryDomain: true,
          authorNames: true,
          authorEmail: true,
          keywords: true,
          isSubmitted: true,
          isAssigndToEditor: true,
          isReviewerAssigned: true,
          isAssociatedEditorAssigned: true,
          updatedAt: true,
          createdAt: true,
          status: true,
        },
      });
      return withPrivateShortCache(journal, 10);
    } catch (error) {
      console.error(error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
}
