// app/api/papers/[paperID]/route.ts
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { paperID: string } }
) {
  const { paperID } = params;

  try {
    // Find the assigned journal using its `paperID`
    const journal = await prisma.assignedJournals.findFirst({
      where: {
        paperID: Number(paperID),
      },
      include: {
        reviewers: true,
      },
    });

    if (!journal) {
      return NextResponse.json(
        { message: 'Paper not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(journal.reviewers);
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Add other HTTP methods as needed
export async function POST(
  request: NextRequest,
  { params }: { params: { paperID: string } }
) {
  // Handle POST requests
  return NextResponse.json({ message: 'Method not implemented' }, { status: 405 });
}