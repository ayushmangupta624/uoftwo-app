import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";
import { parseSchedulePdf } from "@/lib/pdfParser";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pdfUrl = formData.get('pdfUrl') as string | null;

    if (!file && !pdfUrl) {
      return NextResponse.json(
        { error: "No file or URL provided" },
        { status: 400 }
      );
    }

    let courses = [];
    let buildings: string[] = [];

    // Parse PDF if file is provided
    if (file) {
      courses = await parseSchedulePdf(file);
      
      // Extract unique buildings
      buildings = [...new Set(courses
        .map(c => c.building)
        .filter(b => b !== undefined)
      )] as string[];
    }

    // Generate time slots for matching
    const timeSlots = generateTimeSlots(courses);

    // Upsert schedule
    const schedule = await prisma.schedule.upsert({
      where: { userId },
      update: {
        pdfUrl: pdfUrl || undefined,
        courses: courses as any,
        buildings,
        timeSlots: timeSlots as any,
        updatedAt: new Date(),
      },
      create: {
        userId,
        pdfUrl: pdfUrl || undefined,
        courses: courses as any,
        buildings,
        timeSlots: timeSlots as any,
      },
    });

    return NextResponse.json({
      success: true,
      schedule: {
        id: schedule.id,
        coursesCount: courses.length,
        buildings,
        parsedAt: schedule.parsedAt,
      },
    });
  } catch (error) {
    console.error("Error processing schedule:", error);
    return NextResponse.json(
      { error: "Failed to process schedule" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const schedule = await prisma.schedule.findUnique({
      where: { userId },
    });

    if (!schedule) {
      return NextResponse.json({ schedule: null });
    }

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Generate structured time slots from courses for matching
 */
function generateTimeSlots(courses: any[]): any[] {
  const slots: any[] = [];

  courses.forEach(course => {
    if (!course.time) return;

    // Parse time string (e.g., "MO 10:00AM-12:00PM")
    const match = course.time.match(/([A-Z]{2,3})\s+(\d{1,2}:\d{2}[AP]M)-(\d{1,2}:\d{2}[AP]M)/);
    
    if (match) {
      const [_, day, startTime, endTime] = match;
      
      slots.push({
        day: mapDayCode(day),
        startTime,
        endTime,
        building: course.building,
        courseCode: course.courseCode,
      });
    }
  });

  return slots;
}

/**
 * Map day codes to full day names
 */
function mapDayCode(code: string): string {
  const dayMap: Record<string, string> = {
    'MO': 'Monday',
    'TU': 'Tuesday',
    'WE': 'Wednesday',
    'TH': 'Thursday',
    'FR': 'Friday',
    'SA': 'Saturday',
    'SU': 'Sunday',
  };
  return dayMap[code] || code;
}
