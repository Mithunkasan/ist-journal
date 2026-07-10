import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [recentUsers, recentSubmissions, recentPublished, recentLogs] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdDate: 'desc' },
        take: 5,
        select: { id: true, name: true, role: true, createdDate: true }
      }),
      prisma.submittedJournals.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, authorNames: true, createdAt: true, status: true }
      }),
      prisma.published.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, authorNames: true, createdAt: true }
      }),
      prisma.activityLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: {
          user: { select: { name: true } }
        }
      })
    ]);

    const activities = [
      ...recentUsers.map(u => ({
        id: `user-${u.id}`,
        type: 'USER',
        title: 'New user registered',
        description: `${u.name} registered as ${u.role}`,
        timestamp: u.createdDate,
      })),
      ...recentSubmissions.map(s => ({
        id: `sub-${s.id}`,
        type: 'SUBMISSION',
        title: 'New manuscript submitted',
        description: `"${s.title}" by ${s.authorNames}`,
        timestamp: s.createdAt,
      })),
      ...recentPublished.map(p => ({
        id: `pub-${p.id}`,
        type: 'PUBLISHED',
        title: 'Manuscript published',
        description: `"${p.title}" by ${p.authorNames}`,
        timestamp: p.createdAt,
      })),
      ...recentLogs.map(l => ({
        id: `log-${l.id}`,
        type: 'WORKFLOW',
        title: l.action.replace(/_/g, ' '),
        description: `${l.user.name} changed status from ${l.previousStatus || 'N/A'} to ${l.newStatus || 'N/A'} (${l.action.replace(/_/g, ' ')})${l.submissionId ? ` on manuscript #${l.submissionId}` : ''}`,
        timestamp: l.timestamp,
      }))
    ];

    activities.sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json(activities.slice(0, 10));
  } catch (error) {
    console.error("Error fetching admin activities:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
