// lib/scheduleParser.ts

import Tesseract from 'tesseract.js';
import { ParsedCourse } from '@/types';

/**
 * Extract text from an image using OCR
 */
export async function extractTextFromImage(imageFile: File): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(
    imageFile,
    'eng',
    {
      logger: (m) => console.log(m),
    }
  );
  
  return text;
}

/**
 * Extract text from PDF using pdf-parse
 */
export async function extractTextFromPDF(pdfFile: File): Promise<string> {
  const pdf = require('pdf-parse');
  
  const arrayBuffer = await pdfFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const data = await pdf(buffer);
  return data.text;
}

/**
 * Parse UofT course code
 * Format: ABC123H1 F/S/Y
 * Example: CSC148H1 F (Computer Science 148, Half credit, Session 1, Fall)
 */
function parseCourseCode(text: string): { code: string; semester: string } | null {
  // Match UofT course pattern: 3 letters + 3 digits + H/Y + 1 + optional semester
  const coursePattern = /([A-Z]{3}\d{3}[HY]\d)\s*([FSY])?/g;
  const match = coursePattern.exec(text);
  
  if (!match) return null;
  
  const code = match[1];
  const semesterCode = match[2] || 'F';
  
  const semesterMap: { [key: string]: string } = {
    'F': 'Fall',
    'S': 'Winter',
    'Y': 'Year'
  };
  
  return {
    code,
    semester: semesterMap[semesterCode] || 'Fall'
  };
}

/**
 * Parse time from various formats
 * Examples: "9:00 AM", "09:00", "9AM"
 */
function parseTime(timeStr: string): string {
  // Remove whitespace and convert to uppercase
  timeStr = timeStr.trim().toUpperCase();
  
  // Handle 12-hour format with AM/PM
  const twelveHourMatch = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)/);
  if (twelveHourMatch) {
    let hours = parseInt(twelveHourMatch[1]);
    const minutes = twelveHourMatch[2] || '00';
    const period = twelveHourMatch[3];
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  
  // Handle 24-hour format
  const twentyFourHourMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (twentyFourHourMatch) {
    const hours = twentyFourHourMatch[1].padStart(2, '0');
    const minutes = twentyFourHourMatch[2];
    return `${hours}:${minutes}`;
  }
  
  return '09:00'; // Default fallback
}

/**
 * Parse day of week to number
 */
function parseDayOfWeek(dayStr: string): number {
  const dayMap: { [key: string]: number } = {
    'MON': 0, 'MONDAY': 0,
    'TUE': 1, 'TUESDAY': 1,
    'WED': 2, 'WEDNESDAY': 2,
    'THU': 3, 'THURSDAY': 3,
    'FRI': 4, 'FRIDAY': 4,
    'SAT': 5, 'SATURDAY': 5,
    'SUN': 6, 'SUNDAY': 6,
  };
  
  const normalized = dayStr.toUpperCase().trim();
  return dayMap[normalized] ?? 0;
}

/**
 * Parse schedule text into structured course data
 * This is a heuristic parser - adjust based on actual Acorn format
 */
export function parseScheduleText(text: string): ParsedCourse[] {
  const courses: ParsedCourse[] = [];
  const lines = text.split('\n');
  
  let currentCourse: Partial<ParsedCourse> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Try to parse as course code
    const courseInfo = parseCourseCode(line);
    if (courseInfo) {
      // Save previous course
      if (currentCourse && currentCourse.courseCode) {
        courses.push(currentCourse as ParsedCourse);
      }
      
      // Start new course
      currentCourse = {
        courseCode: courseInfo.code,
        semester: courseInfo.semester,
        timeSlots: []
      };
      
      // Look ahead for course name (usually on same or next line)
      const nextLine = lines[i + 1]?.trim();
      if (nextLine && !parseCourseCode(nextLine)) {
        currentCourse.courseName = nextLine;
        i++; // Skip next line
      }
      continue;
    }
    
    // Try to parse time slot
    // Expected format: "MON 9:00-11:00 BA1234" or similar
    const timePattern = /(MON|TUE|WED|THU|FRI|SAT|SUN|MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)\s+(\d{1,2}:?\d{0,2}\s*[AP]?M?)\s*-\s*(\d{1,2}:?\d{0,2}\s*[AP]?M?)\s*([A-Z]{2}\s*\d+)?/i;
    const timeMatch = line.match(timePattern);
    
    if (timeMatch && currentCourse) {
      const dayOfWeek = parseDayOfWeek(timeMatch[1]);
      const startTime = parseTime(timeMatch[2]);
      const endTime = parseTime(timeMatch[3]);
      const location = timeMatch[4]?.trim();
      
      if (!currentCourse.timeSlots) {
        currentCourse.timeSlots = [];
      }
      
      currentCourse.timeSlots.push({
        dayOfWeek,
        startTime,
        endTime,
        location
      });
    }
  }
  
  // Don't forget the last course
  if (currentCourse && currentCourse.courseCode) {
    courses.push(currentCourse as ParsedCourse);
  }
  
  return courses;
}

