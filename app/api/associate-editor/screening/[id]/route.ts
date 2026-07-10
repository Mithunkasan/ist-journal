import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logActivity, createNotificationAndEmail } from "@/lib/workflow";
import { Status, UserRole } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id || (session.user.role !== "ASSOCIATE_EDITOR" && session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { decision, comments } = body;

  try {
    const paperID = parseInt(id);

    // Fetch the existing paper to get author name and email
    const paper = await prisma.submittedJournals.findFirst({
      where: { paperID }
    });

    if (!paper) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    // Fetch the relational Submission
    let submission = await prisma.submission.findUnique({
      where: { paperID }
    });

    // Fallback: create submission if not exists (for legacy compatibility)
    if (!submission) {
      // Find author user
      const authorUser = await prisma.user.findFirst({
        where: { email: { contains: paper.authorEmail || "" } }
      });
      
      // Ensure Author profile exists
      let authorProfile = authorUser ? await prisma.author.findUnique({ where: { userId: authorUser.id } }) : null;
      if (authorUser && !authorProfile) {
        authorProfile = await prisma.author.create({ data: { userId: authorUser.id } });
      }

      submission = await prisma.submission.create({
        data: {
          paperID,
          title: paper.title || "Untitled",
          status: Status.SUBMITTED,
          authorId: authorProfile ? authorProfile.id : session.user.id, // Fallback to current user id if no author profile found
        }
      });
    }

    const prevStatus = submission.status;

    if (decision === "FORWARD") {
      // 1. FORWARD TO REVIEW (Awaiting Reviewer Assignment)
      const nextStatus = Status.REVIEWER_ASSIGNMENT;

      // Update new relational submission status
      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: nextStatus }
      });

      // Update legacy SubmittedJournals
      await prisma.submittedJournals.updateMany({
        where: { paperID },
        data: {
          status: "ASSIGNED_TO_EDITOR", // Legacy maps Awaiting Reviewer to ASSIGNED_TO_EDITOR
          isAssigndToEditor: true,
        },
      });

      // Sync legacy AssignedJournals
      const existingAssignment = await prisma.assignedJournals.findFirst({
        where: { paperID },
      });

      if (!existingAssignment) {
        await prisma.assignedJournals.create({
          data: {
            type: paper.type,
            title: paper.title,
            abstract: paper.abstract,
            paperUrl: paper.paperUrl,
            primaryDomain: paper.primaryDomain,
            secondaryDomain: paper.secondaryDomain,
            country: paper.country,
            authorNames: paper.authorNames,
            authorEmail: paper.authorEmail,
            howToKnow: paper.howToKnow,
            paperID,
            createdAt: new Date(),
            status: "ASSIGNED_TO_EDITOR",
            isSubmitted: true,
            isAssigndToEditor: true,
            keywords: paper.keywords,
            category: paper.category,
            supportingFilesUrl: paper.supportingFilesUrl,
            userId: session.user.id,
            associateEditor: session.user.name,
            isAssociatedEditorAssigned: true,
            coverLetterUrl: paper.coverLetterUrl,
          },
        });
      } else {
        await prisma.assignedJournals.updateMany({
          where: { paperID },
          data: {
            status: "ASSIGNED_TO_EDITOR"
          }
        });
      }

      // Log decision and activity
      await prisma.decision.create({
        data: {
          submissionId: submission.id,
          decisionType: "FORWARD_TO_REVIEW",
          comments: comments || "Passed initial screening.",
          editorId: session.user.id,
          roundNumber: 1,
        }
      });

      await logActivity(session.user.id, "SCREENING_FORWARD", submission.id, prevStatus, nextStatus);

      // Send notification
      const message = `Dear ${paper.authorNames},\n\nWe are pleased to inform you that your manuscript titled "${paper.title}" has successfully passed the initial editorial screening checks and has been forwarded to the peer review stage.\n\nYour paper status is now: Awaiting Reviewer Assignment.\n\nBest regards,\nEditorial Office`;
      await createNotificationAndEmail(
        session.user.id, // Logged in editor sends it
        paper.authorEmail || "",
        "Manuscript Forwarded to Review",
        message,
        paperID
      );

      return NextResponse.json({ message: "Forwarded successfully" });

    } else if (decision === "RETURN") {
      // 2. SEND BACK / RETURN (Formatting correction required)
      const nextStatus = Status.MINOR_REVISION; // Map send back to minor revision requests

      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: nextStatus }
      });

      await prisma.submittedJournals.updateMany({
        where: { paperID },
        data: {
          status: "REVISIONS_REQUESTED", // Revisions Requested maps to "Revision Required" / "Send Back"
          revisionComments: comments || "Formatting correction required.",
        },
      });

      await prisma.assignedJournals.updateMany({
        where: { paperID },
        data: {
          status: "REVISIONS_REQUESTED",
          revisionComments: comments || "Formatting correction required."
        }
      });

      // Log decision and activity
      await prisma.decision.create({
        data: {
          submissionId: submission.id,
          decisionType: "RETURN_FOR_CORRECTION",
          comments: comments || "Formatting correction required.",
          editorId: session.user.id,
          roundNumber: 1,
        }
      });

      await logActivity(session.user.id, "SCREENING_RETURN", submission.id, prevStatus, nextStatus);

      // Send notification
      const message = `Dear ${paper.authorNames},\n\nDuring the initial editorial screening of your manuscript titled "${paper.title}", our editorial board determined that formatting corrections are required before this paper can proceed to review.\n\nFeedback:\n${comments || "Please check journal guidelines."}\n\nPlease upload your revised manuscript through your Author Portal.\n\nBest regards,\nEditorial Office`;
      await createNotificationAndEmail(
        session.user.id,
        paper.authorEmail || "",
        "Revision Required: Formatting Correction",
        message,
        paperID
      );

      return NextResponse.json({ message: "Returned successfully" });

    } else if (decision === "REJECT") {
      // 3. DESK REJECT (Desk Rejected)
      const nextStatus = Status.DESK_REJECTED;

      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: nextStatus }
      });

      await prisma.submittedJournals.updateMany({
        where: { paperID },
        data: {
          status: "REJECTED",
          isAccepted: false,
        },
      });

      // Add to RejectedJournal table
      await prisma.rejectedJournal.create({
        data: {
          rejectedPerson: session.user.name || "Associate Editor",
          rejectedReasons: comments || "Desk Rejected: Poor quality or out of scope.",
          type: paper.type,
          title: paper.title,
          paperID,
          paperUrl: paper.paperUrl,
          abstract: paper.abstract,
          country: paper.country,
          primaryDomain: paper.primaryDomain,
          secondaryDomain: paper.secondaryDomain,
          authorNames: paper.authorNames,
          authorEmail: paper.authorEmail,
          keywords: paper.keywords,
          isSubmitted: paper.isSubmitted,
          isAssigndToEditor: paper.isAssigndToEditor,
          isReviewerAssigned: paper.isReviewerAssigned,
          isAssociatedEditorAssigned: paper.isAssociatedEditorAssigned,
          status: "REJECTED",
          createdAt: new Date(),
          coverLetterUrl: paper.coverLetterUrl,
        }
      });

      // Delete from AssignedJournals if it existed
      await prisma.assignedJournals.deleteMany({
        where: { paperID }
      });

      // Log decision and activity
      await prisma.decision.create({
        data: {
          submissionId: submission.id,
          decisionType: "DESK_REJECTED",
          comments: comments || "Desk Rejected: Poor quality or out of scope.",
          editorId: session.user.id,
          roundNumber: 1,
        }
      });

      await logActivity(session.user.id, "DESK_REJECT", submission.id, prevStatus, nextStatus);

      // Send notification
      const message = `Dear ${paper.authorNames},\n\nThank you for submitting your manuscript titled "${paper.title}" to the International Scientific and Technological Journal.\n\nAfter careful initial evaluation by our editors, we regret to inform you that we are unable to accept your manuscript for publication. The paper has been desk-rejected for the following reasons:\n\n${comments || "Out of scope or does not meet basic quality standards."}\n\nWe appreciate your interest in our journal and wish you the best of luck with your future work.\n\nBest regards,\nEditorial Office`;
      await createNotificationAndEmail(
        session.user.id,
        paper.authorEmail || "",
        "Editorial Decision: Desk Rejected",
        message,
        paperID
      );

      return NextResponse.json({ message: "Desk rejected successfully" });
    }

    return new NextResponse("Invalid decision", { status: 400 });
  } catch (error) {
    console.error("Error processing screening decision:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
