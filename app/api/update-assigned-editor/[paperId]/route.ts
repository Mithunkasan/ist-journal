import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { paperId: string } }
) {
  const paperID = parseInt(params.paperId);

  const body = await req.json();
  try {
    const existingJournal = await prisma?.assignedJournals.findFirst({
      where: {
        paperID: paperID,
      },
    });

    if (!existingJournal) {
      console.error("Journals not found");
      return new NextResponse("Journals not found", { status: 404 });
    }

    const updateEditor = await prisma?.assignedJournals.update({
      where: { id: existingJournal.id },
      data: {
        editorName: body.data,
      },
    });
    return NextResponse.json(updateEditor);
  } catch (err) {
    console.error("Error updating editor", err);
    return new NextResponse("Failed to update editor");
  }
}
