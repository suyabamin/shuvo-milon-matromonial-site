"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FilterPanel } from "@/features/search/FilterPanel";
import { SearchFilters } from "@/features/search/filterBuilder";
import { ProfileCard } from "@/components/ProfileCard";
import { ProfileCardData, getMockProfiles, searchProfiles } from "@/features/search/searchApi";
import { t } from "@/lib/strings";

function BiodatasContent() {
  const searchParams = useSearchParams();
  const common = t("common");
  const empty = t("empty");

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    gender: (searchParams.get("gender") as SearchFilters["gender"]) || undefined,
    maritalStatus: (searchParams.get("maritalStatus") as SearchFilters["maritalStatus"]) || "all",
    district: searchParams.get("district") || undefined,
    minAge: 18,
    maxAge: 50,
  }));

  const [profiles, setProfiles] = useState<ProfileCardData[]>(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
      return getMockProfiles({
        gender: (searchParams.get("gender") as SearchFilters["gender"]) || undefined,
        maritalStatus: (searchParams.get("maritalStatus") as SearchFilters["maritalStatus"]) || "all",
        district: searchParams.get("district") || undefined,
        minAge: 18,
        maxAge: 50,
      });
    }
    return [];
  });
  const [shortlistedUids, setShortlistedUids] = useState<string[]>([]);
  const [interestSentUids, setInterestSentUids] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  React.useEffect(() => {
    let active = true;
    if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
      return;
    }

    searchProfiles(filters)
      .then((res) => {
        if (!active) return;
        setProfiles(res);
      })
      .catch(() => {
        if (!active) return;
        setProfiles([]);
      });

    return () => {
      active = false;
    };
  }, [filters]);

  const totalPages = Math.ceil(profiles.length / pageSize) || 1;
  const pagedProfiles = useMemo(
    () => profiles.slice((page - 1) * pageSize, page * pageSize),
    [profiles, page, pageSize]
  );

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ maritalStatus: "all", minAge: 18, maxAge: 50 });
    setPage(1);
  };

  const handleToggleShortlist = (uid: string) => {
    setShortlistedUids((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleSendInterest = (uid: string) => {
    if (!interestSentUids.includes(uid)) {
      setInterestSentUids((prev) => [...prev, uid]);
      alert("ইন্টারেস্ট সফলভাবে পাঠানো হয়েছে!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner & Mobile Filter Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-input-border">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text">
            সকল বায়োডাটা
          </h1>
          <p className="text-sm text-text-muted mt-1">
            মোট <span className="font-semibold text-primary">{profiles.length}</span> টি বায়োডাটা পাওয়া গেছে
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-button bg-surface border border-input-border text-sm font-semibold text-text hover:bg-bg-soft"
        >
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          ফিল্টার করুন
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          isOpenMobile={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        {/* Results Grid & Pagination */}
        <div className="flex-1 w-full">
          {pagedProfiles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {pagedProfiles.map((p) => (
                  <ProfileCard
                    key={p.uid}
                    profile={p}
                    isShortlisted={shortlistedUids.includes(p.uid)}
                    onToggleShortlist={handleToggleShortlist}
                    onSendInterest={handleSendInterest}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-button border border-input-border text-sm font-medium text-text disabled:opacity-40 hover:bg-bg-soft"
                  >
                    {common.back}
                  </button>

                  <span className="text-sm font-semibold text-text px-3">
                    পৃষ্ঠা {page} / {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 rounded-button border border-input-border text-sm font-medium text-text disabled:opacity-40 hover:bg-bg-soft"
                  >
                    {common.next}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center bg-surface rounded-card border border-input-border">
              <svg className="w-16 h-16 mx-auto text-text-muted/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-base font-medium text-text-muted">{empty.profiles}</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-button bg-primary text-surface text-sm font-semibold"
              >
                {common.reset}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BiodatasPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">লোড হচ্ছে...</div>}>
      <BiodatasContent />
    </Suspense>
  );
}
