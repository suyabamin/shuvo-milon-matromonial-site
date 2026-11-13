import { describe, it, expect } from "vitest";
import {
  MessageDocSchema,
  ChatDocSchema,
  ReportDocSchema,
} from "./chatSchema";

describe("MessageDocSchema", () => {
  it("validates valid message", () => {
    const msg = {
      id: "msg_1",
      senderUid: "u1",
      text: "আসসালামু আলাইকুম",
      timestamp: Date.now(),
      read: false,
    };
    expect(() => MessageDocSchema.parse(msg)).not.toThrow();
  });

  it("rejects empty text", () => {
    const msg = {
      id: "msg_1",
      senderUid: "u1",
      text: "",
      timestamp: Date.now(),
      read: false,
    };
    expect(() => MessageDocSchema.parse(msg)).toThrow();
  });
});

describe("ChatDocSchema", () => {
  it("validates valid chat document", () => {
    const chat = {
      id: "chat_1",
      participants: ["u1", "u2"],
      lastMessage: "হ্যালো",
      lastMessageTimestamp: Date.now(),
      createdAt: Date.now(),
    };
    expect(() => ChatDocSchema.parse(chat)).not.toThrow();
  });

  it("rejects invalid participants length", () => {
    const chat = {
      id: "chat_1",
      participants: ["u1"],
      createdAt: Date.now(),
    };
    expect(() => ChatDocSchema.parse(chat)).toThrow();
  });
});

describe("ReportDocSchema", () => {
  it("validates valid report", () => {
    const report = {
      id: "rep_1",
      reporterUid: "u1",
      targetUid: "u2",
      reason: "spam",
      details: "Suspicious behavior",
      status: "pending",
      createdAt: Date.now(),
    };
    expect(() => ReportDocSchema.parse(report)).not.toThrow();
  });

  it("rejects invalid reason", () => {
    const report = {
      id: "rep_1",
      reporterUid: "u1",
      targetUid: "u2",
      reason: "unknown_reason",
      status: "pending",
      createdAt: Date.now(),
    };
    expect(() => ReportDocSchema.parse(report)).toThrow();
  });
});
