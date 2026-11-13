"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import {
  subscribeToMessages,
  sendMessage,
  submitReport,
} from "@/features/chat/chatApi";
import { MessageDoc, ReportReason } from "@/features/chat/chatSchema";
import { t } from "@/lib/strings";
import Link from "next/link";

export default function ChatDetailClient({ chatId }: { chatId: string }) {
  const { user } = useAuth();
  const chatStrings = t("chat");
  const commonStrings = t("common");

  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason>("spam");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(chatId, (newMsgs) => {
      setMessages(newMsgs);
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inputText.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(chatId, user.uid, inputText);
      setInputText("");
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await submitReport(user.uid, chatId, reportReason, reportDetails);
      setReportSuccess(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSuccess(false);
        setReportDetails("");
      }, 1500);
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between max-w-2xl mx-auto border-x border-border">
      {/* Header */}
      <header className="p-4 border-b border-border bg-surface flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="text-text-secondary hover:text-text">
            ← {commonStrings.back}
          </Link>
          <span className="font-semibold text-text">চ্যাট</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportModalOpen(true)}
            className="text-xs px-2.5 py-1 text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors"
          >
            {chatStrings.report}
          </button>
          <button
            onClick={() => setIsBlocked(true)}
            disabled={isBlocked}
            className={`text-xs px-2.5 py-1 rounded border transition-colors ${
              isBlocked
                ? "bg-muted text-text-secondary border-border"
                : "text-text-secondary hover:bg-muted border-border"
            }`}
          >
            {isBlocked ? "ব্লকড" : chatStrings.block}
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <p>{chatStrings.emptyChat}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderUid === user?.uid;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isMe
                      ? "bg-primary text-white rounded-br-xs"
                      : "bg-surface border border-border text-text rounded-bl-xs"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[10px] block mt-1 ${
                      isMe ? "text-white/80 text-right" : "text-text-secondary"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString("bn-BD", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {isBlocked ? (
        <div className="p-4 bg-muted text-center text-sm text-text-secondary border-t border-border">
          আপনি এই ব্যবহারকারীকে ব্লক করেছেন।
        </div>
      ) : (
        <form
          onSubmit={handleSend}
          className="p-3 bg-surface border-t border-border flex gap-2 sticky bottom-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={chatStrings.messagePlaceholder}
            className="flex-1 px-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="px-5 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {chatStrings.send}
          </button>
        </form>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-card p-6 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-text text-lg">{chatStrings.reportTitle}</h3>
            {reportSuccess ? (
              <p className="text-green-600 text-sm py-4 text-center">
                ✓ {chatStrings.reportSuccess}
              </p>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">
                    {chatStrings.reportReason}
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as ReportReason)}
                    className="w-full text-sm border border-border rounded-md p-2 bg-background"
                  >
                    <option value="spam">{chatStrings.reportReasonSpam}</option>
                    <option value="fake">{chatStrings.reportReasonFake}</option>
                    <option value="abuse">{chatStrings.reportReasonAbuse}</option>
                    <option value="other">{chatStrings.reportReasonOther}</option>
                  </select>
                </div>
                <div>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="বিস্তারিত লিখুন (ঐচ্ছিক)"
                    className="w-full text-sm border border-border rounded-md p-2 bg-background h-20 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-3 py-1.5 text-sm text-text-secondary hover:bg-muted rounded"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    {chatStrings.reportSubmit}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
