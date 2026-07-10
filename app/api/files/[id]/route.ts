import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse("File ID is required", { status: 400 });
    }

    const fileRecord = await prisma.uploadedFile.findUnique({
      where: { id },
    });

    if (!fileRecord) {
      return new NextResponse("File not found", { status: 404 });
    }

    const buffer = Buffer.from(fileRecord.data, "base64");

    const response = new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": fileRecord.mimeType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(fileRecord.filename)}"`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error retrieving file from database:\n", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
