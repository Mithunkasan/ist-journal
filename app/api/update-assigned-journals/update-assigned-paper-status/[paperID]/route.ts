import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { paperID: string } }
) {
  const session = await auth();
  const paperID = parseInt(params.paperID);

  const body = await request.json();
  const { status } = body.data;

  try {
    if ("associateEditor" in body.data || "isAssociatedEditorAssigned" in body.data) {
      if (!session?.user?.id || !["EDITOR", "ASSOCIATE_EDITOR", "ADMIN"].includes(session.user.role || "")) {
        return new NextResponse("Unauthorized assignment", { status: 403 });
      }

      const assigneeName = body.data.associateEditor;
      const assignee = assigneeName
        ? await prisma.user.findFirst({
            where: { name: assigneeName },
            select: { id: true, role: true },
          })
        : null;

      if (!assignee) {
        return new NextResponse("Invalid assignee", { status: 400 });
      }

      const isSelfAssignment = assignee.id === session.user.id;
      const chiefEditorAllowed =
        session.user.role === "EDITOR" &&
        (["ASSOCIATE_EDITOR", "GUEST_EDITOR"].includes(assignee.role || "") || isSelfAssignment);
      const associateEditorAllowed =
        session.user.role === "ASSOCIATE_EDITOR" &&
        (assignee.role === "GUEST_EDITOR" || isSelfAssignment);

      if (session.user.role !== "ADMIN" && !chiefEditorAllowed && !associateEditorAllowed) {
        return new NextResponse("Assignee is not permitted for this role", { status: 403 });
      }
    }

    const existingAssigned = await prisma.assignedJournals.findFirst({
      where: { paperID: paperID },
    });

    if (!existingAssigned) {
      console.error("Assigned Journal not found");
      return new NextResponse("Assigned Journal not found", { status: 404 });
    }

    const isAssignmentUpdate = "associateEditor" in body.data || "isAssociatedEditorAssigned" in body.data;

    const updatedJournal = await prisma.assignedJournals.update({
      where: { id: existingAssigned.id },
      data: {
        ...body.data,
        ...(isAssignmentUpdate && session?.user?.name ? { editorName: session.user.name } : {}),
      },
    });

    // console.log("Updated Journal:", updatedJournal);
    return NextResponse.json(updatedJournal);
  } catch (error) {
    console.error("Error updating journal status:", error);
    return new NextResponse("Failed to update journal status", { status: 500 });
  }
}
