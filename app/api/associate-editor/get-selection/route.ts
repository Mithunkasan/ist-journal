import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { selectedPaperId: true }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching Sub Editor selection:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
