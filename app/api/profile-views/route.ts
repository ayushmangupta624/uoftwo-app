import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateImplicitPreferences } from '@/lib/preferenceCalculator';

/**
 * POST /api/profile-views
 * 
 * Track a user's profile view and update their implicit preference profile
 * 
 * Request body:
 * {
 *   userId: string (ID of the user viewing the profile)
 *   viewedProfileId: string (ID of the profile being viewed)
 *   viewStartTime: ISO string (when viewing started)
 *   viewEndTime?: ISO string (when viewing ended)
 *   scrollDepth?: number (0-1, how far user scrolled)
 *   actionType?: string ('like', 'pass', 'bookmark', etc.)
 * }
 * 
 * Behavior:
 * - Saves the profile view to database
 * - Recalculates user's implicit preferences based on all their views
 * - Updates/creates UserPreferenceProfile with new scores and confidence
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      viewedProfileId,
      viewStartTime,
      viewEndTime,
      scrollDepth,
      actionType,
    } = body;

    if (!userId || !viewedProfileId || !viewStartTime) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, viewedProfileId, viewStartTime' },
        { status: 400 }
      );
    }

    // Calculate duration in seconds
    const duration = viewEndTime
      ? Math.floor((new Date(viewEndTime).getTime() - new Date(viewStartTime).getTime()) / 1000)
      : undefined;

    // Save profile view to database
    const profileView = await prisma.profileView.create({
      data: {
        viewerId: userId,
        viewedProfileId,
        duration: duration ?? 0,
        scrollDepth: scrollDepth ?? 0.5,
        interacted: !!actionType,
        interactionType: actionType,
      },
    });

    // Fetch all views for this user to recalculate implicit preferences
    const allViews = await prisma.profileView.findMany({
      where: { viewerId: userId },
      orderBy: { viewedAt: 'asc' },
    });

    // Calculate implicit preferences from all viewing behavior
    // const implicitPrefs = calculateImplicitPreferences(allViews);

    // TODO: Update or create user preference profile when schema is ready
    // const updatedPreferences = await prisma.userPreferenceProfile.upsert({
    //   where: { userId },
    //   create: {
    //     userId,
    //     featureScores: implicitPrefs.featureScores,
    //     confidenceScore: implicitPrefs.confidenceScore,
    //     viewCount: implicitPrefs.viewCount,
    //   },
    //   update: {
    //     featureScores: implicitPrefs.featureScores,
    //     confidenceScore: implicitPrefs.confidenceScore,
    //     viewCount: implicitPrefs.viewCount,
    //     lastUpdated: new Date(),
    //   },
    // });

    return NextResponse.json({
      success: true,
      data: {
        profileView: {
          id: profileView.id,
          viewerId: userId,
          viewedProfileId,
          duration: duration ?? 0,
          interactionType: actionType,
          interacted: profileView.interacted,
        },
        viewCount: allViews.length,
      },
    });
  } catch (error) {
    console.error('Error tracking profile view:', error);
    return NextResponse.json(
      { error: 'Failed to track profile view' },
      { status: 500 }
    );
  }
}
