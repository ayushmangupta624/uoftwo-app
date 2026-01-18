import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

export async function GET() {
  try {
    const currentUserId = await getAuthenticatedUserId();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all users that the current user has liked
    const likedUsers = await (prisma as any).userLike.findMany({
      where: { likerId: currentUserId },
      include: {
        liked: {
          select: {
            userId: true,
            email: true,
            fname: true,
            lname: true,
            images: true,
          },
        },
      },
    });

    // Get all users that have liked the current user
    const likedByUsers = await (prisma as any).userLike.findMany({
      where: { likedId: currentUserId },
      include: {
        liker: {
          select: {
            userId: true,
            email: true,
            fname: true,
            lname: true,
            images: true,
          },
        },
      },
    });

    // Find mutual likes (matches)
    const likedUserIds = new Set(likedUsers.map((lu: any) => lu.likedId));
    const matches = likedByUsers
      .filter((lbu: any) => likedUserIds.has(lbu.likerId))
      .map((lbu: any) => ({
        userId: lbu.liker.userId,
        email: lbu.liker.email,
        fname: lbu.liker.fname,
        lname: lbu.liker.lname,
        images: (lbu.liker.images as string[]) || [],
      }));

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

