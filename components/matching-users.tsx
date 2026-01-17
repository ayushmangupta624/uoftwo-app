"use client";

import { useEffect, useState } from "react";
import { MatchingUser } from "@/types/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, Info } from "lucide-react";
import { SwipeableCard } from "@/components/swipeable-card";
import { UserProfileModal } from "@/components/user-profile-modal";

export function MatchingUsers() {
  const [matches, setMatches] = useState<MatchingUser[]>([]);
  const [likedUserIds, setLikedUserIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingUserId, setLikingUserId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewingUser, setViewingUser] = useState<MatchingUser | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch matches and likes in parallel
        const [matchesResponse, likesResponse] = await Promise.all([
          fetch("/api/matching-users"),
          fetch("/api/likes"),
        ]);

        if (!matchesResponse.ok) {
          const errorData = await matchesResponse.json();
          throw new Error(errorData.error || "Failed to fetch matches");
        }

        const matchesData = await matchesResponse.json();
        setMatches(matchesData.matches || []);

        if (likesResponse.ok) {
          const likesData = await likesResponse.json();
          setLikedUserIds(new Set(likesData.likedUserIds || []));
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (userId: string) => {
    if (likingUserId === userId) return;

    setLikingUserId(userId);
    try {
      const response = await fetch(`/api/like/${userId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to like user");
      }

      const data = await response.json();
      
      // Update liked state
      const newLiked = new Set(likedUserIds);
      newLiked.add(userId);
      setLikedUserIds(newLiked);

      // Move to next card
      setCurrentIndex((prev) => Math.min(prev + 1, matches.length - 1));

      // If it's a match, show notification
      if (data.isMatch && data.conversationId) {
        if (confirm("It's a match! Would you like to start messaging?")) {
          window.location.href = `/messages/${data.conversationId}`;
        }
      }
    } catch (error) {
      console.error("Error liking user:", error);
      setError(error instanceof Error ? error.message : "Failed to like user");
    } finally {
      setLikingUserId(null);
    }
  };

  const handlePass = async (userId: string) => {
    try {
      const response = await fetch(`/api/passes/${userId}`, {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to pass user");
      }
      // Move to next card after successful pass
      setCurrentIndex((prev) => Math.min(prev + 1, matches.length - 1));
    } catch (error) {
      console.error("Error passing user:", error);
      setError(error instanceof Error ? error.message : "Failed to pass user");
    }
  };

  const handleSwipeLeft = () => {
    const currentUser = matches[currentIndex];
    if (currentUser) {
      handlePass(currentUser.user_id);
    }
  };

  const handleSwipeRight = () => {
    const currentUser = matches[currentIndex];
    if (currentUser) {
      handleLike(currentUser.user_id);
    }
  };

  const handleViewMore = () => {
    const currentUser = matches[currentIndex];
    if (currentUser) {
      setViewingUser(currentUser);
      setShowProfileModal(true);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Matching Users</CardTitle>
          <CardDescription>Finding users that match your preferences...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Matching Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 py-4">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Matching Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No matching users found. Make sure your profile and preferences are set up correctly.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentIndex >= matches.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Matching Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            You've seen all available matches! Check back later for more.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show up to 3 cards stacked
  const visibleCards = matches.slice(currentIndex, currentIndex + 3);
  const currentUser = matches[currentIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discover</CardTitle>
        <CardDescription>
          Swipe right to like, left to pass ({currentIndex + 1} of {matches.length})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[80vh] w-full max-w-md mx-auto">
          {visibleCards.map((user, idx) => (
            <SwipeableCard
              key={user.id}
              user={user}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onViewMore={handleViewMore}
              isActive={idx === 0}
            />
          ))}

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-30">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-14 h-14 bg-white shadow-lg hover:bg-red-50 hover:border-red-500"
              onClick={() => {
                if (currentUser) {
                  handlePass(currentUser.user_id);
                }
              }}
            >
              <X className="w-6 h-6 text-red-500" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-14 h-14 bg-white shadow-lg hover:bg-blue-50 hover:border-blue-500"
              onClick={handleViewMore}
            >
              <Info className="w-6 h-6 text-blue-500" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-14 h-14 bg-white shadow-lg hover:bg-green-50 hover:border-green-500"
              onClick={handleSwipeRight}
              disabled={likingUserId === currentUser?.user_id}
            >
              <Heart className="w-6 h-6 text-green-500" />
            </Button>
          </div>
        </div>

        <UserProfileModal
          user={viewingUser}
          open={showProfileModal}
          onOpenChange={setShowProfileModal}
        />
      </CardContent>
    </Card>
  );
}
