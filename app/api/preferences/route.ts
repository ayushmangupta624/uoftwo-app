import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/preferences?userId=...
 * Returns the user's blended preferences (questionnaire + viewing behavior)
 * 
 * Blending ratio:
 * - 50% from questionnaire (explicit preferences)
 * - 25% from viewing behavior (implicit preferences)
 * - 25% reserved for schedule compatibility
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // TODO: Fetch user's questionnaire from database
    // TODO: Fetch user's profile views from database
    // TODO: Calculate implicit preferences from views
    // TODO: Blend explicit + implicit with 50/25 ratio
    // TODO: Return blended preferences

    // Placeholder response
    return NextResponse.json({
      userId,
      archetypeScores: {},
      buildingScores: {},
      confidenceScore: 0,
      blendingRatio: {
        questionnaire: 0.5,
        implicitBehavior: 0.25,
        schedule: 0.25,
      },
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
