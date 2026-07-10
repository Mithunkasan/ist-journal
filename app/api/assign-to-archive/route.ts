import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const body = await request.json();
  const {
    editorName,
    type,
    title,
    abstract,
    paperUrl,
    primaryDomain,
    secondaryDomain,
    country,
    authorNames,
    authorEmail,
    updatedAt,
    createdAt,
    status,
    doi,
    orcid,
  } = body.data;

  try {
    const journal = await prisma.archives.create({
      data: {
        editorName,
        type,
        title,
        abstract,
        paperUrl,
        primaryDomain,
        secondaryDomain,
        country,
        authorNames,
        authorEmail,
        updatedAt,
        createdAt: new Date(),
        status: "ACCEPTED",
        doi,
        orcid,
      },
    });

    return NextResponse.json(journal); // Use NextResponse.json here
  } catch (error) {
    console.error("Error creating Assigned journal entry:", error);
    return new NextResponse("Failed to Assigned journal entry", {
      status: 500,
    });
  }
}
