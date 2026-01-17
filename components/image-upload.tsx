"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { X, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  initialImages?: string[];
}

export function ImageUpload({ initialImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(() => {
    // Initialize with 4 empty slots
    const slots = Array(4).fill("");
    initialImages.forEach((img, index) => {
      if (index < 4 && img && img.trim() !== "") {
        slots[index] = img;
      }
    });
    return slots;
  });
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Initialize refs array
    fileInputRefs.current = fileInputRefs.current.slice(0, 4);
  }, []);

  const handleFileSelect = async (index: number, file: File | null) => {
    if (!file) return;

    setError(null);
    setUploading(index);

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      setUploading(null);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size too large. Maximum size is 5MB.");
      setUploading(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("index", index.toString());

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      const updatedImages = [...images];
      updatedImages[index] = data.url;
      setImages(updatedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = async (index: number) => {
    if (!images[index]) return;

    try {
      setError(null);
      const response = await fetch(`/api/upload-image?index=${index}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove image");
      }

      const updatedImages = [...images];
      updatedImages[index] = "";
      setImages(updatedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove image");
    }
  };

  const handleContinue = () => {
    const hasAllImages = images.length === 4 && images.every((img) => img && img.trim() !== "");

    if (!hasAllImages) {
      setError("Please upload all 4 images before continuing.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const allImagesUploaded = images.length === 4 && images.every((img) => img && img.trim() !== "");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Upload Your Photos</CardTitle>
        <CardDescription>
          Please upload exactly 4 images. You can click on any image slot to upload or replace an image.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "relative aspect-[3/4] rounded-lg border-2 border-dashed overflow-hidden",
                  images[index]
                    ? "border-solid border-primary"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
              >
                {images[index] ? (
                  <>
                    <img
                      src={images[index]}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 transition-colors"
                      disabled={uploading === index}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {images[index] && (
                      <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </>
                ) : (
                  <label
                    htmlFor={`image-upload-${index}`}
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-accent transition-colors"
                  >
                    <input
                      ref={(el) => {
                        fileInputRefs.current[index] = el;
                      }}
                      id={`image-upload-${index}`}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          handleFileSelect(index, file);
                        }
                      }}
                      disabled={uploading === index}
                    />
                    {uploading === index ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload</span>
                        <span className="text-xs text-muted-foreground">Image {index + 1}</span>
                      </div>
                    )}
                  </label>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {allImagesUploaded && (
            <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-3 rounded-md text-sm">
              All images uploaded! Click continue to proceed to your dashboard.
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/profile")}
            >
              Back to Profile
            </Button>
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!allImagesUploaded || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Processing..." : "Continue to Dashboard"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Images must be in JPEG, PNG, or WebP format and less than 5MB each.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

