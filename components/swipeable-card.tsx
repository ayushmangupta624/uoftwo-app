"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { MatchingUser } from "@/types/profile";

interface SwipeableCardProps {
  user: MatchingUser;
  onSwipeLeft: (userId: string) => void;
  onSwipeRight: (userId: string) => void;
  onViewMore: (user: MatchingUser) => void;
  isActive: boolean;
}

export function SwipeableCard({
  user,
  onSwipeLeft,
  onSwipeRight,
  onViewMore,
  isActive,
}: SwipeableCardProps) {
  const imageUrl = user.images?.[0] || "/placeholder-profile.png";

  return (
    <Card
      className={`absolute inset-0 transition-all duration-300 ${
        isActive ? "z-20 scale-100" : "z-10 scale-95 opacity-0 pointer-events-none"
      }`}
    >
      <CardContent className="p-0 h-full relative">
        {/* Profile Image */}
        <div
          className="w-full h-2/3 bg-cover bg-center rounded-t-lg"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        {/* User Info */}
        <div className="p-6 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {user.fname} {user.lname}
              </h3>
              <p className="text-muted-foreground">
                {user.yearOfStudy && `Year ${user.yearOfStudy}`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => onViewMore(user)}
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>

          {user.aiSummary && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {user.aiSummary}
            </p>
          )}

          {user.areas_of_study && user.areas_of_study.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {user.areas_of_study.slice(0, 3).map((area, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                >
                  {area}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
