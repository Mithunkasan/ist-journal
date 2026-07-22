import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  ensureUserProfile,
  logActivity,
  createNotificationAndEmail,
  getLeastLoadedActiveEditor,
} from "@/lib/workflow";
import { Status, UserRole, UserStatus } from "@prisma/client";
import { formatPaperId } from "@/lib/utils/utils";

type SubmitSession = {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  };
} | null;

async function getUniquePaperId(requestedPaperID?: unknown) {
  const lastSubmission = await prisma.submission.findFirst({
    where: {
      paperID: {
        lt: 100000000,
      },
    },
    orderBy: {
      paperID: "desc",
    },
    select: {
      paperID: true,
    },
  });

  const lastSubmittedJournal = await prisma.submittedJournals.findFirst({
    where: {
      paperID: {
        lt: 100000000,
      },
    },
    orderBy: {
      paperID: "desc",
    },
    select: {
      paperID: true,
    },
  });

  const lastAssignedJournal = await prisma.assignedJournals.findFirst({
    where: {
      paperID: {
        lt: 100000000,
      },
    },
    orderBy: {
      paperID: "desc",
    },
    select: {
      paperID: true,
    },
  });

  const lastPublished = await prisma.published.findFirst({
    where: {
      paperID: {
        lt: 100000000,
      },
    },
    orderBy: {
      paperID: "desc",
    },
    select: {
      paperID: true,
    },
  });

  const lastRejected = await prisma.rejectedJournal.findFirst({
    where: {
      paperID: {
        lt: 100000000,
      },
    },
    orderBy: {
      paperID: "desc",
    },
    select: {
      paperID: true,
    },
  });

  const lastArchive = await prisma.archives.findFirst({
    where: {
      paperID: {
        lt: 100000000,
      },
    },
    orderBy: {
      paperID: "desc",
    },
    select: {
      paperID: true,
    },
  });

  const maxIds = [
    lastSubmission ? lastSubmission.paperID : 0,
    lastSubmittedJournal ? (lastSubmittedJournal.paperID || 0) : 0,
    lastAssignedJournal ? (lastAssignedJournal.paperID || 0) : 0,
    lastPublished ? (lastPublished.paperID || 0) : 0,
    lastRejected ? (lastRejected.paperID || 0) : 0,
    lastArchive ? (lastArchive.paperID || 0) : 0,
  ];

  let nextId = Math.max(...maxIds) + 1;
  if (nextId < 1) {
    nextId = 1;
  }

  while (true) {
    const existingSubmission = await prisma.submission.findUnique({
      where: { paperID: nextId },
      select: { id: true },
    });

    const existingJournal = await prisma.submittedJournals.findFirst({
      where: { paperID: nextId },
      select: { id: true },
    });

    const existingAssigned = await prisma.assignedJournals.findFirst({
      where: { paperID: nextId },
      select: { id: true },
    });

    const existingPublished = await prisma.published.findFirst({
      where: { paperID: nextId },
      select: { id: true },
    });

    const existingRejected = await prisma.rejectedJournal.findFirst({
      where: { paperID: nextId },
      select: { id: true },
    });

    const existingArchive = await prisma.archives.findFirst({
      where: { paperID: nextId },
      select: { id: true },
    });

    if (
      !existingSubmission &&
      !existingJournal &&
      !existingAssigned &&
      !existingPublished &&
      !existingRejected &&
      !existingArchive
    ) {
      break;
    }
    nextId++;
  }

  return nextId;
}

function getFirstCommaSeparatedValue(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)[0];
}

async function getSubmittingUser({
  session,
  authorNames,
  authorEmail,
}: {
  session: SubmitSession;
  authorNames: string;
  authorEmail: string;
}) {
  if (session?.user?.id) {
    return {
      id: session.user.id,
      name: session.user.name || getFirstCommaSeparatedValue(authorNames) || "Author",
      email: session.user.email || getFirstCommaSeparatedValue(authorEmail) || "",
      isAuthenticated: true,
    };
  }

  const primaryEmail = getFirstCommaSeparatedValue(authorEmail)?.toLowerCase();
  if (!primaryEmail) {
    throw new Error("A valid author email is required.");
  }

  const primaryName = getFirstCommaSeparatedValue(authorNames) || "Author";
  const existingUser = await prisma.user.findFirst({
    where: { email: primaryEmail, role: UserRole.AUTHOR },
  });

  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: existingUser.name || primaryName,
          Status: existingUser.Status || UserStatus.ACTIVE,
          role: existingUser.role || UserRole.AUTHOR,
        },
      })
    : await prisma.user.create({
        data: {
          name: primaryName,
          email: primaryEmail,
          role: UserRole.AUTHOR,
          Status: UserStatus.ACTIVE,
          createdDate: new Date(),
        },
      });

  return {
    id: user.id,
    name: user.name || primaryName,
    email: user.email || primaryEmail,
    isAuthenticated: false,
  };
}

