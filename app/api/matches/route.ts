import { NextRequest, NextResponse } from 'next/server';
import { rankMatches } from '@/lib/matchingAlgorithm';

/**
 * GET /api/matches?userId=...&limit=...
 * 
 * Returns ranked matches for a user based on:
 * - 50% questionnaire compatibility
 * - 25% viewing behavior preferences
 * - 25% schedule compatibility (placeholder)
 * 
 * Matches are ranked by calculated compatibility score
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // TODO: Fetch current user's preferences (questionnaire + implicit from viewing)
    // TODO: Fetch all candidate users' preferences
    // TODO: Use rankMatches() to sort by compatibility
    // TODO: Return top matches with scores

    return NextResponse.json({
      userId,
      matches: [],
      blendingRatio: {
        questionnaire: 0.5,
        implicitBehavior: 0.25,
        schedule: 0.25,
      },
      note: 'Matches are ranked by compatibility considering viewing behavior as indicator of preference refinement',
    });
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
