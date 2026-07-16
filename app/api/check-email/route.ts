import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Email parameter is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    return NextResponse.json({ exists: !!user });
  } catch (error: any) {
    console.error("Error in /api/check-email:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
