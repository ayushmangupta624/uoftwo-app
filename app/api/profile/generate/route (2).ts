// app/api/profile/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { generateUserProfile, generateProfileEmbedding } from '@/lib/aiProfileGenerator';

const prisma = new PrismaClient();

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
      where: { email: session.user.email },
      include: {
        questionnaire: true,
        schedule: {
          include: {
            courses: {
              include: {
                timeSlots: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.questionnaire) {
      return NextResponse.json(
        { error: 'Please complete the questionnaire first' },
        { status: 400 }
      );
    }

    // Generate AI profile
    const aiProfile = await generateUserProfile({
      name: user.name,
      year: user.year || undefined,
      program: user.program || undefined,
      questionnaire: user.questionnaire,
      schedule: user.schedule?.courses
    });

    // Generate embedding for matching
    const embedding = await generateProfileEmbedding(
      aiProfile,
      user.questionnaire
    );

    // Update user with AI profile and embedding
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        aiProfile: JSON.stringify(aiProfile),
        archetype: aiProfile.archetype,
        embedding: JSON.stringify(embedding), // Store as JSON string
        profileCompleted: true
      }
    });

    return NextResponse.json({
      success: true,
      profile: aiProfile,
      message: 'Profile generated successfully'
    });

  } catch (error) {
    console.error('Profile generation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate profile',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const { aiProfile } = await request.json();

    // User can edit the AI-generated profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        aiProfile: JSON.stringify(aiProfile),
        archetype: aiProfile.archetype
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

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

    const profile = user.aiProfile ? JSON.parse(user.aiProfile) : null;

    return NextResponse.json({
      profile,
      archetype: user.archetype,
      profileCompleted: user.profileCompleted
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
