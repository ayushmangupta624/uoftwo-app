import { NextResponse } from "next/server";
import { generateCompatibilitySummary } from "@/lib/compatibilityGenerator";

export const dynamic = 'force-dynamic';

/**
 * POST /api/compatibility-summary
 * Generate a compatibility summary between two users using OpenAI
 * Request body: { currentUserId: string, matchUserId: string }
 */
export async function POST(request: Request) {
  try {
    const { currentUserId, matchUserId } = await request.json();

    if (!currentUserId || !matchUserId) {
      return NextResponse.json(
        { error: "Both currentUserId and matchUserId are required" },
        { status: 400 }
      );
    }

    const compatibilityData = await generateCompatibilitySummary(
      currentUserId,
      matchUserId
    );

    return NextResponse.json(compatibilityData);

  } catch (error) {
    console.error("Error generating compatibility summary:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate compatibility summary",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
