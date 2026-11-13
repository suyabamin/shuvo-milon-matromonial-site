export const REQUIRED_FIREBASE_ENV_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

/**
 * Pure function to check missing Firebase environment variables.
 * Returns array of missing variable names.
 */
export function checkFirebaseEnv(env: Record<string, string | undefined>): string[] {
  const missing: string[] = [];
  for (const key of REQUIRED_FIREBASE_ENV_VARS) {
    if (!env[key] || env[key]?.trim() === "") {
      missing.push(key);
    }
  }
  return missing;
}
