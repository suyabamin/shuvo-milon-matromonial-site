import { z } from "zod";

export const InterestStatusSchema = z.enum(["pending", "accepted", "rejected"]);
export type InterestStatus = z.infer<typeof InterestStatusSchema>;

export const InterestDocSchema = z.object({
  id: z.string(),
  fromUid: z.string(),
  toUid: z.string(),
  status: InterestStatusSchema,
  sentAt: z.number(), // Unix ms timestamp
  updatedAt: z.number(),
});

export type InterestDoc = z.infer<typeof InterestDocSchema>;

/** Maximum interests a user can send per calendar day (00:00–23:59 BD time) */
export const DAILY_INTEREST_LIMIT = 20;

/**
 * Returns the UTC timestamp (ms) for the start of the current calendar day
 * in Bangladesh Standard Time (UTC+6).
 */
export function getBDStartOfDayMs(): number {
  const BD_OFFSET_MS = 6 * 60 * 60 * 1000; // UTC+6
  const nowUtc = Date.now();
  const nowBD = nowUtc + BD_OFFSET_MS;
  const startOfDayBD = nowBD - (nowBD % (24 * 60 * 60 * 1000));
  return startOfDayBD - BD_OFFSET_MS; // back to UTC ms
}

/**
 * Checks whether the user has exceeded the daily interest limit.
 * @param sentTodayCount Number of interests already sent today.
 * @returns true if limit exceeded.
 */
export function isRateLimitExceeded(sentTodayCount: number): boolean {
  return sentTodayCount >= DAILY_INTEREST_LIMIT;
}
