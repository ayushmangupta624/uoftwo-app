// app/api/matching/respond/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { createMatch, acceptMatch } from '@/lib/matchingAlgorithm';
import { generateActivitySuggestions, generateIcebreakers } from '@/lib/aiProfileGenerator';

const prisma = new PrismaClient();

/**
 * Create a match (swipe right / like)
 */
export async function POST(request: NextRequest) {
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

    const { matchedUserId, score } = await request.json();

    if (!matchedUserId || !score) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the match
    const matchId = await createMatch(user.id, matchedUserId, score);

    // Check if this creates a mutual match
    const reciprocalMatch = await prisma.match.findFirst({
      where: {
        userId: matchedUserId,
        matchedUserId: user.id,
        status: 'pending'
      }
    });

    let result: any = {
      success: true,
      matchId,
      status: 'pending'
    };

    if (reciprocalMatch) {
      // It's a mutual match!
      const acceptResult = await acceptMatch(matchId);
      
      if (acceptResult.status === 'mutual') {
        // Generate activity suggestions and icebreakers
        const [currentUser, matchedUser] = await Promise.all([
          prisma.user.findUnique({
            where: { id: user.id },
            include: { questionnaire: true }
          }),
          prisma.user.findUnique({
            where: { id: matchedUserId },
            include: { questionnaire: true }
          })
        ]);

        if (currentUser?.aiProfile && matchedUser?.aiProfile && 
            currentUser.questionnaire && matchedUser.questionnaire) {
          
          const profile1 = JSON.parse(currentUser.aiProfile);
          const profile2 = JSON.parse(matchedUser.aiProfile);

          // Generate suggestions in parallel
          const [activities, icebreakers] = await Promise.all([
            generateActivitySuggestions(
              { profile: profile1, questionnaire: currentUser.questionnaire },
              { profile: profile2, questionnaire: matchedUser.questionnaire },
              { freeTimeOverlap: score.scheduleOverlap?.freeTimeSlots || [] }
            ),
            generateIcebreakers(profile1, profile2, score.sharedInterests || [])
          ]);

          // Save activity suggestions
          await prisma.activitySuggestion.createMany({
            data: activities.map(activity => ({
              matchId,
              ...activity
            }))
          });

          // Update conversation with icebreakers
          if (acceptResult.conversationId) {
            await prisma.conversation.update({
              where: { id: acceptResult.conversationId },
              data: { icebreakers }
            });
          }

          result = {
            ...result,
            status: 'mutual',
            conversationId: acceptResult.conversationId,
            activities: activities.slice(0, 3),
            icebreakers: icebreakers.slice(0, 3)
          };
        }
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Match creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
}

/**
 * Reject a match
 */
export async function DELETE(request: NextRequest) {
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

    const { matchedUserId } = await request.json();

    // Create a rejected match record (to avoid showing again)
    await prisma.match.create({
      data: {
        userId: user.id,
        matchedUserId,
        score: 0,
        status: 'rejected'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Match rejected'
    });

  } catch (error) {
    console.error('Match rejection error:', error);
    return NextResponse.json(
      { error: 'Failed to reject match' },
      { status: 500 }
    );
  }
}

/**
 * Get match details
 */
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

    const url = new URL(request.url);
    const matchId = url.searchParams.get('matchId');

    if (!matchId) {
      // Get all matches for user
      const matches = await prisma.match.findMany({
        where: {
          OR: [
            { userId: user.id },
            { matchedUserId: user.id }
          ],
          status: { in: ['accepted', 'mutual'] }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
              archetype: true,
              year: true,
              program: true
            }
          },
          matchedUser: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
              archetype: true,
              year: true,
              program: true
            }
          },
          suggestions: true,
          conversation: {
            include: {
              messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ matches });
    }

    // Get specific match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user: true,
        matchedUser: true,
        suggestions: true,
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    // Verify user has access to this match
    if (match.userId !== user.id && match.matchedUserId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ match });

  } catch (error) {
    console.error('Get match error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}
