import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path to your prisma client

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    console.error("❌ Invalid ID received:", params.id);
    return new NextResponse("Invalid ID", { status: 400 });
  }

  try {
    const deleted = await prisma.submittedJournals.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "✅ Paper deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    console.error("❌ Error deleting paper:", error);

    if (error.code === "P2025") {
      return new NextResponse("Paper not found", { status: 404 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
