import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

type Params = { conversationId: string };

export async function GET(
  request: NextRequest,
  { params }: { params: Params | Promise<Params> }
) {
  try {
    const { conversationId } = await Promise.resolve(params);
    const currentUserId = await getAuthenticatedUserId();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify user is part of the conversation
    const conversation = await (prisma as any).conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (
      conversation.user1Id !== currentUserId &&
      conversation.user2Id !== currentUserId
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get all messages in the conversation
    const messages = await (prisma as any).message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            userId: true,
            fname: true,
            lname: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                userId: true,
                fname: true,
                lname: true,
              },
            },
          },
        },
        replies: {
          include: {
            sender: {
              select: {
                userId: true,
                fname: true,
                lname: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      senderName: `${msg.sender.fname} ${msg.sender.lname}`,
      createdAt: msg.createdAt.toISOString(),
      reactions: msg.reactions.map((r: any) => ({
        id: r.id,
        emoji: r.emoji,
        userId: r.userId,
        userName: `${r.user.fname} ${r.user.lname}`,
      })),
      replies: msg.replies.map((reply: any) => ({
        id: reply.id,
        content: reply.content,
        senderId: reply.senderId,
        senderName: `${reply.sender.fname} ${reply.sender.lname}`,
        createdAt: reply.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params | Promise<Params> }
) {
  try {
    const { conversationId } = await Promise.resolve(params);
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
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Verify user is part of the conversation
    const conversation = await (prisma as any).conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (
      conversation.user1Id !== currentUserId &&
      conversation.user2Id !== currentUserId
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Create message and update conversation timestamp
    const [message] = await Promise.all([
      (prisma as any).message.create({
        data: {
          conversationId,
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
      }),
      (prisma as any).conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        senderName: `${message.sender.fname} ${message.sender.lname}`,
        createdAt: message.createdAt.toISOString(),
        reactions: [],
        replies: [],
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

