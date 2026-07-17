import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ASSOCIATE_EDITOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { paperID } = await request.json();

    if (!paperID) {
      return new NextResponse("Missing paperID", { status: 400 });
    }

    // Set the selectedPaperId for the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        selectedPaperId: parseInt(paperID)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting paper ownership:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
