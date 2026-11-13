import { z } from "zod";

export const MessageDocSchema = z.object({
  id: z.string(),
  senderUid: z.string(),
  text: z.string().min(1).max(2000),
  timestamp: z.number(),
  read: z.boolean().default(false),
});

export type MessageDoc = z.infer<typeof MessageDocSchema>;

export const ChatDocSchema = z.object({
  id: z.string(),
  participants: z.array(z.string()).min(2).max(2),
  lastMessage: z.string().nullable().optional(),
  lastMessageTimestamp: z.number().nullable().optional(),
  createdAt: z.number(),
});

export type ChatDoc = z.infer<typeof ChatDocSchema>;

export const ReportReasonSchema = z.enum(["spam", "fake", "abuse", "other"]);
export type ReportReason = z.infer<typeof ReportReasonSchema>;

export const ReportDocSchema = z.object({
  id: z.string(),
  reporterUid: z.string(),
  targetUid: z.string(),
  reason: ReportReasonSchema,
  details: z.string().max(1000).optional(),
  status: z.enum(["pending", "reviewed", "resolved"]),
  createdAt: z.number(),
});

export type ReportDoc = z.infer<typeof ReportDocSchema>;
