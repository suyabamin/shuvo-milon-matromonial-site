"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/strings";

export default function PrivacySettingsPage() {
  const router = useRouter();
  const common = t("common");

  const [phoneVisibility, setPhoneVisibility] = useState<"match_only" | "guardian_verified">("match_only");
  const [photoVisibility, setPhotoVisibility] = useState<"all" | "blurred" | "accepted_only">("blurred");
  const [profileStatus, setProfileStatus] = useState<"published" | "hidden">("published");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      router.push("/me");
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-surface p-6 sm:p-8 rounded-card border border-input-border shadow-md">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-text">
            প্রাইভেসি ও নিরাপত্তা সেটিংস
          </h1>
          <p className="text-sm text-text-muted mt-1">
            আপনার ব্যক্তিগত তথ্যের নিরাপত্তা ও দৃশ্যমানতা নিয়ন্ত্রণ করুন
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-input bg-success/10 text-success text-sm font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            সেটিংস সফলভাবে সংরক্ষিত হয়েছে!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Phone Privacy */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-text font-heading">
              ফোন নম্বর ও অভিভাবকের যোগাযোগ
            </h2>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded-input border border-input-border hover:bg-bg-soft/20 cursor-pointer">
                <input
                  type="radio"
                  name="phoneVis"
                  value="match_only"
                  checked={phoneVisibility === "match_only"}
                  onChange={() => setPhoneVisibility("match_only")}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div className="text-sm">
                  <div className="font-medium text-text">শুধুমাত্র ম্যাচ হওয়ার পর (প্রস্তাব গ্রহণ)</div>
                  <div className="text-xs text-text-muted">উভয়পক্ষ সম্মত হলে অভিভাবকের যোগাযোগ তথ্য শেয়ার হবে।</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-input border border-input-border hover:bg-bg-soft/20 cursor-pointer">
                <input
                  type="radio"
                  name="phoneVis"
                  value="guardian_verified"
                  checked={phoneVisibility === "guardian_verified"}
                  onChange={() => setPhoneVisibility("guardian_verified")}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div className="text-sm">
                  <div className="font-medium text-text">অভিভাবক কর্তৃক যাচাইকৃত প্রার্থীদের জন্য</div>
                  <div className="text-xs text-text-muted">উচ্চতর প্রাইভেসি প্রোটেকশন।</div>
                </div>
              </label>
            </div>
          </div>

          {/* Photo Visibility */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-text font-heading">
              ছবি প্রদর্শনের নিয়ম
            </h2>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded-input border border-input-border hover:bg-bg-soft/20 cursor-pointer">
                <input
                  type="radio"
                  name="photoVis"
                  value="blurred"
                  checked={photoVisibility === "blurred"}
                  onChange={() => setPhotoVisibility("blurred")}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div className="text-sm">
                  <div className="font-medium text-text">ব্লার থাকবে (রিকমেন্ডেড)</div>
                  <div className="text-xs text-text-muted">ম্যাচ বা অনুমোদন সাপেক্ষে মূল ছবি দৃশ্যমান হবে।</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-input border border-input-border hover:bg-bg-soft/20 cursor-pointer">
                <input
                  type="radio"
                  name="photoVis"
                  value="all"
                  checked={photoVisibility === "all"}
                  onChange={() => setPhotoVisibility("all")}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div className="text-sm">
                  <div className="font-medium text-text">সকলের জন্য উন্মুক্ত</div>
                  <div className="text-xs text-text-muted">পাবলিক সার্চে সরাসরি স্পষ্ট ছবি দেখা যাবে।</div>
                </div>
              </label>
            </div>
          </div>

          {/* Profile Status */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-text font-heading">
              বায়োডাটার দৃশ্যমানতা
            </h2>
            <select
              value={profileStatus}
              onChange={(e) => setProfileStatus(e.target.value as "published" | "hidden")}
              className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base bg-surface"
            >
              <option value="published">প্রকাশিত (পাবলিক সার্চে দেখা যাবে)</option>
              <option value="hidden">লুকায়িত (সাময়িকভাবে বন্ধ রাখুন)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-input-border flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-button border border-input-border font-medium text-text hover:bg-bg-soft transition-colors h-11"
            >
              {common.back}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-button bg-primary text-surface font-semibold hover:bg-primary/90 transition-colors shadow-xs h-11"
            >
              {common.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
