import { NextResponse } from "next/server";
import { UserProfile, MatchingUser, Gender } from "@/types/profile";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";
import { calculateCompatibilityScore, UserPreferences, ScheduleData } from "@/lib/matchingAlgorithm";
import { calculateImplicitPreferences, extractQuestionnairePreferences } from "@/lib/preferenceCalculator";
import { generateCompatibilitySummary } from "@/lib/compatibilityGenerator";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the current user's profile with questionnaire data
    const currentProfile = await (prisma as any).user.findUnique({
      where: { userId },
      include: {
        schedule: true,
      },
    });

    if (!currentProfile) {
      return NextResponse.json(
        { error: "Profile not found. Please complete your profile." },
        { status: 404 }
      );
    }

    const currentUserProfile: UserProfile = {
      id: currentProfile.id,
      user_id: currentProfile.userId,
      email: currentProfile.email || undefined,
      gender: currentProfile.gender as Gender,
      gender_preference: currentProfile.genderPreference as Gender[],
      fname: (currentProfile as any).fname,
      lname: (currentProfile as any).lname,
      areas_of_study: ((currentProfile as any).areas_of_study || []) as string[],
      ethnicity: (currentProfile as any).ethnicity as "ASIAN" | "BLACK" | "HISPANIC" | "WHITE" | "NATIVE" | "MIDDLE_EASTERN" | "OTHER",
    };

    // If the user has no gender preferences, return empty array
    if (
      !currentUserProfile.gender_preference ||
      currentUserProfile.gender_preference.length === 0
    ) {
      return NextResponse.json({ matches: [] });
    }

    // Get users that have been passed or liked by current user
    const prismaAny = prisma as any;
    
    // Check if userPass model exists
    if (!prismaAny.userPass) {
      console.error("Prisma client missing userPass model. Please restart the dev server.");
      return NextResponse.json(
        { error: "Server configuration error. Please restart the server." },
        { status: 500 }
      );
    }

    const [passedUsers, likedUsers] = await Promise.all([
      prismaAny.userPass.findMany({
        where: { passerId: userId },
        select: { passedId: true },
      }),
      prismaAny.userLike.findMany({
        where: { likerId: userId },
        select: { likedId: true },
      }),
    ]);

    const passedUserIds = new Set(passedUsers.map((p: any) => p.passedId));
    const likedUserIds = new Set(likedUsers.map((l: any) => l.likedId));

    // Get current user's profile views for smart matching
    const currentProfileViews = await prismaAny.profileView?.findMany({
      where: { viewerId: userId },
      include: {
        viewedProfile: {
          select: {
            userId: true,
            features: true,
            aiSummary: true,
          },
        },
      },
      take: 100,
    }).catch(() => []);

    // Calculate implicit preferences from viewing behavior
    const implicitPrefs = calculateImplicitPreferences(currentProfileViews || []);

    // Extract explicit preferences from questionnaire data
    const questionnaireData = {
      hobbies: currentProfile.hobbies || [],
      musicGenres: currentProfile.musicGenres || [],
      favoriteBands: currentProfile.favoriteBands || [],
      sportsTeams: currentProfile.sportsTeams || [],
      personalityTraits: currentProfile.personalityTraits || [],
      goingOutFrequency: currentProfile.goingOutFrequency || '',
      studyPreference: currentProfile.studyPreference || '',
      aboutMe: currentProfile.description || '',
    };
    const questionnaireFeatures = extractQuestionnairePreferences(questionnaireData);

    // Build current user preferences using schedule from currentProfile
    const currentUserScheduleData: ScheduleData | undefined = currentProfile.schedule ? {
      buildings: currentProfile.schedule.buildings || [],
      timeSlots: currentProfile.schedule.timeSlots || [],
      courses: currentProfile.schedule.courses || [],
    } : undefined;

    const currentUserPrefs: UserPreferences = {
      questionnaireFeatureScores: questionnaireFeatures,
      implicitFeatureScores: implicitPrefs.featureScores,
      implicitConfidenceScore: implicitPrefs.confidenceScore,
      scheduleData: currentUserScheduleData,
      aiSummary: currentProfile.aiSummary || undefined,
      hobbies: (currentProfile.hobbies || []).map((h: any) => String(h)),
      musicGenres: (currentProfile.musicGenres || []).map((g: any) => String(g)),
      favoriteBands: currentProfile.favoriteBands || [],
      areasOfStudy: currentProfile.areas_of_study || [],
    };

    // Find all users except current user with all relevant data
    const allUsers = await (prisma as any).user.findMany({
      where: {
        userId: {
          not: userId,
        },
      },
      include: {
        schedule: true,
      },
      select: {
        id: true,
        userId: true,
        email: true,
        gender: true,
        genderPreference: true,
        fname: true,
        lname: true,
        areas_of_study: true,
        ethnicity: true,
        images: true,
        dateOfBirth: true,
        yearOfStudy: true,
        campus: true,
        description: true,
        aiSummary: true,
        hobbies: true,
        musicGenres: true,
        favoriteBands: true,
        sportsTeams: true,
        personalityTraits: true,
        goingOutFrequency: true,
        studyPreference: true,
        features: true,
        schedule: true,
      },
    });

    // Filter users based on mutual matching
    const matchingUsers: MatchingUser[] = allUsers
      .filter((user: any) => {
        if (passedUserIds.has(user.userId) || likedUserIds.has(user.userId)) {
          return false;
        }

        const profileGender = user.gender as Gender;
        const profilePreferences = user.genderPreference as Gender[];

        const matchesCurrentUserPreference =
          currentUserProfile.gender_preference.includes(profileGender);

        const currentUserGenderMatches =
          profilePreferences.includes(currentUserProfile.gender);

        return matchesCurrentUserPreference && currentUserGenderMatches;
      })
      .map((user: any) => ({
        id: user.id,
        user_id: user.userId,
        email: user.email || `user_${user.userId.slice(0, 8)}`,
        gender: user.gender as Gender,
        gender_preference: user.genderPreference as Gender[],
        fname: user.fname,
        lname: user.lname,
        areas_of_study: (user.areas_of_study || []) as string[],
        ethnicity: user.ethnicity as "ASIAN" | "BLACK" | "HISPANIC" | "WHITE" | "NATIVE" | "MIDDLE_EASTERN" | "OTHER",
        aiSummary: user.aiSummary || undefined,
        images: (user.images || []) as string[],
        dateOfBirth: user.dateOfBirth,
        yearOfStudy: user.yearOfStudy,
        campus: user.campus || undefined,
        hobbies: (user.hobbies || []).map((h: any) => String(h)),
        musicGenres: (user.musicGenres || []).map((g: any) => String(g)),
        favoriteBands: user.favoriteBands || [],
        schedule: user.schedule,
        features: user.features,
      }));

    // Prepare schedule data for each user (already included)
    const userSchedules = matchingUsers.map((user: any) => ({
      userId: user.user_id,
      scheduleData: user.schedule ? {
        buildings: user.schedule.buildings || [],
        timeSlots: user.schedule.timeSlots || [],
        courses: user.schedule.courses || [],
      } as ScheduleData : undefined,
    }));

    // Calculate compatibility scores and rank matches
    const rankedMatches = matchingUsers.map((user, idx) => {
      const userScheduleData = userSchedules.find(s => s.userId === user.user_id)?.scheduleData;
      
      // Build candidate preferences from their questionnaire data
      const candidateQuestionnaireData = {
        hobbies: (user as any).hobbies || [],
        musicGenres: (user as any).musicGenres || [],
        favoriteBands: (user as any).favoriteBands || [],
        sportsTeams: (user as any).sportsTeams || [],
        personalityTraits: (user as any).personalityTraits || [],
        goingOutFrequency: (user as any).goingOutFrequency || '',
        studyPreference: (user as any).studyPreference || '',
        aboutMe: (user as any).description || '',
      };
      const candidateFeatureScores = extractQuestionnairePreferences(candidateQuestionnaireData);

      const candidatePrefs: UserPreferences = {
        questionnaireFeatureScores: candidateFeatureScores,
        implicitFeatureScores: {},
        implicitConfidenceScore: 0,
        scheduleData: userScheduleData,
        aiSummary: user.aiSummary,
        hobbies: (user as any).hobbies || [],
        musicGenres: (user as any).musicGenres || [],
        favoriteBands: (user as any).favoriteBands || [],
        areasOfStudy: user.areas_of_study || [],
      };

      const compatibilityScore = calculateCompatibilityScore(currentUserPrefs, candidatePrefs);
      
      return {
        ...user,
        compatibilityScore,
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // Generate compatibility summaries for each match
    const matchesWithCompatibility = await Promise.all(
      rankedMatches.slice(0, 20).map(async (match) => {
        try {
          // Generate compatibility summary directly
          const compatibilityData = await generateCompatibilitySummary(
            userId,
            match.user_id
          );
          
          return {
            ...match,
            aiSummary: match.aiSummary, // Explicitly preserve aiSummary
            compatibilitySummary: compatibilityData.summary,
            commonHobbies: compatibilityData.commonHobbies,
            commonInterests: compatibilityData.commonInterests,
            commonMusicGenres: compatibilityData.commonMusicGenres,
            commonBands: compatibilityData.commonBands,
            sameClasses: compatibilityData.sameClasses,
            conversationStarters: compatibilityData.conversationStarters,
          };
        } catch (error) {
          console.error(`Failed to generate compatibility summary for user ${match.user_id}:`, error);
          return match;
        }
      })
    );

    return NextResponse.json({ matches: matchesWithCompatibility });
  } catch (error) {
    console.error("Error fetching matching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
