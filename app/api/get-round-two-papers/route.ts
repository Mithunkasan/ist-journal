import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client"; // ✅ Correct import

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const roundTwoPapers = await prisma.assignedJournals.findMany({
      where: {
        status: Status.ROUND_TWO_PAPER, // ✅ Enum used properly
      },
    });

    return NextResponse.json(roundTwoPapers);
  } catch (error) {
    console.error("❌ Error fetching Round Two papers:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