/**
 * Main function to process uploaded schedule
 */
export async function processScheduleUpload(
  file: File,
  fileType: 'pdf' | 'image'
): Promise<ParsedCourse[]> {
  let text: string;
  
  if (fileType === 'image') {
    text = await extractTextFromImage(file);
  } else {
    text = await extractTextFromPDF(file);
  }
  
  const courses = parseScheduleText(text);
  
  // Validate that we got at least some courses
  if (courses.length === 0) {
    throw new Error('No courses found in schedule. Please check the file and try again.');
  }
  
  return courses;
}

/**
 * Calculate schedule compatibility between two users
 * Returns percentage of overlapping free time
 */
export function calculateScheduleCompatibility(
  schedule1: ParsedCourse[],
  schedule2: ParsedCourse[]
): {
  compatibilityScore: number;
  freeTimeOverlap: string[];
  commonCourses: string[];
} {
  // Create time grid (Mon-Fri, 8am-10pm in 30-min slots)
  const createTimeGrid = (courses: ParsedCourse[]) => {
    const grid: boolean[][] = Array(5).fill(null).map(() => Array(28).fill(false));
    
    courses.forEach(course => {
      course.timeSlots.forEach(slot => {
        if (slot.dayOfWeek >= 5) return; // Skip weekends for now
        
        const [startHour, startMin] = slot.startTime.split(':').map(Number);
        const [endHour, endMin] = slot.endTime.split(':').map(Number);
        
        const startSlot = (startHour - 8) * 2 + (startMin >= 30 ? 1 : 0);
        const endSlot = (endHour - 8) * 2 + (endMin > 30 ? 1 : 0);
        
        for (let day = slot.dayOfWeek; day <= slot.dayOfWeek; day++) {
          for (let slot = Math.max(0, startSlot); slot < Math.min(28, endSlot); slot++) {
            grid[day][slot] = true;
          }
        }
      });
    });
    
    return grid;
  };
  
  const grid1 = createTimeGrid(schedule1);
  const grid2 = createTimeGrid(schedule2);
  
  // Calculate overlap
  let totalSlots = 0;
  let freeOverlapSlots = 0;
  const freeTimeOverlap: string[] = [];
  
  for (let day = 0; day < 5; day++) {
    for (let slot = 0; slot < 28; slot++) {
      totalSlots++;
      if (!grid1[day][slot] && !grid2[day][slot]) {
        freeOverlapSlots++;
        
        // Record significant free time blocks (2+ consecutive hours)
        if (slot % 4 === 0 && !grid1[day][slot] && !grid1[day][slot + 1] && !grid1[day][slot + 2] && !grid1[day][slot + 3] &&
            !grid2[day][slot] && !grid2[day][slot + 1] && !grid2[day][slot + 2] && !grid2[day][slot + 3]) {
          const hour = 8 + Math.floor(slot / 2);
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          freeTimeOverlap.push(`${days[day]} ${hour}:00-${hour + 2}:00`);
        }
      }
    }
  }
  
  // Find common courses
  const codes1 = new Set(schedule1.map(c => c.courseCode));
  const codes2 = new Set(schedule2.map(c => c.courseCode));
  const commonCourses = Array.from(codes1).filter(code => codes2.has(code));
  
  const compatibilityScore = Math.round((freeOverlapSlots / totalSlots) * 100);
  
  return {
    compatibilityScore,
    freeTimeOverlap: Array.from(new Set(freeTimeOverlap)).slice(0, 5), // Top 5 overlap times
    commonCourses
  };
}
