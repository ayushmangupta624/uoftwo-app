import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { UserProfile } from "@/types/profile";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

// Cache the Prisma query to avoid duplicate fetches
const getProfile = cache(async (userId: string) => {
  return await prisma.user.findUnique({
    where: { userId },
  });
});

async function ProfileFormWrapper({ userId }: { userId: string }) {
  // Get existing profile using Prisma (cached)
  const profile = await getProfile(userId);

  // Map Prisma schema to UserProfile format
  const existingProfile: UserProfile | null = profile
    ? {
        id: profile.id,
        user_id: profile.userId,
        email: profile.email || undefined,
        gender: profile.gender as "male" | "female" | "other" | "non-binary",
        gender_preference: profile.genderPreference as Array<"male" | "female" | "other" | "non-binary">,
        fname: (profile as any).fname,
        lname: (profile as any).lname,
        areas_of_study: ((profile as any).areas_of_study || []) as string[],
        ethnicity: (profile as any).ethnicity as "ASIAN" | "BLACK" | "HISPANIC" | "WHITE" | "NATIVE" | "MIDDLE_EASTERN" | "OTHER",
        images: profile.images || [],
        description: (profile as any).description && (profile as any).description !== "null" ? (profile as any).description : undefined,
        created_at: profile.createdAt.toISOString(),
        updated_at: profile.updatedAt.toISOString(),
      }
    : null;

  return <ProfileForm initialProfile={existingProfile} />;
}

async function ProfilePageContent() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <ProfileFormWrapper userId={user.id} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfilePageContent />;
}
