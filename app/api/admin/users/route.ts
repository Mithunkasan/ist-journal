import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { withPrivateShortCache } from "@/lib/apiCache";

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        updatedAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        Status: true,
        university: true,
        qualification: true,
        areaOfExpertise: true,
        createdDate: true,
      }
    });
    return withPrivateShortCache(users, 15);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, name, role, Status, university, qualification, areaOfExpertise } = body;

    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        role,
        Status,
        university,
        qualification,
        areaOfExpertise
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    // 1. Delete associated AssignedJournals
    await prisma.assignedJournals.deleteMany({
      where: {
        OR: [
          { userId: userId },
          { reviewerId: userId }
        ]
      }
    });

    // 2. Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
