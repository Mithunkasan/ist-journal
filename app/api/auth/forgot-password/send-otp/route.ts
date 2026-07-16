import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmailNotification } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Email address is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (!user) {
      return new NextResponse("This email is not registered.", { status: 404 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Save OTP to the database (cast data to any to bypass local Prisma type cache issues)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetOtp: otp,
        resetOtpExpires: expires,
      } as any,
    });

    // Send email notification
    await sendEmailNotification({
      to: user.email!,
      subject: "Your OTP for Password Reset",
      body: `Hello ${user.name || "User"},\n\nWe received a request to reset your password.\nYour verification code (OTP) is: ${otp}\n\nThis code will expire in 15 minutes. If you did not request a password reset, please ignore this email.\n\nThank you,\nIST Online Journal Support`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in /api/auth/forgot-password/send-otp:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
