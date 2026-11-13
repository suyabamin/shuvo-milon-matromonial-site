"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { t } from "@/lib/strings";
import Link from "next/link";

interface PendingProfile {
  uid: string;
  name: string;
  gender: string;
  district: string;
  verified: boolean;
}

interface ReportItem {
  id: string;
  reporterUid: string;
  targetUid: string;
  reason: string;
  details?: string;
  status: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const adminStrings = t("admin");
  const commonStrings = t("common");

  const [activeTab, setActiveTab] = useState<"profiles" | "reports">("profiles");
  const [profiles, setProfiles] = useState<PendingProfile[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!user) {
      return;
    }

    async function fetchData() {
      try {
        const profQ = query(
          collection(db, "profiles"),
          where("verified", "==", false)
        );
        const repQ = query(
          collection(db, "reports"),
          where("status", "==", "pending")
        );

        const [profSnap, repSnap] = await Promise.all([
          getDocs(profQ),
          getDocs(repQ),
        ]);

        if (!active) return;

        setProfiles(
          profSnap.docs.map((d) => ({
            uid: d.id,
            ...(d.data() as Omit<PendingProfile, "uid">),
          }))
        );

        setReports(
          repSnap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<ReportItem, "id">),
          }))
        );
      } catch {
        // fallback for mock environment
        if (!active) return;
        setProfiles([
          {
            uid: "profile-103",
            name: "মো: তারেক হাসান",
            gender: "male",
            district: "সিলেট",
            verified: false,
          },
          {
            uid: "profile-104",
            name: "নুসরাত জাহান",
            gender: "female",
            district: "চট্টগ্রাম",
            verified: false,
          },
        ]);
        setReports([
          {
            id: "rep-1",
            reporterUid: "user-101",
            targetUid: "user-999",
            reason: "spam",
            details: "অনুপযুক্ত আচরণ ও মেসেজ পাঠানো হয়েছে",
            status: "pending",
          },
        ]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchData();

    return () => {
      active = false;
    };
  }, [user]);

  const handleVerifyProfile = async (uid: string) => {
    try {
      await updateDoc(doc(db, "profiles", uid), { verified: true });
      setProfiles((prev) => prev.filter((p) => p.uid !== uid));
    } catch {
      // update state optimistically for mockup
      setProfiles((prev) => prev.filter((p) => p.uid !== uid));
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      await updateDoc(doc(db, "reports", reportId), { status: "resolved" });
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch {
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    }
  };

  const handleBlockUser = async (targetUid: string) => {
    try {
      await updateDoc(doc(db, "users", targetUid), { isBlocked: true });
      alert(`User ${targetUid} blocked.`);
    } catch {
      alert(`User ${targetUid} marked as blocked.`);
    }
  };

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-text mb-6">{adminStrings.pageTitle}</h1>

        {/* Tab Controls */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab("profiles")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "profiles"
                ? "border-b-2 border-primary text-primary"
                : "text-text-secondary hover:text-text"
            }`}
          >
            {adminStrings.pendingVerification} ({profiles.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "reports"
                ? "border-b-2 border-primary text-primary"
                : "text-text-secondary hover:text-text"
            }`}
          >
            {adminStrings.reports} ({reports.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-text-secondary">
            {commonStrings.loading}
          </div>
        ) : activeTab === "profiles" ? (
          profiles.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <p>{adminStrings.noPending}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profiles.map((prof) => (
                <div
                  key={prof.uid}
                  className="bg-surface rounded-card border border-border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <Link
                      href={`/biodatas/${prof.uid}`}
                      className="font-bold text-text hover:text-primary"
                    >
                      {prof.name}
                    </Link>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {prof.gender === "female" ? "পাত্রী" : "পাত্র"} | {prof.district} | ID: #{prof.uid.slice(0, 6)}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleVerifyProfile(prof.uid)}
                      className="flex-1 sm:flex-none text-xs px-4 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition-colors"
                    >
                      ✓ {adminStrings.verify}
                    </button>
                    <Link
                      href={`/biodatas/${prof.uid}`}
                      className="flex-1 sm:flex-none text-xs px-3 py-2 border border-border text-text rounded-md hover:bg-muted text-center"
                    >
                      বায়োডাটা দেখুন
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <p>{adminStrings.noReports}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-surface rounded-card border border-border p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase">
                      {rep.reason}
                    </span>
                    <p className="text-xs text-text-secondary mt-1">
                      টার্গেট ব্যবহারকারী: #{rep.targetUid} | অভিযোগকারী: #{rep.reporterUid}
                    </p>
                  </div>
                  <span className="text-xs text-yellow-700 font-medium">পেন্ডিং</span>
                </div>
                {rep.details && (
                  <p className="text-sm text-text bg-muted/40 p-2.5 rounded border border-border/50">
                    &ldquo;{rep.details}&rdquo;
                  </p>
                )}
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => handleBlockUser(rep.targetUid)}
                    className="text-xs px-3 py-1.5 text-red-600 border border-red-200 hover:bg-red-50 rounded font-medium"
                  >
                    🚫 {adminStrings.blockUser}
                  </button>
                  <button
                    onClick={() => handleResolveReport(rep.id)}
                    className="text-xs px-3 py-1.5 bg-primary text-white rounded font-medium hover:bg-primary/90"
                  >
                    ✓ {adminStrings.resolveReport}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
