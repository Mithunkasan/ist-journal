import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const notificationId = body?.id;

  if (notificationId) {
    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
      data: { isRead: true },
    });
  } else {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  return NextResponse.json({ ok: true });
}
