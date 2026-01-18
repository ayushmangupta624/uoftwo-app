import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export interface CompatibilityData {
  summary: string;
  commonHobbies: string[];
  commonInterests: string[];
  commonMusicGenres: string[];
  commonBands: string[];
  sameClasses: string[];
  conversationStarters: string[];
}

/**
 * Generate a compatibility summary between two users using OpenAI
 */
export async function generateCompatibilitySummary(
  currentUserId: string,
  matchUserId: string
): Promise<CompatibilityData> {
  // Fetch both users' profiles with questionnaire data
  const [currentUser, matchUser] = await Promise.all([
    (prisma as any).user.findUnique({
      where: { userId: currentUserId },
      select: {
        fname: true,
        hobbies: true,
        favoriteBands: true,
        musicGenres: true,
        sportsTeams: true,
        clubs: true,
        favCampusSpots: true,
        personalityTraits: true,
        values: true,
        goingOutFrequency: true,
        idealWeekend: true,
        aboutMe: true,
        lookingFor: true,
        studyPreference: true,
        areas_of_study: true,
      },
    }),
    (prisma as any).user.findUnique({
      where: { userId: matchUserId },
      select: {
        fname: true,
        hobbies: true,
        favoriteBands: true,
        musicGenres: true,
        sportsTeams: true,
        clubs: true,
        favCampusSpots: true,
        personalityTraits: true,
        values: true,
        goingOutFrequency: true,
        idealWeekend: true,
        aboutMe: true,
        lookingFor: true,
        studyPreference: true,
        areas_of_study: true,
      },
    }),
  ]);

  if (!currentUser || !matchUser) {
    throw new Error("One or both users not found");
  }

  // Get schedules to check for same classes
  const [currentSchedule, matchSchedule] = await Promise.all([
    (prisma as any).schedule.findUnique({
      where: { userId: currentUserId },
      select: { courses: true },
    }).catch(() => null),
    (prisma as any).schedule.findUnique({
      where: { userId: matchUserId },
      select: { courses: true },
    }).catch(() => null),
  ]);

  // Calculate common hobbies (convert enums to strings)
  const currentHobbies = (currentUser.hobbies || []).map((h: any) => String(h));
  const matchHobbies = (matchUser.hobbies || []).map((h: any) => String(h));
  const commonHobbies = currentHobbies.filter((hobby: string) =>
    matchHobbies.includes(hobby)
  );

  // Calculate common music genres (convert enums to strings)
  const currentGenres = (currentUser.musicGenres || []).map((g: any) => String(g));
  const matchGenres = (matchUser.musicGenres || []).map((g: any) => String(g));
  const commonMusicGenres = currentGenres.filter((genre: string) =>
    matchGenres.includes(genre)
  );

  // Calculate common bands/artists
  const commonBands = (currentUser.favoriteBands || []).filter((band: string) =>
    (matchUser.favoriteBands || []).includes(band)
  );

  // Calculate same classes
  let sameClasses: string[] = [];
  if (currentSchedule?.courses && matchSchedule?.courses) {
    const currentCourses = (currentSchedule.courses as any[]).map(c => c.courseCode).filter(Boolean);
    const matchCourses = (matchSchedule.courses as any[]).map(c => c.courseCode).filter(Boolean);
    sameClasses = currentCourses.filter((code: string) => matchCourses.includes(code));
  }

  // Calculate other common interests
  const currentUserInterests = [
    ...currentUser.clubs,
    ...currentUser.favCampusSpots,
    ...currentUser.values,
  ];

  const matchUserInterests = [
    ...matchUser.clubs,
    ...matchUser.favCampusSpots,
    ...matchUser.values,
  ];

  const commonInterests = currentUserInterests.filter((interest: string) =>
    matchUserInterests.includes(interest)
  );

  // Generate compatibility summary using OpenAI
  const prompt = `You are a professional matchmaker analyzing compatibility between two university students. Based on their questionnaire responses, create a warm, personalized compatibility summary.

**User 1 (${currentUser.fname}):**
- About Me: ${currentUser.aboutMe || "Not specified"}
- Looking For: ${currentUser.lookingFor || "Not specified"}
- Ideal Weekend: ${currentUser.idealWeekend || "Not specified"}
- Hobbies: ${currentUser.hobbies.join(", ") || "Not specified"}
- Music: ${currentUser.musicGenres.join(", ")} | Favorite Artists: ${currentUser.favoriteBands.join(", ")}
- Clubs: ${currentUser.clubs.join(", ") || "Not specified"}
- Personality Traits: ${currentUser.personalityTraits.join(", ") || "Not specified"}
- Values: ${currentUser.values.join(", ") || "Not specified"}
- Study Preference: ${currentUser.studyPreference || "Not specified"}
- Going Out Frequency: ${currentUser.goingOutFrequency || "Not specified"}

**User 2 (${matchUser.fname}):**
- About Me: ${matchUser.aboutMe || "Not specified"}
- Looking For: ${matchUser.lookingFor || "Not specified"}
- Ideal Weekend: ${matchUser.idealWeekend || "Not specified"}
- Hobbies: ${matchUser.hobbies.join(", ") || "Not specified"}
- Music: ${matchUser.musicGenres.join(", ")} | Favorite Artists: ${matchUser.favoriteBands.join(", ")}
- Clubs: ${matchUser.clubs.join(", ") || "Not specified"}
- Personality Traits: ${matchUser.personalityTraits.join(", ") || "Not specified"}
- Values: ${matchUser.values.join(", ") || "Not specified"}
- Study Preference: ${matchUser.studyPreference || "Not specified"}
- Going Out Frequency: ${matchUser.goingOutFrequency || "Not specified"}

**Common Ground:**
- Common Hobbies: ${commonHobbies.join(", ") || "None identified"}
- Common Music Genres: ${commonMusicGenres.join(", ") || "None identified"}
- Common Artists/Bands: ${commonBands.join(", ") || "None identified"}
- Same Classes: ${sameClasses.join(", ") || "No shared classes"}
- Common Interests: ${commonInterests.slice(0, 5).join(", ") || "None identified"}

Create a 3-4 sentence compatibility summary that:
1. Highlights what makes them potentially compatible
2. References specific shared interests or complementary traits
3. Is warm and encouraging without being overly enthusiastic
4. Sounds natural and authentic

Also suggest 3 specific conversation starters based on their responses (be creative and reference actual details from their profiles).

Return ONLY a JSON object in this exact format (no markdown, no code blocks):
{
  "summary": "Your 3-4 sentence compatibility summary here",
  "conversationStarters": ["Starter 1", "Starter 2", "Starter 3"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional matchmaker creating personalized compatibility summaries. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 400,
    temperature: 0.8,
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0]?.message?.content || "{}";
  const aiResponse = JSON.parse(responseText);

  return {
    summary: aiResponse.summary || "You share some interesting commonalities that could make for great conversations.",
    commonHobbies: commonHobbies,
    commonMusicGenres: commonMusicGenres,
    commonBands: commonBands,
    sameClasses: sameClasses,
    commonInterests: commonInterests.slice(0, 10), // Limit to top 10
    conversationStarters: aiResponse.conversationStarters || [],
  };
}
