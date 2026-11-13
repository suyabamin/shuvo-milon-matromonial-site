"use client";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ChatDoc,
  ChatDocSchema,
  MessageDoc,
  MessageDocSchema,
  ReportReason,
  ReportDocSchema,
} from "./chatSchema";

function toChatDoc(id: string, data: Record<string, unknown>): ChatDoc {
  const createdAt =
    data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Number(data.createdAt ?? 0);
  const lastMessageTimestamp =
    data.lastMessageTimestamp instanceof Timestamp
      ? data.lastMessageTimestamp.toMillis()
      : typeof data.lastMessageTimestamp === "number"
      ? data.lastMessageTimestamp
      : null;

  return ChatDocSchema.parse({
    ...data,
    id,
    createdAt,
    lastMessageTimestamp,
  });
}

function toMessageDoc(id: string, data: Record<string, unknown>): MessageDoc {
  const timestamp =
    data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : Number(data.timestamp ?? 0);

  return MessageDocSchema.parse({
    ...data,
    id,
    timestamp,
  });
}

/**
 * Fetch all chats for a given user.
 */
export async function getUserChats(uid: string): Promise<ChatDoc[]> {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toChatDoc(d.id, d.data() as Record<string, unknown>));
}

/**
 * Subscribe to realtime messages in a chat.
 */
export function subscribeToMessages(
  chatId: string,
  onUpdate: (messages: MessageDoc[]) => void,
  onError?: (err: Error) => void
) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(
    q,
    (snap) => {
      const msgs = snap.docs.map((d) =>
        toMessageDoc(d.id, d.data() as Record<string, unknown>)
      );
      onUpdate(msgs);
    },
    (err) => {
      onError?.(err);
    }
  );
}

/**
 * Send a message in a chat and update lastMessage on chat doc.
 */
export async function sendMessage(chatId: string, senderUid: string, text: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  await addDoc(collection(db, "chats", chatId, "messages"), {
    senderUid,
    text: trimmed,
    timestamp: serverTimestamp(),
    read: false,
  });

  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: trimmed,
    lastMessageTimestamp: serverTimestamp(),
  });
}

/**
 * Report a user or conversation.
 */
export async function submitReport(
  reporterUid: string,
  targetUid: string,
  reason: ReportReason,
  details?: string
): Promise<void> {
  const reportData = {
    reporterUid,
    targetUid,
    reason,
    details: details || "",
    status: "pending",
    createdAt: Date.now(),
  };

  ReportDocSchema.parse({ ...reportData, id: "temp" });

  await addDoc(collection(db, "reports"), {
    ...reportData,
    createdAt: serverTimestamp(),
  });
}
