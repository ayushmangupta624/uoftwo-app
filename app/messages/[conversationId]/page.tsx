import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageChat } from "@/components/message-chat";
import { prisma } from "@/lib/prisma";
import { Suspense, cache } from "react";

// Cache the Prisma query
const getConversation = cache(async (conversationId: string) => {
  return await (prisma as any).conversation.findUnique({
    where: { id: conversationId },
    include: {
      user1: {
        select: {
          userId: true,
          fname: true,
          lname: true,
          images: true,
        },
      },
      user2: {
        select: {
          userId: true,
          fname: true,
          lname: true,
          images: true,
        },
      },
    },
  });
});

async function ConversationContent({
  conversationId,
}: {
  conversationId: string;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const conversation = await getConversation(conversationId);

  if (!conversation) {
    redirect("/messages");
  }

  // Verify user is part of the conversation
  if (
    conversation.user1Id !== user.id &&
    conversation.user2Id !== user.id
  ) {
    redirect("/messages");
  }

  // Determine the other user
  const otherUser =
    conversation.user1Id === user.id ? conversation.user2 : conversation.user1;

  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="h-[calc(100vh-200px)]">
        <Suspense fallback={<div className="text-center py-8">Loading chat...</div>}>
          <MessageChat
            conversationId={conversationId}
            currentUserId={user.id}
            otherUser={{
              userId: otherUser.userId,
              fname: otherUser.fname,
              lname: otherUser.lname,
              images: (otherUser.images as string[]) || [],
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default async function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const { conversationId } = await params;
  return <ConversationContent conversationId={conversationId} />;
}

