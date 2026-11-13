import {
  collection,
  query,
  where,
  limit,
  getDocs,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SearchFilters } from "./filterBuilder";

export interface ProfileCardData {
  uid: string;
  name: string;
  gender: "male" | "female";
  age: number;
  height: string;
  district: string;
  occupation: string;
  educationLevel: string;
  maritalStatus: "unmarried" | "divorced" | "widowed";
  photoUrl?: string;
  photoBlur: boolean;
  verified: boolean;
}

/**
 * Searches published profiles using Firestore compound query constraints.
 * Falls back to sample profiles if Firestore is offline or empty.
 */
export async function searchProfiles(
  filters: SearchFilters,
  maxResults: number = 20
): Promise<ProfileCardData[]> {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    return getMockProfiles(filters);
  }

  try {
    const constraints: QueryConstraint[] = [
      where("status", "==", "published"),
    ];

    if (filters.gender) {
      constraints.push(where("gender", "==", filters.gender));
    }
    if (filters.maritalStatus && filters.maritalStatus !== "all") {
      constraints.push(where("maritalStatus", "==", filters.maritalStatus));
    }
    if (filters.district) {
      constraints.push(where("district", "==", filters.district));
    }

    constraints.push(limit(maxResults));

    const q = query(collection(db, "profiles"), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      uid: docSnap.id,
      ...(docSnap.data() as Omit<ProfileCardData, "uid">),
    }));
  } catch (error) {
    if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
      return getMockProfiles(filters);
    }
    throw error;
  }
}

export function getMockProfiles(filters: SearchFilters): ProfileCardData[] {
  const allMocks: ProfileCardData[] = [
    {
      uid: "profile-101",
      name: "মুহাম্মদ আব্দুল্লাহ",
      gender: "male",
      age: 27,
      height: "5' 8\"",
      district: "ঢাকা",
      occupation: "সফটওয়্যার ইঞ্জিনিয়ার",
      educationLevel: "বিএসসি ইন সিএসই",
      maritalStatus: "unmarried",
      photoBlur: true,
      verified: true,
    },
    {
      uid: "profile-102",
      name: "ফাতেমা জান্নাত",
      gender: "female",
      age: 23,
      height: "5' 2\"",
      district: "সিলেট",
      occupation: "শিক্ষিকা",
      educationLevel: "স্নাতকোত্তর (ইসলামিক স্টাডিজ)",
      maritalStatus: "unmarried",
      photoBlur: true,
      verified: true,
    },
    {
      uid: "profile-103",
      name: "আহমদ জুবায়ের",
      gender: "male",
      age: 31,
      height: "5' 9\"",
      district: "চট্টগ্রাম",
      occupation: "ব্যবসায়ী",
      educationLevel: "দাওরায়ে হাদিস",
      maritalStatus: "unmarried",
      photoBlur: false,
      verified: true,
    },
    {
      uid: "profile-104",
      name: "আয়েশা সিদ্দিকা",
      gender: "female",
      age: 25,
      height: "5' 4\"",
      district: "গাজীপুর",
      occupation: "চিকিৎসক (MBBS)",
      educationLevel: "এমবিবিএস",
      maritalStatus: "unmarried",
      photoBlur: true,
      verified: true,
    },
    {
      uid: "profile-105",
      name: "উসমান গনি",
      gender: "male",
      age: 29,
      height: "5' 7\"",
      district: "রাজশাহী",
      occupation: "ব্যাংকার",
      educationLevel: "বিবিএ / এমবিএ",
      maritalStatus: "unmarried",
      photoBlur: true,
      verified: false,
    },
    {
      uid: "profile-106",
      name: "মরিয়ম আক্তার",
      gender: "female",
      age: 24,
      height: "5' 3\"",
      district: "কুমিল্লা",
      occupation: "গৃহিনী",
      educationLevel: "স্নাতক",
      maritalStatus: "unmarried",
      photoBlur: true,
      verified: true,
    },
  ];

  return allMocks.filter((p) => {
    if (filters.gender && p.gender !== filters.gender) return false;
    if (filters.maritalStatus && filters.maritalStatus !== "all" && p.maritalStatus !== filters.maritalStatus) {
      return false;
    }
    if (filters.district && !p.district.includes(filters.district)) return false;
    if (filters.minAge && p.age < filters.minAge) return false;
    if (filters.maxAge && p.age > filters.maxAge) return false;
    return true;
  });
}
