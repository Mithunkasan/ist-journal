import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as any;

    if (!file) {
      return NextResponse.json(
        { error: "File is required." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const filename = file.name || "uploaded-file";
    const mimeType = file.type || "application/octet-stream";

    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        filename,
        mimeType,
        data: base64Data,
      },
    });

    return NextResponse.json({ fileUrl: `/api/files/${uploadedFile.id}` });
  } catch (e: any) {
    console.error("Error uploading file to database:\n", e);
    return NextResponse.json(
      { error: "Something went wrong during the file upload." },
      { status: 500 }
    );
  }
}
