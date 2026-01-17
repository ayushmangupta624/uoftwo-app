// app/api/schedule/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { processScheduleUpload } from '@/lib/scheduleParser';
import { put } from '@vercel/blob';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as 'pdf' | 'image';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (fileType === 'pdf' && !file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Invalid file type. Expected PDF.' },
        { status: 400 }
      );
    }

    if (fileType === 'image' && !file.type.includes('image')) {
      return NextResponse.json(
        { error: 'Invalid file type. Expected image.' },
        { status: 400 }
      );
    }

    // Upload file to blob storage
    const blob = await put(`schedules/${user.id}/${file.name}`, file, {
      access: 'public',
    });

    // Process the schedule
    const courses = await processScheduleUpload(file, fileType);

    // Save to database
    // Delete existing schedule if any
    await prisma.schedule.deleteMany({
      where: { userId: user.id }
    });

    // Create new schedule
    const schedule = await prisma.schedule.create({
      data: {
        userId: user.id,
        rawFileUrl: blob.url,
        fileType,
        courses: {
          create: courses.map(course => ({
            courseCode: course.courseCode,
            courseName: course.courseName,
            semester: course.semester,
            timeSlots: {
              create: course.timeSlots
            }
          }))
        }
      },
      include: {
        courses: {
          include: {
            timeSlots: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      schedule,
      message: `Successfully processed ${courses.length} courses`
    });

  } catch (error) {
    console.error('Schedule upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process schedule' },
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

    return NextResponse.json({
      schedule: user.schedule
    });

  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}
