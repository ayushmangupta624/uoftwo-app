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

    // Get all user IDs that the current user has liked
    const likedUsers = await (prisma as any).userLike.findMany({
      where: { likerId: currentUserId },
      select: { likedId: true },
    });

    const likedUserIds = likedUsers.map((lu: { likedId: string }) => lu.likedId);

    return NextResponse.json({ likedUserIds });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

