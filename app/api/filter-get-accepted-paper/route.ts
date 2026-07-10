
import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(request: any) {
  const body = await request.json();
  const exist = await prisma.assignedJournals.findMany({
    where: {

        OR: [
          {
            AND: [
              {
                authorNames: {
                  contains: body.data.authorName.toString(),
                  mode: 'insensitive', 
                },
              },
              {
                title: {
                  contains: body.data.paperTitle.toString(),
                  mode: 'insensitive',
                },
              },
              {
                type: {
                  contains: body.data.paperType.toString(),
                  mode: 'insensitive', 
                },
              },
              {
                country: {
                  contains: body.data.country.toString(),
                  mode: 'insensitive',
                },
              },
              {status:{equals:"ACCEPTED"}},
              {
                editorName:{equals:body.data.editorName}
              },
            ],
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        paperID: true,
        authorNames: true,
        authorEmail: true,
        type: true,
        title: true,
        abstract: true,
        keywords: true,
        paperUrl: true,
        primaryDomain: true,
        secondaryDomain: true,
        country: true,
        editorName: true,
        isPublished: true,
        associateEditor: true,
        isEditable: true,
        isReviewerAssigned: true,
        isAssigndToEditor: true,
        isAssociatedEditorAssigned: true,
        isSubmitted: true,
        createdAt: true,
        updatedAt: true,
        txtUrl: true,
        status: true,
      },
    });
    
  return NextResponse.json(exist);
}
