import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const body = await request.json();
  const { email } = body.data;

  try {
    const Users = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    return NextResponse.json(Users);
  } catch (error) {
    console.error("Error fetch user data:", error);
    return new NextResponse("Failed to fetch user data", { status: 500 });
  }
}
