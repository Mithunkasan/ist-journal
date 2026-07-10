import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { paperId: string } }
) {
  const paperID = parseInt(params.paperId);
  const body = await request.json();

  try {
    const existingJournal = await prisma.submittedJournals.findFirst({
      where: { paperID: paperID },
    });

    if (!existingJournal) {
      console.error("Journal not found in update-submited-paper");
      return new NextResponse("Journal not found in update-submited-pape", {
        status: 404,
      });
    }

    const updatedJournal = await prisma.submittedJournals.update({
      where: { id: existingJournal.id },
      data: {
        ...body.data,
      },
    });
    return NextResponse.json(updatedJournal);
  } catch (error) {
    console.error(
      "Error updating journal status in update-submited-pape:",
      error
    );
    return new NextResponse(
      "Failed to update journal status in update-submited-pape",
      { status: 500 }
    );
  }
}
