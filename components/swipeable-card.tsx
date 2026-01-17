"use client";

import { useState, useRef, useEffect } from "react";
import { MatchingUser } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Heart, Info, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface SwipeableCardProps {
  user: MatchingUser;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onViewMore: () => void;
  isActive: boolean;
}

export function SwipeableCard({
  user,
  onSwipeLeft,
  onSwipeRight,
  onViewMore,
  isActive,
}: SwipeableCardProps) {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const images = user.images || [];

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive) return;
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isActive || !isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isActive) return;
    setIsDragging(false);
    const threshold = 100;
    
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive || !isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isActive) return;
    setIsDragging(false);
    const threshold = 100;
    
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        setDragOffset({ x: deltaX, y: deltaY });
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        const threshold = 100;
        
        if (Math.abs(dragOffset.x) > threshold) {
          if (dragOffset.x > 0) {
            onSwipeRight();
          } else {
            onSwipeLeft();
          }
        }
        
        setDragOffset({ x: 0, y: 0 });
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, dragOffset, onSwipeLeft, onSwipeRight]);

  const rotation = dragOffset.x * 0.1;
  const opacity = 1 - Math.abs(dragOffset.x) / 300;

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
    <div
      ref={cardRef}
      className={`absolute inset-0 transition-transform duration-200 ${
        isActive ? "z-10" : "z-0"
      }`}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity: isActive ? opacity : 0.5,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Card className="h-full w-full overflow-hidden">
        <div className="relative h-[70vh] w-full bg-muted">
          {images.length > 0 && images[currentImageIndex] && images[currentImageIndex].trim() ? (
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
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold">
                {user.fname && user.lname
                  ? `${user.fname} ${user.lname}`
                  : user.email}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{user.gender}</Badge>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Interested in:</p>
            <div className="flex flex-wrap gap-1">
              {user.gender_preference.map((pref) => (
                <Badge key={pref} variant="secondary" className="text-xs">
                  {pref}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

