import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  try {
    let papers;

    if (role === "editor") {
      papers = await prisma.assignedJournals.findMany({
        where: { userId },
        include: {
          reviewers: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    } else if (role === "reviewer") {
      papers = await prisma.assignedJournals.findMany({
        where: {
          reviewers: {
            some: { id: userId }, // ✅ match if current user is among many reviewers
          },
        },
        include: {
          reviewers: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json({ papers });
  } catch (error) {
    console.error("Error fetching assigned journals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
