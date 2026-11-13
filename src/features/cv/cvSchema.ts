import { z } from "zod";

export const EducationItemSchema = z.object({
  degree: z.string().min(1, "ডিগ্রি আবশ্যক"),
  institution: z.string().min(1, "শিক্ষা প্রতিষ্ঠান আবশ্যক"),
  passingYear: z.string().min(4, "পাসের সাল আবশ্যক"),
  result: z.string().optional(),
});

export const CareerItemSchema = z.object({
  designation: z.string().min(1, "পদবী আবশ্যক"),
  organization: z.string().min(1, "প্রতিষ্ঠানের নাম আবশ্যক"),
  startYear: z.string().min(4, "শুরুর বছর আবশ্যক"),
  endYear: z.string().optional(),
});

export const CVDocSchema = z.object({
  uid: z.string(),
  status: z.enum(["draft", "published"]).default("draft"),
  templateId: z.enum(["minimal", "classic", "modern"]).default("classic"),
  personalInfo: z.object({
    fullName: z.string().min(1, "পূর্ণ নাম আবশ্যক"),
    fatherName: z.string().min(1, "পিতার নাম আবশ্যক"),
    motherName: z.string().min(1, "মাতার নাম আবশ্যক"),
    dob: z.string().min(1, "জন্ম তারিখ আবশ্যক"),
    gender: z.enum(["male", "female"]),
    religion: z.string().default("ইসলাম"),
    maritalStatus: z.string().min(1, "বৈবাহিক অবস্থা আবশ্যক"),
    height: z.string().min(1, "উচ্চতা আবশ্যক"),
    weight: z.string().optional(),
    complexion: z.string().min(1, "গাত্রবর্ণ আবশ্যক"),
    bloodGroup: z.string().optional(),
  }),
  education: z.array(EducationItemSchema).default([]),
  career: z.array(CareerItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  familyDetails: z.object({
    fatherProfession: z.string().optional(),
    motherProfession: z.string().optional(),
    siblingsInfo: z.string().optional(),
  }),
  contactDetails: z.object({
    showPhone: z.boolean().default(false),
    phone: z.string().optional(),
    email: z.string().optional(),
    permanentAddress: z.string().min(1, "স্থায়ী ঠিকানা আবশ্যক"),
    presentAddress: z.string().min(1, "বর্তমান ঠিকানা আবশ্যক"),
  }),
  updatedAt: z.number().optional(),
});

export type CVDoc = z.infer<typeof CVDocSchema>;
