import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendEmailNotification } from "@/lib/mail";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EDITOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, name, paperTitle, paperID, category } = body;

    if (!email || !name || !paperTitle || !paperID) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Send simulated email
    await sendEmailNotification({
      to: email,
      subject: `[IST Journal] New Manuscript Assigned for Track Management`,
      body: `Dear ${name},\n\nWe have assigned a new manuscript to your track for evaluation and reviewer selection.\n\nPaper Details:\n- ID: ${paperID}\n- Title: "${paperTitle}"\n- Category: ${category || "General"}\n\nPlease log in to your Associate Editor Dashboard to perform the screening check and invite peer reviewers.\n\nBest regards,\nEditor-in-Chief`,
      templateParams: { paperID, role: "ASSOCIATE_EDITOR", name }
    });

    return NextResponse.json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error notifying AE:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