export async function POST(request: any) {
  const session = await auth();
  const body = await request.json();
  const {
    type,
    title,
    abstract,
    paperUrl,
    primaryDomain,
    secondaryDomain,
    country,
    authorNames,
    authorEmail,
    howToKnow,
    paperID,
    keywords,
    category,
    supportingFilesUrl,
    orcid,
    coverLetterUrl,
  } = body.data;

  if (
    !type ||
    !title ||
    !abstract ||
    !paperUrl ||
    !primaryDomain ||
    !secondaryDomain ||
    !country ||
    !authorNames ||
    !authorEmail ||
    !howToKnow ||
    !paperID
  ) {
    return NextResponse.json(
      { error: "Missing required submission fields." },
      { status: 400 }
    );
  }

  try {
    const submittingUser = await getSubmittingUser({
      session,
      authorNames,
      authorEmail,
    });

    // Ensure the logged-in user's email is included in the authorEmail field
    // so they can actually see the paper on their dashboard.
    let finalAuthorEmail = authorEmail;
    if (
      submittingUser.email &&
      !finalAuthorEmail.toLowerCase().includes(submittingUser.email.toLowerCase())
    ) {
      finalAuthorEmail = `${submittingUser.email}, ${authorEmail}`;
    }

    const parsedPaperID = await getUniquePaperId(paperID);

    // 1. Ensure author profile exists
    await ensureUserProfile(submittingUser.id, "AUTHOR");
    const author = await prisma.author.findUnique({
      where: { userId: submittingUser.id }
    });

    if (!author) {
      return NextResponse.json({ error: "Author profile initialization failed." }, { status: 500 });
    }

    const assignedEditor = await getLeastLoadedActiveEditor();
    if (!assignedEditor) {
      return NextResponse.json(
        { error: "No editor is available to receive this submission." },
        { status: 500 }
      );
    }

    // 2. Create Submission record
    const submission = await prisma.submission.create({
      data: {
        paperID: parsedPaperID,
        title,
        status: assignedEditor ? Status.EDITOR_SCREENING : Status.SUBMITTED,
        authorId: author.id,
        editorId: assignedEditor?.editorProfileId,
      }
    });

    // 3. Create Manuscript record (Round 1)
    await prisma.manuscript.create({
      data: {
        submissionId: submission.id,
        title,
        abstract,
        keywords: keywords || "",
        category: category || "",
        authors: authorNames,
        pdfUrl: paperUrl,
        coverLetterUrl: coverLetterUrl || null,
        supplementaryFilesUrl: supportingFilesUrl || null,
        roundNumber: 1,
      }
    });

    // 4. Create SubmittedJournals record (for legacy compatibility)
    const journal = await prisma.submittedJournals.create({
      data: {
        type,
        paperID: parsedPaperID,
        title,
        abstract,
        paperUrl,
        primaryDomain,
        secondaryDomain,
        country,
        authorNames,
        authorEmail: finalAuthorEmail,
        howToKnow,
        keywords,
        createdAt: new Date(),
        status: assignedEditor ? Status.ASSIGNED_TO_EDITOR : Status.SUBMITTED,
        isSubmitted: true,
        isAssigndToEditor: Boolean(assignedEditor),
        associateEditor: null,
        isAssociatedEditorAssigned: false,
        category,
        supportingFilesUrl,
        orcid,
        coverLetterUrl,
      },
    });

    if (assignedEditor) {
      await prisma.assignedJournals.create({
        data: {
          type,
          paperID: parsedPaperID,
          title,
          abstract,
          paperUrl,
          primaryDomain,
          secondaryDomain,
          country,
          authorNames,
          authorEmail: finalAuthorEmail,
          howToKnow,
          keywords,
          editorName: assignedEditor.name,
          createdAt: new Date(),
          status: Status.ASSIGNED_TO_EDITOR,
          isSubmitted: true,
          isAssigndToEditor: true,
          isReviewerAssigned: false,
          isAssociatedEditorAssigned: false,
          category,
          supportingFilesUrl,
          orcid,
          coverLetterUrl,
          user: {
            connect: { id: assignedEditor.id },
          },
        },
      });
    }

    // 5. Audit Logging
    await logActivity(
      submittingUser.id,
      submittingUser.isAuthenticated ? "SUBMIT_MANUSCRIPT" : "PUBLIC_SUBMIT_MANUSCRIPT",
      submission.id,
      undefined,
      assignedEditor ? Status.EDITOR_SCREENING : Status.SUBMITTED
    );

    if (assignedEditor) {
      await logActivity(
        assignedEditor.id,
        "MANUSCRIPT_ASSIGNED_TO_EDITOR",
        submission.id,
        Status.SUBMITTED,
        Status.EDITOR_SCREENING
      );
    }

    // 6. Send Notification & Email without blocking the submission response
    const notificationMsg = `Dear ${submittingUser.name || "Author"},\n\nYour manuscript titled "${title}" has been successfully submitted and is awaiting editorial initial screening.\n\nPaper ID: ${formatPaperId(parsedPaperID)}\n\nBest regards,\nEditorial Board`;
    void createNotificationAndEmail(
      submittingUser.id,
      submittingUser.email,
      "Manuscript Submitted Successfully",
      notificationMsg,
      parsedPaperID
    ).catch((notificationError) => {
      console.error("Failed to send submission notification:", notificationError);
    });

    if (assignedEditor) {
      const editorNotificationMsg = `Dear ${assignedEditor.name || "Editor"},\n\nA new manuscript titled "${title}" has been submitted and assigned to you for editorial review.\n\nPaper ID: ${formatPaperId(parsedPaperID)}\nAuthor(s): ${authorNames}\n\nPlease log in to your Editor Dashboard to review the submission and assign reviewers.\n\nBest regards,\nEditorial Office`;

      void createNotificationAndEmail(
        assignedEditor.id,
        assignedEditor.email,
        "New Manuscript Assigned for Review",
        editorNotificationMsg,
        parsedPaperID
      ).catch((notificationError) => {
        console.error("Failed to notify assigned editor:", notificationError);
      });
    }

    return NextResponse.json(journal);
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry." },
      { status: 500 }
    );
  }
}
