import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { paperId: string } }
) {
  const paperID = parseInt(params.paperId);
  const body = await request.json();
  const session = await auth();

  try {
    const existingJournal = await prisma.submittedJournals.findFirst({
      where: { paperID: paperID },
    });

    if (!existingJournal) {
      console.error("Journal not found in update-submited-paper");
      return new NextResponse("Journal not found in update-submited-paper", {
        status: 404,
      });
    }

    const editableStatuses = ["SUBMITTED", "ASSIGNED_TO_EDITOR", "EDITOR_SCREENING"];
    const currentStatus = existingJournal.status ? String(existingJournal.status).toUpperCase() : "";
    if (session?.user?.role === "AUTHOR" && !editableStatuses.includes(currentStatus)) {
      return new NextResponse("This paper has been assigned for review and can no longer be edited.", {
        status: 403,
      });
    }

    if ("associateEditor" in body.data || "isAssociatedEditorAssigned" in body.data) {
      if (!session?.user?.id || !["EDITOR", "ASSOCIATE_EDITOR", "ADMIN"].includes(session.user.role || "")) {
        return new NextResponse("Unauthorized assignment", { status: 403 });
      }

      if (session.user.role === "GUEST_EDITOR") {
        return new NextResponse("Guest Editors cannot assign submissions", { status: 403 });
      }

      const assigneeName = body.data.associateEditor;
      const assignee = assigneeName
        ? await prisma.user.findFirst({
            where: { name: assigneeName },
            select: { id: true, name: true, email: true, role: true },
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

    const updatedJournal = await prisma.submittedJournals.update({
      where: { id: existingJournal.id },
      data: {
        ...body.data,
      },
    });

    // Also update in AssignedJournals if it has been assigned
    const existingAssigned = await prisma.assignedJournals.findFirst({
      where: { paperID: paperID },
    });

    if (existingAssigned) {
      await prisma.assignedJournals.update({
        where: { id: existingAssigned.id },
        data: {
          ...body.data,
        },
      });
    }

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
