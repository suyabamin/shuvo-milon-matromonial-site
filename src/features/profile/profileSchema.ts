import { z } from "zod";

export const profileBasicSchema = z.object({
  name: z.string().min(2, "ন্যূনতম ২ অক্ষরের নাম দিন"),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "জন্ম তারিখ নির্ধারণ করুন"),
  maritalStatus: z.enum(["unmarried", "divorced", "widowed"]),
});

export const profileReligiousSchema = z.object({
  religion: z.literal("Islam"),
  sect: z.string().min(1, "মাযহাব/চর্চা নির্বাচন করুন"),
  religiousPractice: z.string().min(3, "ধার্মিক চর্চার বিবরণ দিন"),
});

export const profileAddressSchema = z.object({
  country: z.string().default("বাংলাদেশ"),
  division: z.string().min(1, "বিভাগ নির্বাচন করুন"),
  district: z.string().min(1, "জেলা নির্বাচন করুন"),
  upazila: z.string().min(1, "উপজেলা নির্বাচন করুন"),
});

export const profileEducationSchema = z.object({
  educationLevel: z.string().min(1, "শিক্ষাগত যোগ্যতা দিন"),
  institution: z.string().optional(),
  occupation: z.string().min(1, "পেশা নির্বাচন করুন"),
  monthlyIncome: z.string().optional(),
});

export const profileWizardSchema = profileBasicSchema
  .merge(profileReligiousSchema)
  .merge(profileAddressSchema)
  .merge(profileEducationSchema);

export type ProfileWizardData = z.infer<typeof profileWizardSchema>;

export function calculateAge(dobString: string): number {
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
