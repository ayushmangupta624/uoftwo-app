import { NextResponse } from "next/server";
import { UserProfile, MatchingUser, Gender } from "@/types/profile";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";
import { calculateCompatibilityScore, UserPreferences, ScheduleData } from "@/lib/matchingAlgorithm";
import { calculateImplicitPreferences, extractQuestionnairePreferences } from "@/lib/preferenceCalculator";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the current user's profile
    const currentProfile = await prisma.user.findUnique({
      where: { userId },
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

    // Get current user's schedule and profile views for smart matching
    const [currentSchedule, currentProfileViews] = await Promise.all([
      prismaAny.schedule?.findUnique({
        where: { userId },
      }).catch(() => null),
      prismaAny.profileView?.findMany({
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
      }).catch(() => []),
    ]);

    // Calculate implicit preferences from viewing behavior
    const implicitPrefs = calculateImplicitPreferences(currentProfileViews || []);

    // Extract explicit preferences from questionnaire (would come from user's questionnaire data)
    // For now, using placeholder - this should pull from actual questionnaire data
    const questionnaireFeatures = {}; // extractQuestionnairePreferences(questionnaireData);

    // Build current user preferences
    const currentUserScheduleData: ScheduleData | undefined = currentSchedule ? {
      buildings: currentSchedule.buildings || [],
      timeSlots: currentSchedule.timeSlots || [],
      courses: currentSchedule.courses || [],
    } : undefined;

    const currentUserPrefs: UserPreferences = {
      questionnaireFeatureScores: questionnaireFeatures,
      implicitFeatureScores: implicitPrefs.featureScores,
      implicitConfidenceScore: implicitPrefs.confidenceScore,
      scheduleData: currentUserScheduleData,
      aiSummary: currentProfile.aiSummary || undefined,
    };

    // Find all users except current user
    const allUsers = await prisma.user.findMany({
      where: {
        userId: {
          not: userId,
        },
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
        fname: (user as any).fname,
        lname: (user as any).lname,
        areas_of_study: ((user as any).areas_of_study || []) as string[],
        ethnicity: (user as any).ethnicity as "ASIAN" | "BLACK" | "HISPANIC" | "WHITE" | "NATIVE" | "MIDDLE_EASTERN" | "OTHER",
        aiSummary: (user as any).aiSummary || undefined,
        images: ((user as any).images || []) as string[],
        dateOfBirth: (user as any).dateOfBirth,
        yearOfStudy: (user as any).yearOfStudy,
      }));

    // Get schedules for all matching users
    const userSchedules = await Promise.all(
      matchingUsers.map(async (user) => {
        const schedule = await prismaAny.schedule?.findUnique({
          where: { userId: user.user_id },
        }).catch(() => null);
        
        return {
          userId: user.user_id,
          scheduleData: schedule ? {
            buildings: schedule.buildings || [],
            timeSlots: schedule.timeSlots || [],
            courses: schedule.courses || [],
          } as ScheduleData : undefined,
        };
      })
    );

    // Calculate compatibility scores and rank matches
    const rankedMatches = matchingUsers.map((user, idx) => {
      const userScheduleData = userSchedules.find(s => s.userId === user.user_id)?.scheduleData;
      
      // Build candidate preferences
      // In production, you'd fetch their features from the database
      const userFeatures = (user as any).features || [];
      const featureScores: Record<string, number> = {};
      if (Array.isArray(userFeatures)) {
        userFeatures.forEach((f: any) => {
          featureScores[f.name] = f.score;
        });
      }

      const candidatePrefs: UserPreferences = {
        questionnaireFeatureScores: featureScores,
        implicitFeatureScores: {},
        implicitConfidenceScore: 0,
        scheduleData: userScheduleData,
        aiSummary: user.aiSummary,
      };

      const compatibilityScore = calculateCompatibilityScore(currentUserPrefs, candidatePrefs);
      
      return {
        ...user,
        compatibilityScore,
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return NextResponse.json({ matches: rankedMatches });
  } catch (error) {
    console.error("Error fetching matching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
