// __tests__/pdfParser.test.ts
// Tests for PDF parsing functionality

import { parseSchedulePdf, getBuildingFullName } from '@/lib/pdfParser';
import { mockPDFText } from './testData';

// Mock pdf-parse module
jest.mock('pdf-parse', () => {
  return jest.fn((buffer: Buffer) => {
    // Return mock PDF data based on buffer content
    const text = buffer.toString();
    return Promise.resolve({
      text: text || mockPDFText,
      numpages: 1,
      info: {},
      metadata: null,
    });
  });
});

describe('PDF Parser', () => {
  describe('parseSchedulePdf', () => {
    it('should parse a valid ACORN schedule PDF', async () => {
      // Create a mock file with our test PDF text
      const mockFile = new File([mockPDFText], 'schedule.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      expect(courses).toBeDefined();
      expect(courses.length).toBeGreaterThan(0);
    });

    it('should extract correct course codes', async () => {
      const mockFile = new File([mockPDFText], 'schedule.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      const courseCodes = courses.map(c => c.courseCode);
      expect(courseCodes).toContain('CSC369H1');
      expect(courseCodes).toContain('CSC373H1');
      expect(courseCodes).toContain('CSC384H1');
      expect(courseCodes).toContain('MAT237Y1');
    });

    it('should extract building codes', async () => {
      const mockFile = new File([mockPDFText], 'schedule.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      const buildings = courses.map(c => c.building).filter(Boolean);
      expect(buildings).toContain('BA');
      expect(buildings).toContain('MP');
    });

    it('should extract time information', async () => {
      const mockFile = new File([mockPDFText], 'schedule.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      const course = courses.find(c => c.courseCode === 'CSC369H1');
      expect(course?.time).toBeTruthy();
      expect(course?.time).toContain('MO');
      expect(course?.time).toContain('10:00AM');
      expect(course?.time).toContain('12:00PM');
    });

    it('should handle empty PDF', async () => {
      const emptyText = 'UNIVERSITY OF TORONTO\nACORN Student Schedule\n\nNo courses enrolled.';
      const mockFile = new File([emptyText], 'empty.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      expect(courses).toEqual([]);
    });

    it('should handle invalid PDF format', async () => {
      const invalidText = 'This is not a valid ACORN schedule format.';
      const mockFile = new File([invalidText], 'invalid.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      expect(courses).toEqual([]);
    });

    it('should remove duplicate courses', async () => {
      const duplicateText = `
CSC369H1 F LEC0101 MO 10:00AM-12:00PM BA1170
Introduction to Operating Systems

CSC369H1 F LEC0101 MO 10:00AM-12:00PM BA1170
Introduction to Operating Systems
      `;
      
      const mockFile = new File([duplicateText], 'duplicate.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      // Should only have one instance of CSC369H1
      const csc369Count = courses.filter(c => c.courseCode === 'CSC369H1').length;
      expect(csc369Count).toBe(1);
    });

    it('should handle courses without room numbers', async () => {
      const noRoomText = 'CSC108H1 F LEC0101 TH 10:00AM-12:00PM BA';
      const mockFile = new File([noRoomText], 'noroom.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      expect(courses.length).toBe(1);
      expect(courses[0].building).toBe('BA');
    });

    it('should parse different day codes', async () => {
      const multiDayText = `
CSC108H1 F LEC0101 MO 10:00AM-12:00PM BA1170
CSC207H1 F LEC0101 TU 2:00PM-4:00PM BA1180
CSC209H1 F LEC0101 WE 9:00AM-11:00AM BA1190
CSC236H1 F LEC0101 TH 1:00PM-3:00PM BA1200
CSC258H1 F LEC0101 FR 10:00AM-12:00PM BA1210
      `;
      
      const mockFile = new File([multiDayText], 'multiday.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      expect(courses.length).toBe(5);
      
      const days = courses.map(c => c.time?.substring(0, 2));
      expect(days).toContain('MO');
      expect(days).toContain('TU');
      expect(days).toContain('WE');
      expect(days).toContain('TH');
      expect(days).toContain('FR');
    });
  });

  describe('getBuildingFullName', () => {
    it('should convert building codes to full names', () => {
      expect(getBuildingFullName('BA')).toBe('Bahen Centre');
      expect(getBuildingFullName('GB')).toBe('Galbraith Building');
      expect(getBuildingFullName('MP')).toBe('McLennan Physical Labs');
      expect(getBuildingFullName('MS')).toBe('Medical Sciences Building');
      expect(getBuildingFullName('SS')).toBe('Sidney Smith Hall');
    });

    it('should return the code if building not found', () => {
      expect(getBuildingFullName('UNKNOWN')).toBe('UNKNOWN');
      expect(getBuildingFullName('XYZ')).toBe('XYZ');
    });

    it('should handle common buildings', () => {
      const commonBuildings = ['BA', 'UC', 'RS', 'SF', 'WB'];
      
      commonBuildings.forEach(code => {
        const fullName = getBuildingFullName(code);
        expect(fullName).toBeTruthy();
        expect(fullName).not.toBe(code); // Should have a mapping
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle courses with irregular spacing', async () => {
      const irregularText = 'CSC369H1   F   LEC0101   MO   10:00AM-12:00PM   BA1170';
      const mockFile = new File([irregularText], 'irregular.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      expect(courses.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle year-long courses (Y suffix)', async () => {
      const yearLongText = 'MAT237Y1 Y LEC0101 TU 12:00PM-1:00PM MP102';
      const mockFile = new File([yearLongText], 'yearlong.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      expect(courses.length).toBe(1);
      expect(courses[0].courseCode).toBe('MAT237Y1');
    });

    it('should handle half-year courses (H suffix)', async () => {
      const halfYearText = 'CSC369H1 F LEC0101 MO 10:00AM-12:00PM BA1170';
      const mockFile = new File([halfYearText], 'halfyear.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      expect(courses.length).toBe(1);
      expect(courses[0].courseCode).toBe('CSC369H1');
    });

    it('should handle different time formats', async () => {
      const timeFormatsText = `
CSC108H1 F LEC0101 MO 9:00AM-11:00AM BA1170
CSC207H1 F LEC0101 TU 10:00AM-12:00PM BA1180
CSC209H1 F LEC0101 WE 1:00PM-3:00PM BA1190
      `;
      
      const mockFile = new File([timeFormatsText], 'timeformats.pdf', { type: 'application/pdf' });
      
      const courses = await parseSchedulePdf(mockFile);
      
      expect(courses.length).toBe(3);
      courses.forEach(course => {
        expect(course.time).toMatch(/\d{1,2}:\d{2}[AP]M-\d{1,2}:\d{2}[AP]M/);
      });
    });
  });
});
