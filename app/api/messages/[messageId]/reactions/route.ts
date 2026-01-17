import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

export async function POST(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = await params;
    const currentUserId = await getAuthenticatedUserId();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { emoji } = body;

    if (!emoji || !emoji.trim()) {
      return NextResponse.json(
        { error: "Emoji is required" },
        { status: 400 }
      );
    }

    // Verify message exists and user has access
    const message = await (prisma as any).message.findUnique({
      where: { id: messageId },
      include: {
        conversation: true,
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Verify user is part of the conversation
    if (
      message.conversation.user1Id !== currentUserId &&
      message.conversation.user2Id !== currentUserId
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if reaction already exists
    const existingReaction = await (prisma as any).messageReaction.findUnique({
      where: {
        message_user_emoji: {
          messageId,
          userId: currentUserId,
          emoji: emoji.trim(),
        },
      },
    });

    if (existingReaction) {
      // Remove reaction (toggle off)
      await (prisma as any).messageReaction.delete({
        where: { id: existingReaction.id },
      });

      return NextResponse.json({
        success: true,
        removed: true,
      });
    }

    // Create reaction
    const reaction = await (prisma as any).messageReaction.create({
      data: {
        messageId,
        userId: currentUserId,
        emoji: emoji.trim(),
      },
      include: {
        user: {
          select: {
            userId: true,
            fname: true,
            lname: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      reaction: {
        id: reaction.id,
        emoji: reaction.emoji,
        userId: reaction.userId,
        userName: `${reaction.user.fname} ${reaction.user.lname}`,
      },
    });
  } catch (error) {
    console.error("Error adding reaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

