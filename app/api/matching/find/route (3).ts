// app/api/matching/find/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { findMatches } from '@/lib/matchingAlgorithm';
import { generateActivitySuggestions } from '@/lib/aiProfileGenerator';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.profileCompleted) {
      return NextResponse.json(
        { error: 'Please complete your profile first' },
        { status: 400 }
      );
    }

    // Get limit from query params (default 10)
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Find matches
    const matches = await findMatches(user.id, limit);

    return NextResponse.json({
      success: true,
      matches,
      count: matches.length
    });

  } catch (error) {
    console.error('Find matches error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to find matches'
      },
      { status: 500 }
    );
  }
}
