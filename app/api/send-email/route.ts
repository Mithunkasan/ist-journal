import { NextResponse } from "next/server";
import { sendEmailNotification } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, body: emailBody, templateParams } = body;

    if (!to || !subject || !emailBody) {
      return new NextResponse("Missing required fields (to, subject, body)", { status: 400 });
    }

    await sendEmailNotification({
      to,
      subject,
      body: emailBody,
      templateParams,
    });

    return NextResponse.json({ success: true, message: "Email dispatched successfully" });
  } catch (error: any) {
    console.error("Error in /api/send-email:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
