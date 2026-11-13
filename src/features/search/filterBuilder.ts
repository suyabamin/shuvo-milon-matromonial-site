import { z } from "zod";

export const searchFiltersSchema = z.object({
  gender: z.enum(["male", "female"]).optional(),
  maritalStatus: z.enum(["all", "unmarried", "divorced", "widowed"]).optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  minAge: z.number().min(18).max(70).optional(),
  maxAge: z.number().min(18).max(70).optional(),
  educationLevel: z.string().optional(),
  occupation: z.string().optional(),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

/**
 * Builds query parameters or Firestore filter conditions based on user criteria.
 */
export function buildFilterCriteria(filters: SearchFilters): Record<string, string | number> {
  const criteria: Record<string, string | number> = {};

  if (filters.gender) criteria.gender = filters.gender;
  if (filters.maritalStatus && filters.maritalStatus !== "all") {
    criteria.maritalStatus = filters.maritalStatus;
  }
  if (filters.division) criteria.division = filters.division;
  if (filters.district) criteria.district = filters.district;
  if (filters.minAge) criteria.minAge = filters.minAge;
  if (filters.maxAge) criteria.maxAge = filters.maxAge;
  if (filters.educationLevel) criteria.educationLevel = filters.educationLevel;
  if (filters.occupation) criteria.occupation = filters.occupation;

  return criteria;
}
