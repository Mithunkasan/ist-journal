import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { sendEmailNotification } from "@/lib/mail";
import { createNotificationAndEmail } from "@/lib/workflow";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || (session.user.role !== "ASSOCIATE_EDITOR" && session.user.role !== "GUEST_EDITOR" && session.user.role !== "EDITOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Clear selectedPaperId for the Associate Editor upon completing recommendation
    await prisma.user.update({
      where: { id: session.user.id },
      data: { selectedPaperId: null }
    });

    const body = await request.json();
    const { paperID, recommendation, comments } = body;

    if (!paperID || !recommendation || !comments) {
      return new NextResponse("Missing required recommendation fields", { status: 400 });
    }

    const parsedPaperID = parseInt(paperID);

    // Save AE/Editor Recommendation and synthesis comments in revisionComments
    const roleLabel = session.user.role === "EDITOR" ? "Chief Editor" : session.user.role === "GUEST_EDITOR" ? "Guest Editor" : "Associate Editor";
    const aeSynthesis = `${roleLabel} Recommendation/Feedback: ${recommendation}\nJustification: ${comments}\nSubmitted by ${roleLabel}: ${session.user.name}`;

    // Update SubmittedJournals
    await prisma.submittedJournals.updateMany({
      where: { paperID: parsedPaperID },
      data: {
        status: "DECISION_PENDING",
        revisionComments: aeSynthesis
      }
    });

    // Update AssignedJournals
    await prisma.assignedJournals.updateMany({
      where: { paperID: parsedPaperID },
      data: {
        status: "DECISION_PENDING",
        revisionComments: aeSynthesis
      }
    });

    // Notify Editor-in-Chief that AE/Editor Recommendation is submitted!
    const paper = await prisma.submittedJournals.findFirst({
      where: { paperID: parsedPaperID }
    });

    // Find all editors
    const editors = await prisma.user.findMany({
      where: { role: "EDITOR", Status: "ACTIVE" }
    });

    for (const editor of editors) {
      if (editor.email) {
        const forwardSubject = `${roleLabel} Recommendation/Feedback Submitted for Manuscript ID ${parsedPaperID}`;
        const forwardBody = `Dear EIC ${editor.name},\n\n${roleLabel} ${session.user.name} has analyzed all peer review reports and submitted their synthesis recommendation/feedback for manuscript ID ${parsedPaperID} ("${paper?.title || "Scientific Paper"}").\n\nRecommendation: ${recommendation}\n\nEvaluation Details & Justification/Feedback:\n------------------------------------------\nFeedback / Synthesis Comments:\n${comments}\n------------------------------------------\n\nThe manuscript has been moved to "Awaiting Final Editor Decision" stage. Please log in to your Editor Dashboard to make the final decision.\n\nBest regards,\nEditorial Office`;
        await createNotificationAndEmail(
          editor.id,
          editor.email,
          forwardSubject,
          forwardBody,
          parsedPaperID
        );
      }
    }

    return NextResponse.json({ message: "AE recommendation submitted successfully" });
  } catch (error) {
    console.error("Error submitting AE recommendation:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
