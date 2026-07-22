import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const body = await request.json();
    const { email, role } = body.data;

    const whereClause: any = {
      email: email?.toLowerCase().trim(),
    };

    if (role) {
      whereClause.role = role;
    }

    const Users = await prisma.user.findFirst({
      where: whereClause,
    });
    return NextResponse.json(Users);
  } catch (error) {
    console.error("Error fetch user data:", error);
    return new NextResponse("Failed to fetch user data", { status: 500 });
  }
}
