import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MatchingUsers } from "@/components/matching-users";
import { Suspense, cache } from "react";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

// Cache the Prisma query to avoid duplicate fetches
const getProfile = cache(async (userId: string) => {
  return await prisma.user.findUnique({
    where: { userId },
  });
});

async function ProfileInfo({ userId }: { userId: string }) {
  // Get user profile using Prisma (cached)
  const profile = await getProfile(userId);

  // This should already be checked, but double-check for safety
  if (
    !profile ||
    !profile.gender ||
    !profile.genderPreference ||
    profile.genderPreference.length === 0
  ) {
    return null;
  }

  return (
    <>
      {profile && (
        <div className="mt-4 bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Your profile: {profile.gender} - Looking for:{" "}
          {profile.genderPreference?.join(", ") || "Not set"}
        </div>
      )}
      {profile && (
        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/profile">Edit Profile</Link>
          </Button>
        </div>
      )}
    </>
  );
}

async function DashboardContent() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Check profile for redirect (blocking check)
  const profile = await getProfile(user.id);

  // Redirect to profile completion if profile doesn't exist or is incomplete
  if (
    !profile ||
    !profile.gender ||
    !profile.genderPreference ||
    profile.genderPreference.length === 0 ||
    !profile.fname ||
    !profile.lname
  ) {
    redirect("/profile");
  }

  // Check if user has uploaded all 4 images
  const images = ((profile as any).images as string[]) || [];
  const hasAllImages = images.length === 4 && images.every((img) => img && img.trim() !== "");

  if (!hasAllImages) {
    redirect("/upload-images");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here are users that match your preferences.
        </p>
        <Suspense
          fallback={
            <div className="mt-4 text-sm text-muted-foreground">Loading profile...</div>
          }
        >
          <ProfileInfo userId={user.id} />
        </Suspense>
      </div>

      <div className="w-full">
        <Suspense
          fallback={
            <div className="text-center py-8 text-muted-foreground">
              Loading matches...
            </div>
          }
        >
          <MatchingUsers />
        </Suspense>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
