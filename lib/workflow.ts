import prisma from "./prisma";
import { Status, UserRole, UserStatus } from "@prisma/client";
import { sendEmailNotification } from "./mail";

export const VALID_TRANSITIONS: Record<Status, Status[]> = {
  SUBMITTED: [Status.EDITOR_SCREENING, Status.DESK_REJECTED, Status.ASSOCIATE_EDITOR_REVIEW, Status.REVIEWER_ASSIGNMENT, Status.UNDER_REVIEW],
  EDITOR_SCREENING: [Status.DESK_REJECTED, Status.ASSOCIATE_EDITOR_REVIEW, Status.REVIEWER_ASSIGNMENT, Status.UNDER_REVIEW],
  DESK_REJECTED: [],
  ASSOCIATE_EDITOR_REVIEW: [Status.EDITOR_SCREENING, Status.REVIEWER_ASSIGNMENT, Status.UNDER_REVIEW],
  REVIEWER_ASSIGNMENT: [Status.UNDER_REVIEW],
  UNDER_REVIEW: [Status.EDITOR_DECISION, Status.DECISION_PENDING],
  EDITOR_DECISION: [Status.ACCEPTED, Status.REJECTED, Status.MINOR_REVISION, Status.MAJOR_REVISION],
  DECISION_PENDING: [Status.ACCEPTED, Status.REJECTED, Status.MINOR_REVISION, Status.MAJOR_REVISION],
  MINOR_REVISION: [Status.REVISION_SUBMITTED],
  MAJOR_REVISION: [Status.REVISION_SUBMITTED],
  REVISION_SUBMITTED: [Status.UNDER_REVIEW_AGAIN, Status.UNDER_REVIEW],
  UNDER_REVIEW_AGAIN: [Status.EDITOR_DECISION, Status.DECISION_PENDING],
  ACCEPTED: [Status.PRODUCTION],
  REJECTED: [],
  PRODUCTION: [Status.PUBLISHED],
  PUBLISHED: [],
  // Legacy status fallback compatibility:
  ASSIGNED_TO_EDITOR: [Status.UNDER_EDITOR_REVIEW, Status.REVIEWER_ASSIGNED, Status.UNDER_REVIEW, Status.REVISIONS_REQUESTED],
  UNDER_EDITOR_REVIEW: [Status.ASSIGNED_TO_EDITOR, Status.REVIEWER_ASSIGNED, Status.UNDER_REVIEW],
  REVIEWER_ASSIGNED: [Status.UNDER_REVIEW_BY_REVIEWER, Status.UNDER_REVIEW, Status.DECISION_PENDING],
  UNDER_REVIEW_BY_REVIEWER: [Status.DECISION_PENDING],
  REVISIONS_REQUESTED: [Status.REVISIONS_SUBMITTED],
  REVISIONS_SUBMITTED: [Status.ROUND_TWO_PAPER, Status.UNDER_REVIEW_AGAIN],
  ROUND_TWO_PAPER: [Status.DECISION_PENDING],
  Review1: [Status.DECISION_PENDING, Status.UNDER_REVIEW],
  Review2: [Status.DECISION_PENDING, Status.UNDER_REVIEW],
  Review3: [Status.DECISION_PENDING, Status.UNDER_REVIEW],
  WITHDRAWN: [],
};

// Check if a role is permitted to perform a status transition
export function isRoleAllowedForTransition(role: UserRole, nextStatus: Status): boolean {
  if ((role as string) === "ADMIN") return true; // Admin can manage/force any transition
  
  switch (nextStatus) {
    case Status.SUBMITTED:
      return role === "AUTHOR";
    case Status.EDITOR_SCREENING:
    case Status.DESK_REJECTED:
      return role === "EDITOR";
    case Status.ASSOCIATE_EDITOR_REVIEW:
      return role === "EDITOR" || role === "ASSOCIATE_EDITOR";
    case Status.REVIEWER_ASSIGNMENT:
    case Status.UNDER_REVIEW:
    case Status.UNDER_REVIEW_AGAIN:
      return role === "EDITOR";
    case Status.EDITOR_DECISION:
    case Status.DECISION_PENDING:
      return role === "EDITOR" || role === "ASSOCIATE_EDITOR" || role === "REVIEWER"; // REVIEWER submits -> transitions under-review to pending
    case Status.ACCEPTED:
    case Status.REJECTED:
    case Status.MINOR_REVISION:
    case Status.MAJOR_REVISION:
      return role === "EDITOR";
    case Status.REVISION_SUBMITTED:
      return role === "AUTHOR";
    case Status.PRODUCTION:
    case Status.PUBLISHED:
      return (role as string) === "ADMIN"; // Only Admin (or Production team modeled via Admin)
    default:
      return false;
  }
}

export function validateTransition(currentStatus: Status, nextStatus: Status): boolean {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

// Log activity to audit trail
export async function logActivity(userId: string, action: string, submissionId?: string, prevStatus?: Status, newStatus?: Status) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        submissionId,
        previousStatus: prevStatus ? String(prevStatus) : null,
        newStatus: newStatus ? String(newStatus) : null,
        timestamp: new Date(),
      }
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

// Create in-app notification and trigger simulated email
export async function createNotificationAndEmail(
  userId: string,
  email: string | null | undefined,
  title: string,
  message: string,
  paperId: number
) {
  try {
    // 1. Create notification record
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        isRead: false,
      }
    });

    // 2. Send email notification when an email address is available
    if (email) {
      await sendEmailNotification({
        to: email,
        subject: `[IST Journal] ${title}`,
        body: message,
        templateParams: { paperID: paperId }
      });
    }
  } catch (error) {
    console.error("Failed to create notification and send email:", error);
  }
}

export async function getLeastLoadedActiveEditor() {
  const editors = await prisma.user.findMany({
    where: {
      role: UserRole.EDITOR,
      Status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          assignedJournals: true,
        },
      },
    },
  });

  const fallbackEditors =
    editors.length > 0
      ? editors
      : await prisma.user.findMany({
          where: {
            role: UserRole.EDITOR,
          },
          select: {
            id: true,
            name: true,
            email: true,
            _count: {
              select: {
                assignedJournals: true,
              },
            },
          },
        });

  const selectedEditor = fallbackEditors.sort(
    (left, right) => left._count.assignedJournals - right._count.assignedJournals
  )[0];

  if (!selectedEditor) {
    return null;
  }

  await ensureUserProfile(selectedEditor.id, UserRole.EDITOR);
  const editorProfile = await prisma.editor.findUnique({
    where: { userId: selectedEditor.id },
    select: { id: true },
  });

  if (!editorProfile) {
    return null;
  }

  return {
    id: selectedEditor.id,
    name: selectedEditor.name,
    email: selectedEditor.email,
    editorProfileId: editorProfile.id,
  };
}

// Ensure User profiles exist (Author, Editor, AssociateEditor, Reviewer)
export async function ensureUserProfile(userId: string, role: UserRole) {
  try {
    if (role === "AUTHOR") {
      await prisma.author.upsert({
        where: { userId },
        update: {},
        create: { userId }
      });
    } else if (role === "EDITOR") {
      await prisma.editor.upsert({
        where: { userId },
        update: {},
        create: { userId }
      });
    } else if (role === "ASSOCIATE_EDITOR") {
      await prisma.associateEditor.upsert({
        where: { userId },
        update: {},
        create: { userId }
      });
    } else if (role === "REVIEWER") {
      await prisma.reviewer.upsert({
        where: { userId },
        update: {},
        create: { userId }
      });
    }
  } catch (error) {
    console.error("Failed to ensure user profile for userId:", userId, role, error);
  }
}
