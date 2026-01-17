import { NextResponse } from "next/server";
import { Gender } from "@/types/profile";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, getAuthenticatedUserEmail } from "@/lib/db-helpers";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get profile from users table using Prisma
    const profile = await prisma.user.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    // Map Prisma schema to API response format
    const profileData = {
      id: profile.id,
      user_id: profile.userId,
      email: profile.email,
      gender: profile.gender as Gender,
      gender_preference: profile.genderPreference as Gender[],
      fname: profile.fname,
      lname: profile.lname,
      areas_of_study: profile.areas_of_study || [],
      ethnicity: profile.ethnicity,
      images: profile.images || [],
      created_at: profile.createdAt.toISOString(),
      updated_at: profile.updatedAt.toISOString(),
    };

    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    const userEmail = await getAuthenticatedUserEmail();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      gender,
      gender_preference,
      fname,
      lname,
      areas_of_study,
      ethnicity,
      description,
    } = body;

    // Validate input
    const validGenders: Gender[] = ["male", "female", "other", "non-binary"];
    if (!gender || !validGenders.includes(gender)) {
      return NextResponse.json(
        { error: "Invalid gender" },
        { status: 400 }
      );
    }

    if (!Array.isArray(gender_preference) || gender_preference.length === 0) {
      return NextResponse.json(
        { error: "At least one gender preference is required" },
        { status: 400 }
      );
    }

    // Validate that all preferences are valid genders
    const invalidPreferences = gender_preference.filter(
      (pref: Gender) => !validGenders.includes(pref)
    );
    if (invalidPreferences.length > 0) {
      return NextResponse.json(
        { error: "Invalid gender preferences" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!fname || !fname.trim()) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }

    if (!lname || !lname.trim()) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 }
      );
    }

    // Validate ethnicity
    const validEthnicities = [
      "ASIAN",
      "BLACK",
      "HISPANIC",
      "WHITE",
      "NATIVE",
      "MIDDLE_EASTERN",
      "OTHER",
    ];
    if (!ethnicity || !validEthnicities.includes(ethnicity)) {
      return NextResponse.json(
        { error: "Invalid ethnicity" },
        { status: 400 }
      );
    }

    // Generate AI summary if description is provided
    let aiSummary: string | null = null;
    if (description && description.trim()) {
      try {
        // Import and use OpenAI
        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY || "",
        });

        const prompt = `Create a concise, engaging summary (2-3 sentences) of this person based on their description. Focus on their personality, interests, and what makes them unique. Description: ${description.trim()}`;
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        });

        aiSummary = completion.choices[0]?.message?.content || null;
      } catch (error) {
        console.error("Error generating AI summary:", error);
        // Continue without AI summary if LLM fails
      }
    }

    // Upsert user (create or update)
    const profileResult = await (prisma as any).user.upsert({
      where: { userId },
      update: {
        email: userEmail,
        gender: gender,
        genderPreference: gender_preference,
        fname: fname.trim(),
        lname: lname.trim(),
        areas_of_study: areas_of_study || [],
        ethnicity: ethnicity,
        description: description && description.trim() ? description.trim() : "null",
        aiSummary: aiSummary ?? null,
        updatedAt: new Date(),
      },
      create: {
        userId,
        email: userEmail,
        gender: gender,
        genderPreference: gender_preference,
        fname: fname.trim(),
        lname: lname.trim(),
        areas_of_study: areas_of_study || [],
        ethnicity: ethnicity,
        description: description && description.trim() ? description.trim() : "null",
        aiSummary: aiSummary ?? null,
      },
    });

    // Map Prisma schema to API response format
    const profileData = {
      id: profileResult.id,
      user_id: profileResult.userId,
      email: profileResult.email,
      gender: profileResult.gender as Gender,
      gender_preference: profileResult.genderPreference as Gender[],
      fname: profileResult.fname,
      lname: profileResult.lname,
      areas_of_study: profileResult.areas_of_study || [],
      ethnicity: profileResult.ethnicity,
      created_at: profileResult.createdAt.toISOString(),
      updated_at: profileResult.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      profile: profileData,
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
