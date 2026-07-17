import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [
      users,
      submittedJournals,
      assignedJournals,
      published,
      rejectedJournals,
      archives,
      submissions,
      notifications,
      activityLogs,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.submittedJournals.findMany(),
      prisma.assignedJournals.findMany(),
      prisma.published.findMany(),
      prisma.rejectedJournal.findMany(),
      prisma.archives.findMany(),
      prisma.submission.findMany(),
      prisma.notification.findMany(),
      prisma.activityLog.findMany(),
    ]);

    const backupData = {
      backupTimestamp: new Date().toISOString(),
      version: "1.0",
      data: {
        users,
        submittedJournals,
        assignedJournals,
        published,
        rejectedJournals,
        archives,
        submissions,
        notifications,
        activityLogs,
      }
    };

    return NextResponse.json(backupData);
  } catch (error) {
    console.error("Backup failed", error);
    return new NextResponse("Backup failed", { status: 500 });
  }
}
