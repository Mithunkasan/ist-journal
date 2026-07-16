import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return new NextResponse("Email and OTP are required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // cast user to any to bypass local Prisma type cache issues
    const dbOtp = (user as any).resetOtp;
    const dbOtpExpires = (user as any).resetOtpExpires;

    if (!dbOtp || dbOtp !== otp) {
      return new NextResponse("Invalid verification code", { status: 400 });
    }

    if (dbOtpExpires && new Date(dbOtpExpires) < new Date()) {
      return new NextResponse("Verification code has expired", { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in /api/auth/forgot-password/verify-otp:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
