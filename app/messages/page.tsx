import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageList } from "@/components/message-list";
import { Suspense } from "react";

async function MessagesPageContent() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Your conversations with matches
        </p>
      </div>

      <div className="w-full">
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <MessageList />
        </Suspense>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return <MessagesPageContent />;
}

