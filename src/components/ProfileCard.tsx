"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProfileCardData } from "@/features/search/searchApi";
import { t } from "@/lib/strings";

interface ProfileCardProps {
  profile: ProfileCardData;
  onSendInterest?: (uid: string) => void;
  onToggleShortlist?: (uid: string) => void;
  isShortlisted?: boolean;
}

export function ProfileCard({
  profile,
  onSendInterest,
  onToggleShortlist,
  isShortlisted = false,
}: ProfileCardProps) {
  const profileStrings = t("profile");
  const [shortlisted, setShortlisted] = useState(isShortlisted);

  const handleShortlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShortlisted(!shortlisted);
    onToggleShortlist?.(profile.uid);
  };

  const handleInterestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSendInterest?.(profile.uid);
  };

  return (
    <div className="group bg-surface rounded-card border border-input-border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      {/* Photo Header */}
      <div className="relative aspect-4/5 w-full bg-bg-soft/60 overflow-hidden">
        {profile.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              profile.photoBlur ? "blur-md scale-110" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-gradient-to-b from-bg-soft to-bg-soft2/50">
            <svg className="w-16 h-16 opacity-40 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-xs mt-2 font-medium">ছবি পর্দা করা</span>
          </div>
        )}

        {/* Verified Badge */}
        {profile.verified && (
          <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-primary flex items-center gap-1 shadow-xs border border-primary/20">
            <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {profileStrings.verified}
          </div>
        )}

        {/* Shortlist Heart Button */}
        <button
          type="button"
          onClick={handleShortlistClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-surface/90 backdrop-blur-xs text-text-muted hover:text-accent shadow-xs transition-colors"
          aria-label={profileStrings.shortlist}
        >
          <svg
            className={`w-4 h-4 ${shortlisted ? "text-accent fill-accent" : "fill-none stroke-current"}`}
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Info Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-heading font-bold text-lg text-text group-hover:text-primary transition-colors">
              {profile.name}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-bg-soft text-primary font-medium">
              {profile.gender === "male" ? "পাত্র" : "পাত্রী"}
            </span>
          </div>

          <div className="space-y-1.5 text-xs sm:text-sm text-text-muted mb-4">
            <div className="flex items-center justify-between">
              <span>{profileStrings.age}: <strong className="text-text font-semibold">{profile.age} বছর</strong></span>
              <span>{profileStrings.height}: <strong className="text-text font-semibold">{profile.height}</strong></span>
            </div>
            <div className="truncate">
              {profileStrings.district}: <span className="text-text">{profile.district}</span>
            </div>
            <div className="truncate">
              {profileStrings.occupation}: <span className="text-text">{profile.occupation}</span>
            </div>
            <div className="truncate">
              {profileStrings.education}: <span className="text-text">{profile.educationLevel}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-input-border grid grid-cols-2 gap-2">
          <Link
            href={`/biodatas/${profile.uid}`}
            className="w-full py-2 px-3 text-center text-xs sm:text-sm font-semibold rounded-button border border-input-border text-primary hover:bg-bg-soft transition-colors flex items-center justify-center"
          >
            বিস্তারিত
          </Link>
          <button
            type="button"
            onClick={handleInterestClick}
            className="w-full py-2 px-3 text-center text-xs sm:text-sm font-semibold rounded-button bg-primary text-surface hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center"
          >
            {profileStrings.sendInterest}
          </button>
        </div>
      </div>
    </div>
  );
}
