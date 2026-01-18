import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MatchingUsers } from "@/app/dashboard/MatchingUsers/MatchingUsers";
import { Suspense, cache } from "react";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

const getProfile = cache(async (userId: string) => {
  return await prisma.user.findUnique({
    where: { userId },
  });
});

async function ProfileInfo({ userId }: { userId: string }) {
  const profile = await getProfile(userId);

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
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

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
  const hasAllImages =
    images.length === 4 && images.every((img) => img && img.trim() !== "");

  if (!hasAllImages) {
    redirect("/upload-images");
  }

  return (
    <div className="flex-1 w-full flex flex-col">
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
