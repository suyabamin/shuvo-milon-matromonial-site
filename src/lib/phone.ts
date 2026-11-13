import { z } from "zod";

/**
 * Validates Bangladeshi mobile phone numbers:
 * Accepts local format (e.g., "01712345678") or international format ("+8801712345678" / "8801712345678").
 * Normalizes to standard E.164 "+8801XXXXXXXXX" format.
 */
export const bdPhoneSchema = z.string().transform((val, ctx) => {
  const cleaned = val.replace(/[\s-]/g, "");
  let normalized = cleaned;

  if (normalized.startsWith("+880")) {
    normalized = normalized.slice(1);
  } else if (normalized.startsWith("0")) {
    normalized = `88${normalized}`;
  }

  // Check format: 8801[3-9]XXXXXXXX (13 digits total)
  const regex = /^8801[3-9]\d{8}$/;
  if (!regex.test(normalized)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "সঠিক বাংলাদেশী ফোন নম্বর দিন (যেমন: 01XXXXXXXXX)",
    });
    return z.NEVER;
  }

  return `+${normalized}`;
});

export function normalizeBDPhone(phone: string): string | null {
  const result = bdPhoneSchema.safeParse(phone);
  if (result.success) {
    return result.data;
  }
  return null;
}
