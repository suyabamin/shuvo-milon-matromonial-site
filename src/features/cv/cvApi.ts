"use client";

import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CVDoc, CVDocSchema } from "./cvSchema";

function toCVDoc(uid: string, data: Record<string, unknown>): CVDoc {
  const updatedAt =
    data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : Number(data.updatedAt ?? 0);

  return CVDocSchema.parse({
    ...data,
    uid,
    updatedAt,
  });
}

/**
 * Get CV by UID from Firestore.
 */
export async function getCVByUid(uid: string): Promise<CVDoc | null> {
  const ref = doc(db, "cvs", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toCVDoc(uid, snap.data() as Record<string, unknown>);
}

/**
 * Save or update CV document in Firestore.
 */
export async function saveCVDoc(cv: CVDoc): Promise<void> {
  const ref = doc(db, "cvs", cv.uid);
  await setDoc(
    ref,
    {
      ...cv,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
