import { describe, it, expect } from "vitest";
import { CVDocSchema } from "./cvSchema";

describe("CVDocSchema", () => {
  it("validates a full CV document structure", () => {
    const validCV = {
      uid: "user-123",
      status: "draft" as const,
      templateId: "classic" as const,
      personalInfo: {
        fullName: "মো: রফিকুল ইসলাম",
        fatherName: "আব্দুল করিম",
        motherName: "রাবেয়া খাতুন",
        dob: "1998-05-12",
        gender: "male" as const,
        religion: "ইসলাম",
        maritalStatus: "অবিবাহিত",
        height: "5' 8\"",
        complexion: "উজ্জ্বল শ্যামলা",
      },
      education: [
        {
          degree: "বিএসসি ইন সিএসই",
          institution: "ঢাকা বিশ্ববিদ্যালয়",
          passingYear: "2020",
          result: "3.75",
        },
      ],
      career: [
        {
          designation: "সফটওয়্যার ইঞ্জিনিয়ার",
          organization: "টেক লিমিটেড",
          startYear: "2021",
        },
      ],
      skills: ["জাভাস্ক্রিপ্ট", "রিঅ্যাক্ট", "টাইপস্ক্রিপ্ট"],
      familyDetails: {
        fatherProfession: "ব্যবসায়ী",
        motherProfession: "গৃহিনী",
        siblingsInfo: "১ ভাই, ১ বোন",
      },
      contactDetails: {
        showPhone: true,
        phone: "+8801711111111",
        email: "test@example.com",
        permanentAddress: "মিরপুর, ঢাকা",
        presentAddress: "ধানমন্ডি, ঢাকা",
      },
    };

    expect(() => CVDocSchema.parse(validCV)).not.toThrow();
  });

  it("fails if required personal info fields are missing", () => {
    const invalidCV = {
      uid: "user-123",
      personalInfo: {
        fullName: "",
      },
    };
    expect(() => CVDocSchema.parse(invalidCV)).toThrow();
  });
});
