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

          {/* Profile Info */}
          <div className="space-y-3">
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


