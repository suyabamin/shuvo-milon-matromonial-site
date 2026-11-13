import { describe, it, expect } from "vitest";
import {
  getBDStartOfDayMs,
  isRateLimitExceeded,
  DAILY_INTEREST_LIMIT,
  InterestDocSchema,
} from "./interestSchema";

describe("isRateLimitExceeded", () => {
  it("returns false when below limit", () => {
    expect(isRateLimitExceeded(0)).toBe(false);
    expect(isRateLimitExceeded(19)).toBe(false);
  });

  it("returns true when at limit", () => {
    expect(isRateLimitExceeded(DAILY_INTEREST_LIMIT)).toBe(true);
  });

  it("returns true when over limit", () => {
    expect(isRateLimitExceeded(25)).toBe(true);
  });
});

describe("getBDStartOfDayMs", () => {
  it("returns a past timestamp (start of today)", () => {
    const start = getBDStartOfDayMs();
    expect(start).toBeLessThanOrEqual(Date.now());
  });

  it("returns a value within the last 24 hours", () => {
    const start = getBDStartOfDayMs();
    expect(Date.now() - start).toBeLessThan(24 * 60 * 60 * 1000);
  });

  it("is divisible by 24h when adjusted for BD offset", () => {
    const BD_OFFSET_MS = 6 * 60 * 60 * 1000;
    const start = getBDStartOfDayMs();
    expect((start + BD_OFFSET_MS) % (24 * 60 * 60 * 1000)).toBe(0);
  });
});

describe("InterestDocSchema", () => {
  it("validates a correct interest document", () => {
    const doc = {
      id: "abc",
      fromUid: "u1",
      toUid: "u2",
      status: "pending",
      sentAt: Date.now(),
      updatedAt: Date.now(),
    };
    expect(() => InterestDocSchema.parse(doc)).not.toThrow();
  });

  it("rejects an invalid status", () => {
    const doc = {
      id: "abc",
      fromUid: "u1",
      toUid: "u2",
      status: "unknown",
      sentAt: Date.now(),
      updatedAt: Date.now(),
    };
    expect(() => InterestDocSchema.parse(doc)).toThrow();
  });
});
