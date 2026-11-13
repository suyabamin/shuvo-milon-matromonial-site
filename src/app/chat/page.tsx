"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getUserChats } from "@/features/chat/chatApi";
import { ChatDoc } from "@/features/chat/chatSchema";
import { t } from "@/lib/strings";
import Link from "next/link";

export default function ChatListPage() {
  const { user } = useAuth();
  const chatStrings = t("chat");
  const commonStrings = t("common");
  const emptyStrings = t("empty");

  const [chats, setChats] = useState<ChatDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!user) {
      return;
    }

    getUserChats(user.uid)
      .then((data) => {
        if (!active) return;
        setChats(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(commonStrings.errorGeneric);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, commonStrings.errorGeneric]);

  return (
    <main className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text mb-6">{chatStrings.pageTitle}</h1>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface rounded-card border border-border p-4 flex gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-28" />
                  <div className="h-3 bg-muted rounded w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-text-secondary">
            <p>{error}</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-4xl mb-3">💬</p>
            <p>{emptyStrings.chat}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => {
              const otherUid = chat.participants.find((p) => p !== user?.uid) || "unknown";
              return (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className="bg-surface rounded-card border border-border p-4 flex items-center gap-3 hover:border-primary/50 transition-colors block"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-semibold">
                    💬
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="font-semibold text-text truncate">
                        ID: #{otherUid.slice(0, 6).toUpperCase()}
                      </p>
                      {chat.lastMessageTimestamp && (
                        <span className="text-xs text-text-secondary">
                          {new Date(chat.lastMessageTimestamp).toLocaleTimeString("bn-BD", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary truncate">
                      {chat.lastMessage || chatStrings.emptyChat}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
