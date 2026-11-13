import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfileMeta } from "@/features/auth/AuthContext";

export interface UserDoc {
  uid: string;
  phone: string;
  role: "user" | "admin";
  isBlocked: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

/**
 * Creates or retrieves the user document upon successful authentication.
 * Defaults new users to 'user' role with unblocked status.
 */
export async function syncUserDocument(uid: string, phone: string): Promise<UserProfileMeta> {
  const userDocRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const newUser: UserDoc = {
      uid,
      phone,
      role: "user",
      isBlocked: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userDocRef, newUser);
    return {
      uid,
      phone,
      role: "user",
      isBlocked: false,
    };
  }

  const data = userSnapshot.data() as UserDoc;
  return {
    uid: data.uid,
    phone: data.phone,
    role: data.role || "user",
    isBlocked: !!data.isBlocked,
  };
}
