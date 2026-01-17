"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Conversation {
  id: string;
  otherUser: {
    userId: string;
    email: string;
    fname: string;
    lname: string;
    images: string[];
  };
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: string;
  } | null;
  updatedAt: string;
}

export function MessageList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/conversations");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch conversations");
        }

        const data = await response.json();
        setConversations(data.conversations || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading conversations...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 py-4">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>
          Your conversations ({conversations.length})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No conversations yet. Like someone to start a conversation!
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="block p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {conv.otherUser.images && conv.otherUser.images[0] ? (
                      <Image
                        src={conv.otherUser.images[0]}
                        alt={`${conv.otherUser.fname} ${conv.otherUser.lname}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        {conv.otherUser.fname[0]}{conv.otherUser.lname[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {conv.otherUser.fname} {conv.otherUser.lname}
                    </div>
                    {conv.lastMessage && (
                      <div className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage.content}
                      </div>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

