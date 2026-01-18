import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const currentUserId = await getAuthenticatedUserId();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Passed user ID is required" },
        { status: 400 }
      );
    }

    // Prevent self-passing
    if (currentUserId === userId) {
      return NextResponse.json(
        { error: "Cannot pass yourself" },
        { status: 400 }
      );
    }

    // Check if already passed
    const existingPass = await (prisma as any).userPass.findUnique({
      where: {
        passerId_passedId: {
          passerId: currentUserId,
          passedId: userId,
        },
      },
    });

    if (existingPass) {
      return NextResponse.json(
        { success: true, alreadyPassed: true },
        { status: 200 }
      );
    }

    // Create the pass
    try {
      await (prisma as any).userPass.create({
        data: {
          passerId: currentUserId,
          passedId: userId,
        },
      });
    } catch (createError: any) {
      // Handle unique constraint violation gracefully (P2002 is Prisma's unique constraint error code)
      if (createError.code === 'P2002') {
        return NextResponse.json(
          { success: true, alreadyPassed: true },
          { status: 200 }
        );
      }
      throw createError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error passing user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}