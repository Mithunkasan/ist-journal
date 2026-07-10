import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logActivity, createNotificationAndEmail } from "@/lib/workflow";
import { Status } from "@prisma/client";
import { sendEmailNotification } from "@/lib/mail";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "AUTHOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { paperID, revisedPdfUrl, responseLetterUrl, revisionNotes } = body;

    if (!paperID || !revisedPdfUrl || !responseLetterUrl || !revisionNotes) {
      return new NextResponse("Missing required revision submission fields", { status: 400 });
    }

    const parsedPaperID = parseInt(paperID);

    // Fetch submission
    const submission = await prisma.submission.findUnique({
      where: { paperID: parsedPaperID }
    });

    if (!submission) {
      return new NextResponse("Submission not found", { status: 404 });
    }

    // Get the latest manuscript to find current round number
    const latestManuscript = await prisma.manuscript.findFirst({
      where: { submissionId: submission.id },
      orderBy: { roundNumber: "desc" }
    });

    if (!latestManuscript) {
      return new NextResponse("Base manuscript not found", { status: 404 });
    }

    const prevRound = latestManuscript.roundNumber;
    const newRound = prevRound + 1;
    const prevStatus = submission.status;
    const nextStatus = Status.REVISION_SUBMITTED;

    // 1. Create Revision record
    await prisma.revision.create({
      data: {
        submissionId: submission.id,
        roundNumber: newRound,
        revisedPdfUrl,
        responseLetterUrl,
        revisionNotes,
      }
    });

    // 2. Create new Manuscript version
    const newManuscript = await prisma.manuscript.create({
      data: {
        submissionId: submission.id,
        title: latestManuscript.title,
        abstract: latestManuscript.abstract,
        keywords: latestManuscript.keywords,
        category: latestManuscript.category,
        authors: latestManuscript.authors,
        pdfUrl: revisedPdfUrl,
        coverLetterUrl: latestManuscript.coverLetterUrl,
        supplementaryFilesUrl: latestManuscript.supplementaryFilesUrl,
        roundNumber: newRound,
      }
    });

    // 3. Re-assign the same reviewers from the previous round (unless changed by Editor)
    const previousAssignments = await prisma.reviewAssignment.findMany({
      where: {
        submissionId: submission.id,
        roundNumber: prevRound
      }
    });

    for (const prevAssign of previousAssignments) {
      // Create new ReviewAssignment for the new round
      const newAssignment = await prisma.reviewAssignment.create({
        data: {
          submissionId: submission.id,
          reviewerId: prevAssign.reviewerId,
          roundNumber: newRound,
          status: "INVITED",
          blindType: prevAssign.blindType,
        }
      });

      // Create new Review record for the new round
      await prisma.review.create({
        data: {
          assignmentId: newAssignment.id,
          reviewerId: prevAssign.reviewerId,
          manuscriptId: newManuscript.id,
          roundNumber: newRound,
        }
      });

      // Create new legacy Review record
      const reviewer = await prisma.reviewer.findUnique({
        where: { id: prevAssign.reviewerId },
        include: { user: true }
      });

      if (reviewer && reviewer.user) {
        const parsedDeadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
        await prisma.reviewLegacy.create({
          data: {
            paperID: parsedPaperID,
            reviewerId: reviewer.userId,
            reviewerName: reviewer.user.name || "Reviewer",
            status: "INVITED",
            deadline: parsedDeadline
          }
        });

        // Notify reviewer about the revision
        if (reviewer.user.email) {
          const emailBody = `Dear Dr. ${reviewer.user.name},\n\nThe author has submitted a revised manuscript for ID: ${parsedPaperID} ("${latestManuscript.title}").\n\nYou have been invited to review this revision (Round ${newRound}) under ${prevAssign.blindType} guidelines.\n\nPlease log in to your reviewer dashboard to accept the invitation and submit your review report.\n\nBest regards,\nEditorial Office`;
          await sendEmailNotification({
            to: reviewer.user.email,
            subject: `[IST Journal] Revised Manuscript Available for Review (ID: ${parsedPaperID})`,
            body: emailBody,
            templateParams: { paperID: parsedPaperID }
          });
        }
      }
    }

    // 4. Update status in relational Submission
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: nextStatus }
    });

    // 5. Update SubmittedJournals (Legacy)
    await prisma.submittedJournals.updateMany({
      where: { paperID: parsedPaperID },
      data: {
        status: "REVISIONS_SUBMITTED", // Legacy maps to Revisions Submitted
        paperUrl: revisedPdfUrl,
        responseLetterUrl,
      }
    });

    // 6. Update AssignedJournals (Legacy)
    await prisma.assignedJournals.updateMany({
      where: { paperID: parsedPaperID },
      data: {
        status: "REVISIONS_SUBMITTED",
        paperUrl: revisedPdfUrl,
        responseLetterUrl,
      }
    });

    // 7. Audit Logging
    await logActivity(
      session.user.id,
      `SUBMIT_REVISION_ROUND_${newRound}`,
      submission.id,
      prevStatus,
      nextStatus
    );

    // 8. Notify EIC and AE
    const paperRecord = await prisma.submittedJournals.findFirst({
      where: { paperID: parsedPaperID }
    });

    // Notify AE if assigned
    if (paperRecord && paperRecord.associateEditor) {
      const aeUser = await prisma.user.findFirst({
        where: { name: paperRecord.associateEditor, role: "ASSOCIATE_EDITOR" }
      });
      if (aeUser && aeUser.email) {
        const notificationMsg = `Dear Dr. ${aeUser.name},\n\nAuthor has submitted a revision for manuscript ID ${parsedPaperID} ("${latestManuscript.title}").\n\nThe manuscript has been moved to "Revision Submitted" stage and reviewers have been automatically re-invited for Round ${newRound}.\n\nBest regards,\nEditorial Office`;
        await createNotificationAndEmail(
          aeUser.id,
          aeUser.email,
          `Revision Submitted for Manuscript ID ${parsedPaperID}`,
          notificationMsg,
          parsedPaperID
        );
      }
    }

    // Notify EIC editors
    const editors = await prisma.user.findMany({
      where: { role: "EDITOR", Status: "ACTIVE" }
    });
    for (const editor of editors) {
      if (editor.email) {
        const notificationMsg = `Dear Editor ${editor.name},\n\nAuthor has submitted a revision for manuscript ID ${parsedPaperID} ("${latestManuscript.title}").\n\nThe manuscript has been moved to "Revision Submitted" stage.\n\nBest regards,\nEditorial Office`;
        await createNotificationAndEmail(
          editor.id,
          editor.email,
          `Revision Submitted for Manuscript ID ${parsedPaperID}`,
          notificationMsg,
          parsedPaperID
        );
      }
    }

    return NextResponse.json({ message: "Revision submitted successfully" });
  } catch (error) {
    console.error("Error submitting revision:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
