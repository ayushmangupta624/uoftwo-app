import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

export async function POST(request: Request) {
  try {
    const currentUserId = await getAuthenticatedUserId();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { otherUserId } = body;

    if (!otherUserId) {
      return NextResponse.json(
        { error: "Other user ID is required" },
        { status: 400 }
      );
    }

    // Check if users have mutual likes
    const [like1, like2] = await Promise.all([
      (prisma as any).userLike.findUnique({
        where: {
          likerId_likedId: {
            likerId: currentUserId,
            likedId: otherUserId,
          },
        },
      }),
      (prisma as any).userLike.findUnique({
        where: {
          likerId_likedId: {
            likerId: otherUserId,
            likedId: currentUserId,
          },
        },
      }),
    ]);

    if (!like1 || !like2) {
      return NextResponse.json(
        { error: "Users must have mutual likes to start a conversation" },
        { status: 403 }
      );
    }

    // Check if conversation already exists
    const existingConv = await (prisma as any).conversation.findFirst({
      where: {
        OR: [
          { user1Id: currentUserId, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: currentUserId },
        ],
      },
    });

    if (existingConv) {
      return NextResponse.json({
        success: true,
        conversationId: existingConv.id,
      });
    }

    // Create new conversation (always store with smaller userId first for consistency)
    const [user1Id, user2Id] =
      currentUserId < otherUserId
        ? [currentUserId, otherUserId]
        : [otherUserId, currentUserId];

    const conversation = await (prisma as any).conversation.create({
      data: {
        user1Id,
        user2Id,
      },
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

