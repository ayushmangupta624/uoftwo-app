import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ messageId: string }> }
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
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Reply content is required" },
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

    // Create reply
    const reply = await (prisma as any).messageReply.create({
      data: {
        messageId,
        senderId: currentUserId,
        content: content.trim(),
      },
      include: {
        sender: {
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
      reply: {
        id: reply.id,
        content: reply.content,
        senderId: reply.senderId,
        senderName: `${reply.sender.fname} ${reply.sender.lname}`,
        createdAt: reply.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

