import { createClient } from "@/lib/supabase/server";

/**
 * Get the authenticated user's ID from Supabase auth
 * This is still needed for authentication, Drizzle is only for database queries
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}

/**
 * Get the authenticated user's email
 */
export async function getAuthenticatedUserEmail(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.email || null;
}

