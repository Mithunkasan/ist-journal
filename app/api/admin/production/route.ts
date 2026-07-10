import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logActivity, createNotificationAndEmail } from "@/lib/workflow";
import { Status } from "@prisma/client";

const STAGE_TO_STEP: Record<string, number> = {
  COPY_EDITING: 1,
  PROOFREADING: 2,
  TYPESETTING: 3,
  DOI_GENERATION: 4,
  PUBLICATION_SCHEDULING: 5,
  PUBLISHED: 6,
};

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { paperID, stage, doi } = body;

    if (!paperID || !stage) {
      return new NextResponse("Missing paperID or production stage", { status: 400 });
    }

    const parsedPaperID = parseInt(paperID);
    const stepNumber = STAGE_TO_STEP[stage];

    if (stepNumber === undefined) {
      return new NextResponse("Invalid production stage name", { status: 400 });
    }

    // Fetch the legacy paper details
    const paper = await prisma.submittedJournals.findFirst({
      where: { paperID: parsedPaperID }
    });

    if (!paper) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    // Fetch relational Submission
    const submission = await prisma.submission.findUnique({
      where: { paperID: parsedPaperID }
    });

    if (!submission) {
      return new NextResponse("Relational submission record not found", { status: 404 });
    }

    const prevStatus = submission.status;
    let nextStatus = submission.status;

    if (stage === "PUBLISHED") {
      nextStatus = Status.PUBLISHED;
    }

    // 1. Update relational Production
    await prisma.production.upsert({
      where: { submissionId: submission.id },
      update: {
        stage,
        doi: doi || undefined,
      },
      create: {
        submissionId: submission.id,
        stage,
        doi: doi || undefined,
      }
    });

    // 2. Update relational Submission if stage is PUBLISHED
    if (stage === "PUBLISHED") {
      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: Status.PUBLISHED }
      });
    }

    // 3. Update legacy SubmittedJournals
    await prisma.submittedJournals.updateMany({
      where: { paperID: parsedPaperID },
      data: {
        productionStep: stepNumber,
        doi: doi || paper.doi,
        status: stage === "PUBLISHED" ? Status.PUBLISHED : paper.status,
        isPublished: stage === "PUBLISHED" ? true : paper.isPublished,
      }
    });

    // 4. Update legacy AssignedJournals
    await prisma.assignedJournals.updateMany({
      where: { paperID: parsedPaperID },
      data: {
        productionStep: stepNumber,
        doi: doi || paper.doi,
        status: stage === "PUBLISHED" ? Status.PUBLISHED : paper.status,
        isPublished: stage === "PUBLISHED" ? true : paper.isPublished,
      }
    });

    if (stage === "PUBLISHED") {
      const existingPublishedPaper = await prisma.published.findFirst({
        where: { paperID: parsedPaperID },
      });
      const assignedPaper = await prisma.assignedJournals.findFirst({
        where: { paperID: parsedPaperID },
      });

      const publishedData = {
        editorName: assignedPaper?.editorName,
        associateEditor: assignedPaper?.associateEditor || paper.associateEditor,
        type: paper.type,
        title: paper.title,
        paperID: parsedPaperID,
        isSubmitted: paper.isSubmitted,
        isAssigndToEditor: paper.isAssigndToEditor,
        isReviewerAssigned: paper.isReviewerAssigned,
        isAssociatedEditorAssigned: paper.isAssociatedEditorAssigned,
        isPublished: true,
        paperUrl: paper.paperUrl,
        abstract: paper.abstract,
        country: paper.country,
        primaryDomain: paper.primaryDomain,
        secondaryDomain: paper.secondaryDomain,
        authorNames: paper.authorNames,
        authorEmail: paper.authorEmail,
        keywords: paper.keywords,
        status: Status.PUBLISHED,
        doi: doi || paper.doi,
        orcid: paper.orcid,
        coverLetterUrl: paper.coverLetterUrl,
      };

      if (existingPublishedPaper) {
        await prisma.published.update({
          where: { id: existingPublishedPaper.id },
          data: publishedData,
        });
      } else {
        await prisma.published.create({
          data: {
            ...publishedData,
            createdAt: new Date(),
          },
        });
      }
    }

    // 5. Audit Logging
    await logActivity(
      session.user.id,
      `UPDATE_PRODUCTION_STAGE_${stage}`,
      submission.id,
      prevStatus,
      nextStatus
    );

    // 6. Notify Author
    const authorUser = await prisma.user.findFirst({
      where: { email: { contains: paper.authorEmail || "" } }
    });
    const targetUserId = authorUser ? authorUser.id : session.user.id;

    let notificationTitle = `Manuscript Moved to Production: ${stage.replace("_", " ")}`;
    let notificationMsg = `Dear ${paper.authorNames},\n\nWe are pleased to inform you that your manuscript titled "${paper.title}" (ID: ${parsedPaperID}) has progressed in production.\n\nNew Production Stage: ${stage.replace("_", " ")}\n\nBest regards,\nProduction Department`;

    if (stage === "PUBLISHED") {
      notificationTitle = "Manuscript Published!";
      notificationMsg = `Dear ${paper.authorNames},\n\nCongratulations! Your manuscript titled "${paper.title}" (ID: ${parsedPaperID}) has been officially PUBLISHED in the International Scientific and Technological Journal.\n\nDOI: ${doi || "Generated"}\n\nYou can access it on the archive page.\n\nBest regards,\nEditorial Team`;
    }

    await createNotificationAndEmail(
      targetUserId,
      paper.authorEmail || "",
      notificationTitle,
      notificationMsg,
      parsedPaperID
    );

    return NextResponse.json({ message: `Production stage updated to ${stage}` });
  } catch (error) {
    console.error("Error updating production stage:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
