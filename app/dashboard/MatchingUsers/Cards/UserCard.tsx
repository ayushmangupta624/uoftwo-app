"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MatchingUser } from "@/types/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface UserCardProps {
  user: MatchingUser;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onViewMore: () => void;
  isActive: boolean;
}

export function UserCard({
  user,
  onSwipeLeft,
  onSwipeRight,
  onViewMore,
  isActive,
}: UserCardProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const images = user.images || [];
  const SWIPE_THRESHOLD = 100;

  const completeSwipe = useCallback(
    (deltaX: number) => {
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        setIsTransitioning(true);
        // Animate the card off screen
        setDragOffset({ x: deltaX > 0 ? 1000 : -1000, y: 0 });

        setTimeout(() => {
          if (deltaX > 0) {
            onSwipeRight();
          } else {
            onSwipeLeft();
          }
          setDragOffset({ x: 0, y: 0 });
          setIsTransitioning(false);
        }, 300);
      } else {
        // Snap back to original position
        setDragOffset({ x: 0, y: 0 });
      }
    },
    [onSwipeLeft, onSwipeRight],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive || isTransitioning) return;
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isActive || !isDragging || isTransitioning) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY * 0.5 }); // Less vertical movement
  };

  const handleTouchEnd = () => {
    if (!isActive || isTransitioning) return;
    setIsDragging(false);
    completeSwipe(dragOffset.x);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive || isTransitioning) return;
    e.preventDefault();
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if we didn't drag (click without moving)
    if (!isActive || Math.abs(dragOffset.x) > 5 || Math.abs(dragOffset.y) > 5)
      return;
    onViewMore();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive || isTransitioning) return;
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setDragOffset({ x: deltaX, y: deltaY * 0.5 }); // Less vertical movement
    };

    const handleMouseUp = () => {
      if (!isActive || isTransitioning) return;
      setIsDragging(false);
      completeSwipe(dragOffset.x);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isActive, dragOffset.x, completeSwipe, isTransitioning]);

  const rotation = dragOffset.x * 0.15;
  const opacity = Math.max(0.5, 1 - Math.abs(dragOffset.x) / 400);

  // Calculate overlay opacity based on drag distance
  const likeOpacity = Math.min(Math.max(dragOffset.x / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragOffset.x / SWIPE_THRESHOLD, 0), 1);

  // Calculate age from date of birth
  const calculateAge = (
    dateOfBirth: string | Date | undefined,
  ): number | null => {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(user.dateOfBirth);

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 ${
        isDragging || isTransitioning
          ? ""
          : "transition-all duration-300 ease-out"
      } ${isActive ? "z-10" : "z-0"}`}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity: isActive ? opacity : 0.5,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <Card className="h-full w-full overflow-hidden relative">
        <div className="relative h-[70vh] w-full bg-muted">
          {/* Full card green overlay for like */}
          <div
            className="absolute inset-0 bg-green-500 pointer-events-none"
            style={{ opacity: likeOpacity * 0.5, zIndex: 30 }}
          />

          {/* Full card red overlay for dislike */}
          <div
            className="absolute inset-0 bg-red-500 pointer-events-none"
            style={{ opacity: nopeOpacity * 0.5, zIndex: 30 }}
          />

          {/* Like icon overlay */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            style={{ opacity: likeOpacity }}
          >
            <div className="bg-white rounded-full p-6 shadow-2xl border-8 border-green-500 transform rotate-[-15deg]">
              <Heart className="w-24 h-24 text-green-500 fill-green-500 stroke-[2.5]" />
            </div>
          </div>

          {/* Nope icon overlay */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            style={{ opacity: nopeOpacity }}
          >
            <div className="bg-white rounded-full p-6 shadow-2xl border-8 border-red-500 transform rotate-[15deg]">
              <X className="w-24 h-24 text-red-500 stroke-[4]" />
            </div>
          </div>

          {images.length > 0 &&
          images[currentImageIndex] &&
          images[currentImageIndex].trim() ? (
            <>
              {images[currentImageIndex].startsWith("http") &&
              images[currentImageIndex].includes("supabase.co") ? (
                <Image
                  src={images[currentImageIndex]}
                  alt={`${user.fname || user.email}`}
                  fill
                  className="object-cover"
                  priority
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

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                    {images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "w-6 bg-white"
                            : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">
              {user.fname?.[0] || user.email[0]}
              {user.lname?.[0] || ""}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between ">
            <div>
              <h3 className="text-xl font-bold">
                {user.fname && user.lname
                  ? `${user.fname} ${user.lname}`
                  : user.email}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                {age && <span>{age} years old</span>}
                {age && user.yearOfStudy && <span>•</span>}
                {user.yearOfStudy && <span>Year {user.yearOfStudy}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
