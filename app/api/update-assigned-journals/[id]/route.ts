import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const paperID = parseInt(params.id);

  const body = await request.json();
  const { userID, editorName } = body.data;

  try {
    const updatedJournal = await prisma.assignedJournals.update({
      where: { id: paperID },
      data: {
        editorName: editorName,
        user: {
          connect: {
            id: userID,
          },
        },
      },
    });

    return NextResponse.json(updatedJournal);
  } catch (error) {
    console.error("Error updating journal status:", error);
    return new NextResponse("Failed to update journal status", { status: 500 });
  }
}
