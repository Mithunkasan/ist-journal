import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Email parameter is required", { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        email: email.toLowerCase().trim(),
      },
      select: {
        role: true,
      },
    });

    const roles = users.map(u => u.role).filter(Boolean);

    return NextResponse.json({
      exists: users.length > 0,
      roles: roles,
    });
  } catch (error: any) {
    console.error("Error in /api/check-email:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
