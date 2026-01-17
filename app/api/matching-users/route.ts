import { NextResponse } from "next/server";
import { UserProfile, MatchingUser, Gender } from "@/types/profile";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

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

    // Find all users except current user
    const allUsers = await prisma.user.findMany({
      where: {
        userId: {
          not: userId,
        },
      },
    });

    // Filter users based on mutual matching:
    // 1. Their gender must be in current user's preferences
    // 2. Current user's gender must be in their preferences
    const matchingUsers: MatchingUser[] = allUsers
      .filter((user) => {
        const profileGender = user.gender as Gender;
        const profilePreferences = user.genderPreference as Gender[];

        // Check if profile's gender is in current user's preferences
        const matchesCurrentUserPreference =
          currentUserProfile.gender_preference.includes(profileGender);

        // Check if current user's gender is in profile's preferences
        const currentUserGenderMatches =
          profilePreferences.includes(currentUserProfile.gender);

        return matchesCurrentUserPreference && currentUserGenderMatches;
      })
      .map((user) => ({
        id: user.id,
        user_id: user.userId,
        email: user.email || `user_${user.userId.slice(0, 8)}`,
        gender: user.gender as Gender,
        gender_preference: user.genderPreference as Gender[],
        fname: (user as any).fname,
        lname: (user as any).lname,
        areas_of_study: ((user as any).areas_of_study || []) as string[],
        ethnicity: (user as any).ethnicity as "ASIAN" | "BLACK" | "HISPANIC" | "WHITE" | "NATIVE" | "MIDDLE_EASTERN" | "OTHER",
      }));

    return NextResponse.json({ matches: matchingUsers });
  } catch (error) {
    console.error("Error fetching matching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
