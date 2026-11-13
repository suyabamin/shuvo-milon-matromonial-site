"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface UserProfileMeta {
  uid: string;
  phone: string;
  role: "user" | "admin";
  isBlocked: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userMeta: UserProfileMeta | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userMeta: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMeta, setUserMeta] = useState<UserProfileMeta | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserMeta({
          uid: currentUser.uid,
          phone: currentUser.phoneNumber || "",
          role: "user",
          isBlocked: false,
        });
      } else {
        setUserMeta(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserMeta(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, userMeta, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
