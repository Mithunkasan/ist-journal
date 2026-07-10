import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, newStatus } = body;

    if (!id || !newStatus) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedPaper = await prisma.assignedJournals.update({
      where: {
        id: Number(id),
      },
      data: {
        status: newStatus,
      },
    });

    return NextResponse.json(updatedPaper);
  } catch (error: any) {
    console.error("Server Error:", error);
    return new NextResponse(
      JSON.stringify({
        message: error?.message || "Unknown Error",
        full: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
