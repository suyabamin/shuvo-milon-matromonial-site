"use client";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  InterestDoc,
  InterestDocSchema,
  getBDStartOfDayMs,
  isRateLimitExceeded,
} from "./interestSchema";

function toInterestDoc(id: string, data: Record<string, unknown>): InterestDoc {
  const sentAt =
    data.sentAt instanceof Timestamp ? data.sentAt.toMillis() : Number(data.sentAt ?? 0);
  const updatedAt =
    data.updatedAt instanceof Timestamp
      ? data.updatedAt.toMillis()
      : Number(data.updatedAt ?? 0);

  return InterestDocSchema.parse({ ...data, id, sentAt, updatedAt });
}

/**
 * Returns the number of interests the user sent since the start of today (BD time).
 */
async function countTodayInterests(fromUid: string): Promise<number> {
  const startMs = getBDStartOfDayMs();
  const startTs = Timestamp.fromMillis(startMs);
  const q = query(
    collection(db, "interests"),
    where("fromUid", "==", fromUid),
    where("sentAt", ">=", startTs)
  );
  const snap = await getDocs(q);
  return snap.size;
}

/**
 * Sends an interest from `fromUid` to `toUid`.
 * Throws if already sent or daily limit exceeded.
 */
export async function sendInterest(fromUid: string, toUid: string): Promise<void> {
  // Check for duplicate
  const dupQ = query(
    collection(db, "interests"),
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid)
  );
  const dupSnap = await getDocs(dupQ);
  if (!dupSnap.empty) {
    throw new Error("ALREADY_SENT");
  }

  // Rate limit check
  const count = await countTodayInterests(fromUid);
  if (isRateLimitExceeded(count)) {
    throw new Error("RATE_LIMIT");
  }

  await addDoc(collection(db, "interests"), {
    fromUid,
    toUid,
    status: "pending",
    sentAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Fetches interests sent by `uid`.
 */
export async function getSentInterests(uid: string): Promise<InterestDoc[]> {
  const q = query(collection(db, "interests"), where("fromUid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toInterestDoc(d.id, d.data() as Record<string, unknown>));
}

/**
 * Fetches interests received by `uid`.
 */
export async function getReceivedInterests(uid: string): Promise<InterestDoc[]> {
  const q = query(collection(db, "interests"), where("toUid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toInterestDoc(d.id, d.data() as Record<string, unknown>));
}

/**
 * Accepts an interest (only the receiver can do this).
 */
export async function acceptInterest(interestId: string): Promise<void> {
  await updateDoc(doc(db, "interests", interestId), {
    status: "accepted",
    updatedAt: serverTimestamp(),
  });
}

/**
 * Rejects an interest (only the receiver can do this).
 */
export async function rejectInterest(interestId: string): Promise<void> {
  await updateDoc(doc(db, "interests", interestId), {
    status: "rejected",
    updatedAt: serverTimestamp(),
  });
}
