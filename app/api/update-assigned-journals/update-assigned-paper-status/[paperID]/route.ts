import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { paperID: string } }
) {
  const paperID = parseInt(params.paperID);

  const body = await request.json();
  const { status } = body.data;

  try {
    const existingAssigned = await prisma.assignedJournals.findFirst({
      where: { paperID: paperID },
    });

    if (!existingAssigned) {
      console.error("Assigned Journal not found");
      return new NextResponse("Assigned Journal not found", { status: 404 });
    }

    const updatedJournal = await prisma.assignedJournals.update({
      where: { id: existingAssigned.id },
      data: {
        ...body.data,
      },
    });

    // console.log("Updated Journal:", updatedJournal);
    return NextResponse.json(updatedJournal);
  } catch (error) {
    console.error("Error updating journal status:", error);
    return new NextResponse("Failed to update journal status", { status: 500 });
  }
}
