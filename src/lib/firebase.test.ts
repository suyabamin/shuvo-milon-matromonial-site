import { describe, it, expect } from "vitest";
import { checkFirebaseEnv, REQUIRED_FIREBASE_ENV_VARS } from "./firebaseEnv";

describe("checkFirebaseEnv", () => {
  it("returns an empty array when all required variables are set", () => {
    const completeEnv: Record<string, string> = {
      NEXT_PUBLIC_FIREBASE_API_KEY: "dummy-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "dummy.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "dummy-project",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "dummy.appspot.com",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456",
      NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456:web:dummy",
    };

    expect(checkFirebaseEnv(completeEnv)).toEqual([]);
  });

  it("identifies missing variables accurately", () => {
    const partialEnv: Record<string, string> = {
      NEXT_PUBLIC_FIREBASE_API_KEY: "dummy-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "dummy.firebaseapp.com",
    };

    const missing = checkFirebaseEnv(partialEnv);
    expect(missing).toContain("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    expect(missing).toContain("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
    expect(missing).toContain("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
    expect(missing).toContain("NEXT_PUBLIC_FIREBASE_APP_ID");
    expect(missing).not.toContain("NEXT_PUBLIC_FIREBASE_API_KEY");
  });

  it("treats whitespace-only values as missing", () => {
    const blankEnv: Record<string, string> = {
      NEXT_PUBLIC_FIREBASE_API_KEY: "   ",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "valid-domain",
    };

    const missing = checkFirebaseEnv(blankEnv);
    expect(missing).toContain("NEXT_PUBLIC_FIREBASE_API_KEY");
  });

  it("returns all variables when given an empty environment object", () => {
    const missing = checkFirebaseEnv({});
    expect(missing).toEqual([...REQUIRED_FIREBASE_ENV_VARS]);
  });
});
