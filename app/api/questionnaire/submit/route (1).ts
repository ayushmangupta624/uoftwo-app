// app/api/questionnaire/submit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { QuestionnaireData } from '@/types';

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
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const data: QuestionnaireData = await request.json();

    // Validate required fields
    if (!data.hobbies || data.hobbies.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one hobby' },
        { status: 400 }
      );
    }

    // Delete existing questionnaire if any
    await prisma.questionnaire.deleteMany({
      where: { userId: user.id }
    });

    // Create new questionnaire
    const questionnaire = await prisma.questionnaire.create({
      data: {
        userId: user.id,
        hobbies: data.hobbies,
        favoriteBands: data.favoriteBands || [],
        musicGenres: data.musicGenres || [],
        sportsTeams: data.sportsTeams || [],
        footballPreference: data.footballPreference,
        clubs: data.clubs || [],
        studyPreference: data.studyPreference,
        favCampusSpots: data.favCampusSpots || [],
        personalityTraits: data.personalityTraits || [],
        values: data.values || [],
        goingOutFrequency: data.goingOutFrequency,
        idealWeekend: data.idealWeekend,
        aboutMe: data.aboutMe,
        lookingFor: data.lookingFor,
        dealBreakers: data.dealBreakers || [],
      }
    });

    // Create interest records for better matching
    const interests = [
      ...data.hobbies.map(h => ({ category: 'hobby', name: h, importance: 4 })),
      ...data.musicGenres.map(g => ({ category: 'music', name: g, importance: 3 })),
      ...data.sportsTeams.map(t => ({ category: 'sports', name: t, importance: 3 })),
      ...data.clubs.map(c => ({ category: 'club', name: c, importance: 5 })),
      ...data.values.map(v => ({ category: 'value', name: v, importance: 5 })),
    ];

    // Delete existing interests
    await prisma.interest.deleteMany({
      where: { userId: user.id }
    });

    // Create new interests
    await prisma.interest.createMany({
      data: interests.map(i => ({
        userId: user.id,
        ...i
      }))
    });

    return NextResponse.json({
      success: true,
      questionnaire,
      message: 'Questionnaire submitted successfully'
    });

  } catch (error) {
    console.error('Questionnaire submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit questionnaire' },
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
      where: { email: session.user.email },
      include: {
        questionnaire: true,
        interests: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      questionnaire: user.questionnaire,
      interests: user.interests
    });

  } catch (error) {
    console.error('Get questionnaire error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire' },
      { status: 500 }
    );
  }
}
