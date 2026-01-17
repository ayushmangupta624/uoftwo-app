// @ts-ignore - pdf-parse doesn't have TypeScript definitions
import pdf from 'pdf-parse';
import { ParsedCourse } from '@/types';

/**
 * Parse UofT ACORN schedule PDF and extract course information
 */
export async function parseSchedulePdf(file: File): Promise<ParsedCourse[]> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const data = await pdf(buffer);
    const text = data.text;

    // Parse course information from PDF text
    const courses = extractCoursesFromText(text);
    
    return courses;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse schedule PDF');
  }
}

/**
 * Extract course information from ACORN PDF text
 * ACORN PDFs typically have format like:
 * CSC108H1 F LEC0101 TH 10:00AM-12:00PM BA1170
 */
function extractCoursesFromText(text: string): ParsedCourse[] {
  const courses: ParsedCourse[] = [];
  const lines = text.split('\n');

  // Regex patterns for ACORN schedule format
  // Pattern: COURSE_CODE SECTION DAY TIME BUILDING+ROOM
  const coursePattern = /([A-Z]{3}\d{3}[HY]\d)\s+([A-Z])\s+([A-Z]{3}\d{4})\s+([A-Z]{2,3})\s+(\d{1,2}:\d{2}[AP]M)-(\d{1,2}:\d{2}[AP]M)\s+([A-Z]{2,4})(\d{3,4})?/;
  
  // Alternative pattern for courses without room numbers
  const coursePatternNoRoom = /([A-Z]{3}\d{3}[HY]\d)\s+([A-Z])\s+([A-Z]{3}\d{4})\s+([A-Z]{2,3})\s+(\d{1,2}:\d{2}[AP]M)-(\d{1,2}:\d{2}[AP]M)\s+([A-Z]{2,4})/;

  for (const line of lines) {
    const match = line.match(coursePattern) || line.match(coursePatternNoRoom);
    
    if (match) {
      const [_, courseCode, semester, section, day, startTime, endTime, building, room] = match;
      
      courses.push({
        courseCode: courseCode,
        courseName: extractCourseName(lines, line),
        building: building,
        time: `${day} ${startTime}-${endTime}`,
      });
    }
  }

  // Remove duplicates (same course, different sections)
  const uniqueCourses = courses.filter((course, index, self) =>
    index === self.findIndex((c) => c.courseCode === course.courseCode && c.time === course.time)
  );

  return uniqueCourses;
}

/**
 * Try to extract course name from nearby lines
 */
function extractCourseName(lines: string[], courseLine: string): string | undefined {
  const courseIndex = lines.indexOf(courseLine);
  
  // Check previous lines for course name (usually appears before course code)
  for (let i = Math.max(0, courseIndex - 3); i < courseIndex; i++) {
    const line = lines[i].trim();
    // Course names are usually longer text, not codes
    if (line.length > 10 && !line.match(/^[A-Z]{3}\d{3}/)) {
      return line;
    }
  }
  
  return undefined;
}

/**
 * Parse building codes to full names
 */
export function getBuildingFullName(code: string): string {
  const buildingMap: Record<string, string> = {
    'BA': 'Bahen Centre',
    'GB': 'Galbraith Building',
    'MP': 'McLennan Physical Labs',
    'MS': 'Medical Sciences Building',
    'SS': 'Sidney Smith Hall',
    'RW': 'Ramsay Wright Zoological Labs',
    'UC': 'University College',
    'VC': 'Victoria College',
    'AB': 'Alumni Hall',
    'BR': 'Brennan Hall',
    'CR': 'Carr Hall',
    'ES': 'Earth Sciences Centre',
    'GE': 'Gerstein Science Information Centre',
    'HA': 'Health Sciences Building',
    'KP': 'Koffler Student Services',
    'LM': 'Lash Miller Chemical Labs',
    'MC': 'Mechanical Engineering Building',
    'NF': 'Northrop Frye Hall',
    'OI': 'Ontario Institute for Studies in Education',
    'PB': 'Pharmacy Building',
    'RS': 'Robarts Library',
    'SF': 'Sandford Fleming Building',
    'WB': 'Wallberg Building',
    'WW': 'Woodsworth College',
  };

  return buildingMap[code] || code;
}

/**
 * Export parsed schedule to JSON
 */
export function exportScheduleToJson(courses: ParsedCourse[], userId: string): string {
  const scheduleData = {
    userId,
    courses,
    parsedAt: new Date().toISOString(),
    totalCourses: courses.length,
  };

  return JSON.stringify(scheduleData, null, 2);
}
