"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Smile, Reply, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: string;
  reactions: {
    id: string;
    emoji: string;
    userId: string;
    userName: string;
  }[];
  replies: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
  }[];
}

interface MessageChatProps {
  conversationId: string;
  currentUserId: string;
  otherUser: {
    userId: string;
    fname: string;
    lname: string;
    images: string[];
  };
}

const EMOJI_OPTIONS = ["❤️", "👍", "😊", "😂", "😮", "😢", "🔥"];

export function MessageChat({
  conversationId,
  currentUserId,
  otherUser,
}: MessageChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessages(data.messages || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      setMessages([...messages, data.message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyingTo || !replyContent.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/messages/${replyingTo.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent }),
      });

      if (!response.ok) throw new Error("Failed to send reply");

      const data = await response.json();
      // Update the message with the new reply
      setMessages(
        messages.map((msg) =>
          msg.id === replyingTo.id
            ? { ...msg, replies: [...msg.replies, data.reply] }
            : msg
        )
      );
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });

      if (!response.ok) throw new Error("Failed to add reaction");

      const data = await response.json();
      
      // Update message reactions - refetch to get accurate state
      await fetchMessages();
      setShowEmojiPicker(null);
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
          {otherUser.images && otherUser.images[0] ? (
            <Image
              src={otherUser.images[0]}
              alt={`${otherUser.fname} ${otherUser.lname}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              {otherUser.fname[0]}{otherUser.lname[0]}
            </div>
          )}
        </div>
        <div>
          <div className="font-semibold">
            {otherUser.fname} {otherUser.lname}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId;
          const messageReactions = message.reactions.reduce((acc, r) => {
            if (!acc[r.emoji]) {
              acc[r.emoji] = [];
            }
            acc[r.emoji].push(r.userName);
            return acc;
          }, {} as Record<string, string[]>);

          return (
            <div
              key={message.id}
              className={cn(
                "flex flex-col gap-1",
                isOwn ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-4 py-2",
                  isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <div className="text-sm font-medium mb-1">
                  {isOwn ? "You" : message.senderName}
                </div>
                <div>{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>

                {/* Replies */}
                {message.replies.length > 0 && (
                  <div className="mt-2 space-y-1 border-t pt-2">
                    {message.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={cn(
                          "text-sm p-2 rounded",
                          reply.senderId === currentUserId
                            ? "bg-primary/20"
                            : "bg-muted/50"
                        )}
                      >
                        <div className="font-medium text-xs">
                          {reply.senderId === currentUserId
                            ? "You"
                            : reply.senderName}
                        </div>
                        <div>{reply.content}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reactions */}
                {Object.keys(messageReactions).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(messageReactions).map(([emoji, users]) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(message.id, emoji)}
                        className="text-xs bg-background/50 px-2 py-1 rounded border hover:bg-accent"
                        title={users.join(", ")}
                      >
                        {emoji} {users.length}
                      </button>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() =>
                      setShowEmojiPicker(
                        showEmojiPicker === message.id ? null : message.id
                      )
                    }
                    className="text-xs hover:underline"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  {!isOwn && (
                    <button
                      onClick={() => setReplyingTo(message)}
                      className="text-xs hover:underline"
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Emoji picker */}
                {showEmojiPicker === message.id && (
                  <div className="flex gap-1 mt-2 p-2 bg-background rounded border">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(message.id, emoji)}
                        className="text-xl hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply input */}
      {replyingTo && (
        <div className="border-t p-2 bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm">
              Replying to: <span className="font-medium">{replyingTo.senderName}</span>
            </div>
            <button onClick={() => setReplyingTo(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendReply();
            }}
            className="flex gap-2"
          >
            <Input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type a reply..."
              className="flex-1"
            />
            <Button type="submit" disabled={!replyContent.trim() || isSending}>
              Send
            </Button>
          </form>
        </div>
      )}

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          disabled={isSending}
        />
        <Button type="submit" disabled={!newMessage.trim() || isSending}>
          Send
        </Button>
      </form>
    </div>
  );
}

