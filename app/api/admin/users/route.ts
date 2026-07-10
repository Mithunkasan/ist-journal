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
        areaOfExpertise: true
      }
    });
    return withPrivateShortCache(users, 15);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
