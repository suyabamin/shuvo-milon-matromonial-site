import { describe, it, expect } from "vitest";
import { formatString } from "@/lib/strings";

describe("formatString", () => {
  it("replaces template variables correctly", () => {
    const template = "Hello {name}, your code is {code}";
    const result = formatString(template, { name: "User", code: 1234 });
    expect(result).toBe("Hello User, your code is 1234");
  });

  it("handles copyright template replacement", () => {
    const template = "© {year} শুভ মিলন।";
    const result = formatString(template, { year: 2026 });
    expect(result).toBe("© 2026 শুভ মিলন।");
  });
});
