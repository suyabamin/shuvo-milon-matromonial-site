"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import {
  getSentInterests,
  getReceivedInterests,
  acceptInterest,
  rejectInterest,
} from "@/features/interest/interestApi";
import { InterestDoc } from "@/features/interest/interestSchema";
import { t } from "@/lib/strings";
import Link from "next/link";

type Tab = "sent" | "received";

function StatusBadge({ status }: { status: InterestDoc["status"] }) {
  const interestStrings = t("interest");
  const labels: Record<InterestDoc["status"], string> = {
    pending: interestStrings.pending,
    accepted: interestStrings.accepted,
    rejected: interestStrings.rejected,
  };
  const colors: Record<InterestDoc["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function InterestCard({
  interest,
  tab,
  onAccept,
  onReject,
}: {
  interest: InterestDoc;
  tab: Tab;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}) {
  const profileStrings = t("profile");
  const interestStrings = t("interest");
  const otherUid = tab === "sent" ? interest.toUid : interest.fromUid;
  const dateStr = new Date(interest.sentAt).toLocaleDateString("bn-BD");

  return (
    <div className="bg-surface rounded-card border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Avatar placeholder */}
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
        <span className="text-text-secondary text-sm">👤</span>
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/biodatas/${otherUid}`}
          className="font-semibold text-text hover:text-primary truncate block"
        >
          {profileStrings.biodataNo} #{otherUid.slice(0, 6).toUpperCase()}
        </Link>
        <p className="text-xs text-text-secondary mt-0.5">{dateStr}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={interest.status} />
        {tab === "received" && interest.status === "pending" && (
          <>
            <button
              onClick={() => onAccept?.(interest.id)}
              className="text-sm px-3 py-1 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              {interestStrings.accept}
            </button>
            <button
              onClick={() => onReject?.(interest.id)}
              className="text-sm px-3 py-1 rounded-md border border-border text-text-secondary hover:bg-muted transition-colors"
            >
              {interestStrings.reject}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-surface rounded-card border border-border p-4 flex gap-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-32" />
        <div className="h-3 bg-muted rounded w-20" />
      </div>
    </div>
  );
}

export default function InterestsPage() {
  const { user } = useAuth();
  const interestStrings = t("interest");
  const commonStrings = t("common");

  const [activeTab, setActiveTab] = useState<Tab>("received");
  const [sentList, setSentList] = useState<InterestDoc[]>([]);
  const [receivedList, setReceivedList] = useState<InterestDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const refreshInterests = useCallback(async () => {
    if (!user) return;
    try {
      const [sent, received] = await Promise.all([
        getSentInterests(user.uid),
        getReceivedInterests(user.uid),
      ]);
      setSentList(sent);
      setReceivedList(received);
    } catch {
      setError(commonStrings.errorGeneric);
    }
  }, [user, commonStrings.errorGeneric]);

  useEffect(() => {
    let active = true;
    if (!user) {
      return;
    }

    Promise.all([
      getSentInterests(user.uid),
      getReceivedInterests(user.uid),
    ])
      .then(([sent, received]) => {
        if (!active) return;
        setSentList(sent);
        setReceivedList(received);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(commonStrings.errorGeneric);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, commonStrings.errorGeneric]);

  const handleAccept = async (id: string) => {
    setActionError(null);
    try {
      await acceptInterest(id);
      await refreshInterests();
    } catch {
      setActionError(interestStrings.acceptError);
    }
  };

  const handleReject = async (id: string) => {
    setActionError(null);
    try {
      await rejectInterest(id);
      await refreshInterests();
    } catch {
      setActionError(interestStrings.rejectError);
    }
  };

  const displayList = activeTab === "sent" ? sentList : receivedList;

  const tabs: { key: Tab; label: string }[] = [
    { key: "received", label: interestStrings.received },
    { key: "sent", label: interestStrings.sent },
  ];

  return (
    <main className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text mb-6">{interestStrings.pageTitle}</h1>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {tab.label}
              {tab.key === "received" && receivedList.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-primary text-white rounded-full">
                  {receivedList.filter((i) => i.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error banner */}
        {actionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-card text-red-700 text-sm">
            {actionError}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-text-secondary">
            <p>{error}</p>
            <button
              onClick={() => void refreshInterests()}
              className="mt-4 text-primary underline text-sm"
            >
              {commonStrings.retry}
            </button>
          </div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-4xl mb-3">💌</p>
            <p>{activeTab === "sent" ? interestStrings.emptySent : interestStrings.emptyReceived}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayList.map((interest) => (
              <InterestCard
                key={interest.id}
                interest={interest}
                tab={activeTab}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
