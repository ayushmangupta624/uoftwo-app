import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      viewedProfileId,
      duration,
      scrollDepth,
      interacted,
      interactionType,
    } = body;

    if (!viewedProfileId) {
      return NextResponse.json(
        { error: "viewedProfileId is required" },
        { status: 400 }
      );
    }

    // Don't track self-views
    if (userId === viewedProfileId) {
      return NextResponse.json({ success: true, message: "Self-view not tracked" });
    }

    // Create profile view record
    const profileView = await prisma.profileView.create({
      data: {
        viewerId: userId,
        viewedProfileId,
        duration: duration || 0,
        scrollDepth: scrollDepth || 0.0,
        interacted: interacted || false,
        interactionType: interactionType || null,
      },
    });

    return NextResponse.json({
      success: true,
      profileView: {
        id: profileView.id,
        viewedAt: profileView.viewedAt,
      },
    });
  } catch (error) {
    console.error("Error tracking profile view:", error);
    return NextResponse.json(
      { error: "Failed to track profile view" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'viewer' or 'viewed'

    let profileViews;

    if (type === 'viewed') {
      // Get who viewed this user's profile
      profileViews = await prisma.profileView.findMany({
        where: { viewedProfileId: userId },
        include: {
          viewer: {
            select: {
              userId: true,
              fname: true,
              lname: true,
              images: true,
            },
          },
        },
        orderBy: { viewedAt: 'desc' },
        take: 50,
      });
    } else {
      // Get this user's viewing history
      profileViews = await prisma.profileView.findMany({
        where: { viewerId: userId },
        include: {
          viewedProfile: {
            select: {
              userId: true,
              fname: true,
              lname: true,
              images: true,
              campus: true,
              description: true,
            },
          },
        },
        orderBy: { viewedAt: 'desc' },
        take: 100,
      });
    }

    return NextResponse.json({ profileViews });
  } catch (error) {
    console.error("Error fetching profile views:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
