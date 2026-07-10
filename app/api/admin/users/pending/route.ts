import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EDITOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        Status: "IN_ACTIVE",
        role: "REVIEWER",
      },
      orderBy: {
        createdDate: 'desc',
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
      },
    });

    return NextResponse.json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
