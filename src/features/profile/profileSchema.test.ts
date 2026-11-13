import { describe, it, expect } from "vitest";
import { profileBasicSchema, calculateAge } from "./profileSchema";

describe("Profile validation and age calculation", () => {
  it("validates basic profile data correctly", () => {
    const valid = {
      name: "মুহাম্মদ আব্দুল্লাহ",
      gender: "male",
      dateOfBirth: "1998-05-15",
      maritalStatus: "unmarried",
    };
    expect(profileBasicSchema.safeParse(valid).success).toBe(true);
  });

  it("fails on short name or invalid gender", () => {
    const invalid = {
      name: "A",
      gender: "other",
      dateOfBirth: "1998-05-15",
      maritalStatus: "unmarried",
    };
    expect(profileBasicSchema.safeParse(invalid).success).toBe(false);
  });

  it("calculates age correctly from DOB string", () => {
    const age = calculateAge("2000-01-01");
    expect(age).toBeGreaterThanOrEqual(24);
  });
});
