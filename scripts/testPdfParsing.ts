// scripts/testPdfParsing.ts
/**
 * Test script for PDF parsing functionality
 * 
 * This script tests the PDF parser with sample ACORN schedule formats
 * and validates the extraction of course information.
 * 
 * Run with: npm run test:pdf
 */

import { mockPDFText, mockSchedules } from '../__tests__/testData';
import { getBuildingFullName } from '../lib/pdfParser';

console.log('📄 UofTwo PDF Parser Test\n');
console.log('=' .repeat(60));

// Simulate parsing the mock PDF text
console.log('\n📝 Sample ACORN Schedule Text:\n');
console.log('-'.repeat(60));
console.log(mockPDFText.trim());
console.log('-'.repeat(60));

// Test building name conversion
console.log('\n🏢 Building Name Conversion Test\n');
console.log('-'.repeat(60));

const testBuildings = ['BA', 'GB', 'MP', 'MS', 'SS', 'UC', 'RS', 'SF', 'WB', 'RW', 'ES'];

console.log('Code'.padEnd(8) + 'Full Name');
console.log('-'.repeat(60));

testBuildings.forEach(code => {
  const fullName = getBuildingFullName(code);
  console.log(`${code.padEnd(8)}${fullName}`);
});

// Display parsed schedules
console.log('\n📚 Parsed Course Schedules\n');
console.log('=' .repeat(60));

const archetypes = ['techie', 'creative', 'businessMinded', 'scienceOutdoorsy'];

archetypes.forEach(archetype => {
  const schedule = mockSchedules[archetype];
  
  console.log(`\n${archetype.toUpperCase()}:`);
  console.log('-'.repeat(60));
  
  if (schedule && schedule.length > 0) {
    console.log('Code'.padEnd(12) + 'Name'.padEnd(35) + 'Building'.padEnd(10) + 'Time');
    console.log('-'.repeat(60));
    
    schedule.forEach(course => {
      const code = course.courseCode.padEnd(12);
      const name = (course.courseName || 'N/A').substring(0, 33).padEnd(35);
      const building = (course.building || 'N/A').padEnd(10);
      const time = course.time || 'N/A';
      
      console.log(`${code}${name}${building}${time}`);
    });
    
    // Extract unique buildings
    const buildings = [...new Set(schedule.map(c => c.building).filter(Boolean))];
    console.log(`\nBuildings: ${buildings.join(', ')}`);
    console.log(`Total Courses: ${schedule.length}`);
  } else {
    console.log('No courses found.');
  }
});

// Test schedule overlap detection
console.log('\n\n🕐 Schedule Overlap Analysis\n');
console.log('=' .repeat(60));

interface TimeSlotInfo {
  day: string;
  startTime: string;
  endTime: string;
  courseCode: string;
}

// Extract time slots from mock schedules
function extractTimeSlots(archetype: string): TimeSlotInfo[] {
  const schedule = mockSchedules[archetype];
  const slots: TimeSlotInfo[] = [];
  
  schedule.forEach(course => {
    if (course.time) {
      // Parse time format: "MO 10:00AM-12:00PM"
      const match = course.time.match(/([A-Z]{2,3})\s+(\d{1,2}:\d{2}[AP]M)-(\d{1,2}:\d{2}[AP]M)/);
      if (match) {
        const [, day, startTime, endTime] = match;
        slots.push({
          day: mapDayCode(day),
          startTime,
          endTime,
          courseCode: course.courseCode,
        });
      }
    }
  });
  
  return slots;
}

function mapDayCode(code: string): string {
  const dayMap: Record<string, string> = {
    'MO': 'Monday',
    'TU': 'Tuesday',
    'WE': 'Wednesday',
    'TH': 'Thursday',
    'FR': 'Friday',
  };
  return dayMap[code] || code;
}

// Compare schedules
console.log('Comparing schedules for potential meeting times:\n');

const techieSlots = extractTimeSlots('techie');
const creativeSlots = extractTimeSlots('creative');

console.log('TECHIE Schedule:');
techieSlots.forEach(slot => {
  console.log(`  ${slot.day.padEnd(10)} ${slot.startTime}-${slot.endTime.padEnd(10)} (${slot.courseCode})`);
});

console.log('\nCREATIVE Schedule:');
creativeSlots.forEach(slot => {
  console.log(`  ${slot.day.padEnd(10)} ${slot.startTime}-${slot.endTime.padEnd(10)} (${slot.courseCode})`);
});

// Find free days
console.log('\n📅 Free Day Analysis:\n');

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

archetypes.forEach(archetype => {
  const slots = extractTimeSlots(archetype);
  const busyDays = new Set(slots.map(s => s.day));
  const freeDays = daysOfWeek.filter(day => !busyDays.has(day));
  
  console.log(`${archetype}:`);
  console.log(`  Busy days: ${[...busyDays].join(', ')}`);
  console.log(`  Free days: ${freeDays.length > 0 ? freeDays.join(', ') : 'None'}`);
  console.log('');
});

// Building proximity analysis
console.log('\n🗺️  Building Proximity Analysis\n');
console.log('=' .repeat(60));

const buildingClusters: Record<string, string[]> = {
  'Engineering': ['BA', 'GB', 'SF', 'WB', 'MY', 'MC'],
  'Science': ['MS', 'MP', 'LM', 'ES', 'RW'],
  'Arts': ['SS', 'UC', 'VC', 'IC', 'NC', 'SM'],
  'Libraries': ['RS', 'GE', 'KB'],
};

function identifyCluster(building: string): string {
  for (const [cluster, buildings] of Object.entries(buildingClusters)) {
    if (buildings.includes(building)) {
      return cluster;
    }
  }
  return 'Other';
}

archetypes.forEach(archetype => {
  const schedule = mockSchedules[archetype];
  const buildings = [...new Set(schedule.map(c => c.building).filter(Boolean))];
  
  const clusters = buildings.map(b => identifyCluster(b!));
  const uniqueClusters = [...new Set(clusters)];
  
  console.log(`${archetype}:`);
  console.log(`  Buildings: ${buildings.join(', ')}`);
  console.log(`  Clusters: ${uniqueClusters.join(', ')}`);
  console.log('');
});

// Summary statistics
console.log('\n📊 Parsing Statistics\n');
console.log('=' .repeat(60));

let totalCourses = 0;
let totalBuildings = new Set<string>();
let totalDays = new Set<string>();

archetypes.forEach(archetype => {
  const schedule = mockSchedules[archetype];
  const slots = extractTimeSlots(archetype);
  
  totalCourses += schedule.length;
  schedule.forEach(course => {
    if (course.building) totalBuildings.add(course.building);
  });
  slots.forEach(slot => totalDays.add(slot.day));
});

console.log(`Total Courses Across All Archetypes: ${totalCourses}`);
console.log(`Unique Buildings: ${totalBuildings.size}`);
console.log(`Active Days: ${[...totalDays].join(', ')}`);
console.log(`Average Courses per User: ${(totalCourses / archetypes.length).toFixed(1)}`);

console.log('\n✅ PDF parsing test complete!\n');
console.log('=' .repeat(60));
