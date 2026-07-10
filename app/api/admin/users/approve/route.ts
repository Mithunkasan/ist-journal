import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ensureUserProfile } from "@/lib/workflow";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EDITOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, action = "APPROVE" } = body;

    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    const pendingReviewer = await prisma.user.findFirst({
      where: {
        id: userId,
        role: "REVIEWER",
        Status: "IN_ACTIVE",
      },
    });

    if (!pendingReviewer) {
      return new NextResponse("Pending reviewer not found", { status: 404 });
    }

    if (action === "REJECT") {
      await prisma.user.delete({
        where: { id: userId },
      });

      return NextResponse.json({ success: true });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        Status: "ACTIVE",
      },
    });

    await ensureUserProfile(userId, "REVIEWER");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error approving user:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
