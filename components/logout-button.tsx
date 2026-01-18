"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Force a full page reload to clear all state and cached data
    window.location.href = "/auth/login";
  };

  return <Button onClick={logout}>Logout</Button>;
}
