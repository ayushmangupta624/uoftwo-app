import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentUserId = await getAuthenticatedUserId();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all conversations for the current user
    const conversations = await (prisma as any).conversation.findMany({
      where: {
        OR: [{ user1Id: currentUserId }, { user2Id: currentUserId }],
      },
      include: {
        user1: {
          select: {
            userId: true,
            email: true,
            fname: true,
            lname: true,
            images: true,
          },
        },
        user2: {
          select: {
            userId: true,
            email: true,
            fname: true,
            lname: true,
            images: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: {
                userId: true,
                fname: true,
                lname: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Format conversations with the other user's info
    const formattedConversations = conversations.map((conv: any) => {
      const otherUser =
        conv.user1Id === currentUserId ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[0];

      return {
        id: conv.id,
        otherUser: {
          userId: otherUser.userId,
          email: otherUser.email,
          fname: otherUser.fname,
          lname: otherUser.lname,
          images: (otherUser.images as string[]) || [],
        },
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              senderId: lastMessage.senderId,
              createdAt: lastMessage.createdAt.toISOString(),
            }
          : null,
        updatedAt: conv.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

