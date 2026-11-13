import { describe, it, expect } from "vitest";
import { normalizeBDPhone, bdPhoneSchema } from "./phone";

describe("Bangladeshi Phone Validation", () => {
  it("normalizes local 11-digit numbers to +8801XXXXXXXXX", () => {
    expect(normalizeBDPhone("01712345678")).toBe("+8801712345678");
    expect(normalizeBDPhone("01999887766")).toBe("+8801999887766");
    expect(normalizeBDPhone("01300000000")).toBe("+8801300000000");
  });

  it("handles numbers with spaces or hyphens", () => {
    expect(normalizeBDPhone("01712-345678")).toBe("+8801712345678");
    expect(normalizeBDPhone("0181 234 5678")).toBe("+8801812345678");
  });

  it("accepts already prefixed numbers", () => {
    expect(normalizeBDPhone("+8801712345678")).toBe("+8801712345678");
    expect(normalizeBDPhone("8801712345678")).toBe("+8801712345678");
  });

  it("rejects invalid lengths and operators", () => {
    expect(normalizeBDPhone("01234567890")).toBeNull(); // 012 is invalid operator
    expect(normalizeBDPhone("017123456")).toBeNull(); // Too short
    expect(normalizeBDPhone("01712345678999")).toBeNull(); // Too long
    expect(normalizeBDPhone("abcdefghijk")).toBeNull();
  });

  it("fails zod schema validation with proper error", () => {
    const parsed = bdPhoneSchema.safeParse("12345");
    expect(parsed.success).toBe(false);
  });
});
