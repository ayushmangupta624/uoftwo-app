"use client";

import { MatchingUser } from "@/types/profile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface UserProfileModalProps {
  user: MatchingUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileModal({
  user,
  open,
  onOpenChange,
}: UserProfileModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = user?.images || [];

  if (!user) return null;

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user.fname && user.lname
              ? `${user.fname} ${user.lname}`
              : user.email}
          </DialogTitle>
          <DialogDescription>
            {user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Images */}
          {images.length > 0 && images[currentImageIndex] && images[currentImageIndex].trim() && (
            <div className="relative h-96 w-full bg-muted rounded-lg overflow-hidden">
              {images[currentImageIndex].startsWith("http") && 
               images[currentImageIndex].includes("supabase.co") ? (
                <Image
                  src={images[currentImageIndex]}
                  alt={`${user.fname || user.email}`}
                  fill
                  className="object-cover"
                  unoptimized={false}
                />
              ) : (
                <img
                  src={images[currentImageIndex]}
                  alt={`${user.fname || user.email}`}
                  className="w-full h-full object-cover"
                />
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                    {images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "w-8 bg-white"
                            : "w-2 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Compatibility Summary */}
          {user.compatibilitySummary && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400">✨</span>
                  Why You Might Click
                </h3>
                {user.compatibilityScore !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {user.compatibilityScore}%
                    </span>
                    <span className="text-xs text-muted-foreground">Match</span>
                  </div>
                )}
              </div>
              <p className="text-sm leading-relaxed">{user.compatibilitySummary}</p>
            </div>
          )}

          {/* Common Interests & Hobbies */}
          {(user.commonHobbies && user.commonHobbies.length > 0) || 
           (user.commonMusicGenres && user.commonMusicGenres.length > 0) ||
           (user.commonBands && user.commonBands.length > 0) ||
           (user.sameClasses && user.sameClasses.length > 0) ||
           (user.commonInterests && user.commonInterests.length > 0) ? (
            <div className="space-y-3">
              {user.commonHobbies && user.commonHobbies.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span>🎯</span>
                    Common Hobbies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.commonHobbies.map((hobby, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {user.commonMusicGenres && user.commonMusicGenres.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span>🎵</span>
                    Common Music Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.commonMusicGenres.map((genre, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {user.commonBands && user.commonBands.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span>🎸</span>
                    Common Artists/Bands
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.commonBands.map((band, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {band}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {user.sameClasses && user.sameClasses.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span>📚</span>
                    Same Classes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.sameClasses.map((classCode, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        {classCode}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {user.commonInterests && user.commonInterests.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span>💡</span>
                    Common Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.commonInterests.map((interest, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Profile Info */}
          <div className="space-y-3">
            {user.campus && user.campus !== "null" && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span>🏫</span>
                  Campus
                </h3>
                <Badge variant="outline" className="text-base">
                  {user.campus}
                </Badge>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Gender</h3>
              <Badge variant="outline">{user.gender}</Badge>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Interested In</h3>
              <div className="flex flex-wrap gap-2">
                {user.gender_preference.map((pref) => (
                  <Badge key={pref} variant="secondary">
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>

            {user.areas_of_study && user.areas_of_study.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Areas of Study</h3>
                <div className="flex flex-wrap gap-2">
                  {user.areas_of_study.map((area, idx) => (
                    <Badge key={idx} variant="outline">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {user.ethnicity && (
              <div>
                <h3 className="font-semibold mb-2">Ethnicity</h3>
                <Badge variant="outline">{user.ethnicity}</Badge>
              </div>
            )}

            {user.aiSummary && (
              <div>
                <h3 className="font-semibold mb-2">AI Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{user.aiSummary}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


