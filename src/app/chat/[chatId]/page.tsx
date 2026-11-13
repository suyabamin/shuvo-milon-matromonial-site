import { Suspense } from "react";
import ChatDetailClient from "./ChatDetailClient";

export async function generateStaticParams() {
  return [{ chatId: "mock-chat-1" }];
}

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary text-sm">
          লোড হচ্ছে...
        </div>
      }
    >
      <ChatDetailClient chatId={chatId} />
    </Suspense>
  );
}
