import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    const updatedJournal = await prisma.assignedJournals.update({
      where: { id },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(updatedJournal);
  } catch (error) {
    console.error("Error updating journal status:", error);
    return new NextResponse("Failed to update journal status", { status: 500 });
  }
}
