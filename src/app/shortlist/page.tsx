"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProfileCard } from "@/components/ProfileCard";
import { ProfileCardData, getMockProfiles } from "@/features/search/searchApi";
import { t } from "@/lib/strings";

export default function ShortlistPage() {
  const empty = t("empty");
  const nav = t("nav");

  // Initial shortlist selection
  const [shortlist, setShortlist] = useState<ProfileCardData[]>(() => {
    return getMockProfiles({}).slice(0, 3);
  });

  const handleToggleShortlist = (uid: string) => {
    setShortlist((prev) => prev.filter((p) => p.uid !== uid));
  };

  const handleSendInterest = () => {
    alert("ইন্টারেস্ট সফলভাবে পাঠানো হয়েছে!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-input-border">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text">
            পছন্দের বায়োডাটা (শর্টলিস্ট)
          </h1>
          <p className="text-sm text-text-muted mt-1">
            আপনার পছন্দের তালিকায় সংরক্ষিত বায়োডাটা সমূহ ({shortlist.length}টি)
          </p>
        </div>

        <Link
          href="/biodatas"
          className="text-sm font-semibold text-primary hover:underline"
        >
          {nav.biodatas} খুঁজুন →
        </Link>
      </div>

      {shortlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shortlist.map((profile) => (
            <ProfileCard
              key={profile.uid}
              profile={profile}
              isShortlisted={true}
              onToggleShortlist={handleToggleShortlist}
              onSendInterest={handleSendInterest}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-surface rounded-card border border-input-border max-w-lg mx-auto">
          <svg className="w-16 h-16 mx-auto text-accent/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-base font-medium text-text-muted">{empty.shortlist}</p>
          <Link
            href="/biodatas"
            className="inline-block mt-4 px-6 py-2.5 rounded-button bg-primary text-surface text-sm font-semibold hover:bg-primary/90 transition-colors shadow-xs"
          >
            বায়োডাটা অনুসন্ধান করুন
          </Link>
        </div>
      )}
    </div>
  );
}
