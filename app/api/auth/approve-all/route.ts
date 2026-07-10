import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await prisma.user.updateMany({
      data: {
        Status: "ACTIVE"
      }
    });
    return NextResponse.json({
      success: true,
      message: `Successfully set all users to ACTIVE status. Count: ${result.count}`
    });
  } catch (error: any) {
    console.error("Error activating users:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
