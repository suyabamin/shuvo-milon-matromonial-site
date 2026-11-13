import { describe, it, expect } from "vitest";
import { buildFilterCriteria, searchFiltersSchema } from "./filterBuilder";

describe("Search Filter Builder", () => {
  it("builds valid filter criteria cleanly without empty fields", () => {
    const filters = {
      gender: "male" as const,
      maritalStatus: "unmarried" as const,
      district: "ঢাকা",
      minAge: 22,
      maxAge: 30,
    };
    const criteria = buildFilterCriteria(filters);
    expect(criteria.gender).toBe("male");
    expect(criteria.maritalStatus).toBe("unmarried");
    expect(criteria.district).toBe("ঢাকা");
    expect(criteria.minAge).toBe(22);
    expect(criteria.maxAge).toBe(30);
  });

  it("omits 'all' marital status from strict filter criteria", () => {
    const filters = {
      maritalStatus: "all" as const,
    };
    const criteria = buildFilterCriteria(filters);
    expect(criteria.maritalStatus).toBeUndefined();
  });

  it("validates age boundaries with zod", () => {
    const invalidAge = searchFiltersSchema.safeParse({ minAge: 15 }); // less than 18
    expect(invalidAge.success).toBe(false);
  });
});
