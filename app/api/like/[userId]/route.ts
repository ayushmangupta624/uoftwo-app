import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const thisUserId = await getAuthenticatedUserId();
    if (!thisUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Liked user ID is required" }, { status: 400 });
    }

    // Prevent self-liking
    if (thisUserId === userId) {
      return NextResponse.json(
        { error: "Cannot like yourself" },
        { status: 400 }
      );
    }

    // Try to create the like, handle duplicate gracefully
    try {
      await (prisma as any).userLike.create({
        data: {
          likerId: thisUserId,
          likedId: userId,
        },
      });
    } catch (error: any) {
      // P2002 is the Prisma error code for unique constraint violation
      // If the like already exists, that's fine - just continue
      if (error.code !== 'P2002') {
        throw error;
      }
    }

    // Check if it's a mutual like (match)
    const mutualLike = await (prisma as any).userLike.findUnique({
      where: {
        likerId_likedId: {
          likerId: userId,
          likedId: thisUserId,
        },
      },
    });

    // If mutual like, create or get conversation
    let conversationId = null;
    if (mutualLike) {
      // Find existing conversation
      const existingConv = await (prisma as any).conversation.findFirst({
        where: {
          OR: [
            { user1Id: thisUserId, user2Id: userId },
            { user1Id: userId, user2Id: thisUserId },
          ],
        },
      });

      if (existingConv) {
        conversationId = existingConv.id;
      } else {
        // Create new conversation (always store with smaller userId first for consistency)
        const [user1Id, user2Id] =
          thisUserId < userId ? [thisUserId, userId] : [userId, thisUserId];

        const newConv = await (prisma as any).conversation.create({
          data: {
            user1Id,
            user2Id,
          },
        });
        conversationId = newConv.id;
      }
    }

    return NextResponse.json({
      success: true,
      isMatch: !!mutualLike,
      conversationId,
    });
  } catch (error) {
    console.error("Error liking user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}