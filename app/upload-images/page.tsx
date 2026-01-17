import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ImageUpload } from "@/components/image-upload";
import { prisma } from "@/lib/prisma";
import { Suspense, cache } from "react";

// Cache the Prisma query to avoid duplicate fetches


const getProfile = cache(async (userId: string) => {
  return await prisma.user.findUnique({
    where: { userId },
  });
});

async function UploadImagesContent() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Check if user has completed profile
  const profile = await getProfile(user.id);

  if (!profile || !profile.fname || !profile.lname) {
    redirect("/profile");
  }

  // Check if user already has 4 images
  const images = ((profile as any).images as string[]) || [];
  const hasAllImages = images.length === 4 && images.every((img) => img && img.trim() !== "");

  if (hasAllImages) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="w-full max-w-3xl mx-auto">
        <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading...</div>}>
          <ImageUpload initialImages={images} />
        </Suspense>
      </div>
    </div>
  );
}

export default function UploadImagesPage() {
  return <UploadImagesContent />;
}

