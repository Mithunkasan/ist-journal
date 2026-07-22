import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, password, role } = body;

    if (!email || !otp || !password) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const whereClause: any = {
      email: email.toLowerCase().trim(),
    };
    if (role) {
      whereClause.role = role;
    }

    const user = await prisma.user.findFirst({
      where: whereClause,
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const dbOtp = (user as any).resetOtp;
    const dbOtpExpires = (user as any).resetOtpExpires;

    if (!dbOtp || dbOtp !== otp) {
      return new NextResponse("Invalid verification code", { status: 400 });
    }

    if (dbOtpExpires && new Date(dbOtpExpires) < new Date()) {
      return new NextResponse("Verification code has expired", { status: 400 });
    }

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear OTP fields in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpires: null,
      } as any,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in /api/auth/forgot-password/reset:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
