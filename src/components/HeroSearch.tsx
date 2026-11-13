"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { t } from "@/lib/strings";

export function HeroSearch() {
  const router = useRouter();
  const home = t("home");
  const common = t("common");

  const [gender, setGender] = useState<string>("female");
  const [maritalStatus, setMaritalStatus] = useState<string>("all");
  const [district, setDistrict] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (gender) params.set("gender", gender);
    if (maritalStatus !== "all") params.set("maritalStatus", maritalStatus);
    if (district) params.set("district", district);
    router.push(`/biodatas?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-bg-soft via-bg-soft2/40 to-surface py-12 md:py-20">
      {/* Decorative background aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          {/* Hadith / Quote Box */}
          <div className="inline-block p-4 sm:p-5 rounded-card border border-dashed border-border bg-surface/80 backdrop-blur-xs mb-6 shadow-xs max-w-2xl">
            <p className="text-sm sm:text-base text-text italic leading-relaxed font-body">
              &ldquo;{home.hadithQuote}&rdquo;
            </p>
            <p className="text-xs font-semibold text-primary mt-2">
              {home.hadithSource}
            </p>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-primary tracking-tight">
            {home.title1} <span className="text-accent">{home.title2}</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-text-muted mt-3">
            {home.subtitle}
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-4xl mx-auto bg-surface p-5 sm:p-8 rounded-card border border-input-border shadow-xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text mb-1.5 font-heading">
                {home.searchFor}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-sm sm:text-base bg-surface h-12"
              >
                <option value="female">{common.female}</option>
                <option value="male">{common.male}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text mb-1.5 font-heading">
                {home.maritalStatus}
              </label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-sm sm:text-base bg-surface h-12"
              >
                <option value="all">{common.all}</option>
                <option value="unmarried">অবিবাহিত</option>
                <option value="divorced">ডিভোর্সড</option>
                <option value="widowed">বিধবা / বিপত্নীক</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text mb-1.5 font-heading">
                {home.address} (জেলা)
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="যেমন: ঢাকা, সিলেট..."
                className="w-full px-3.5 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-sm sm:text-base h-12"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full h-12 rounded-button bg-primary text-surface font-semibold hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {home.searchBtn}
              </button>
            </div>
          </form>

          {/* Secondary Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-input-border text-sm">
            <Link
              href="/biodatas"
              className="text-primary font-semibold hover:underline flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {home.allFilters}
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-accent text-surface font-semibold hover:bg-accent/90 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              {home.createCta}
            </Link>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mt-12 sm:mt-16 text-center">
          <div className="bg-surface/90 p-4 sm:p-5 rounded-card border border-input-border shadow-xs">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-primary">৩,৪৫০+</div>
            <div className="text-xs sm:text-sm text-text-muted mt-1">{home.stats.totalBiodata}</div>
          </div>
          <div className="bg-surface/90 p-4 sm:p-5 rounded-card border border-input-border shadow-xs">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-primary">১,৮২০+</div>
            <div className="text-xs sm:text-sm text-text-muted mt-1">{home.stats.grooms}</div>
          </div>
          <div className="bg-surface/90 p-4 sm:p-5 rounded-card border border-input-border shadow-xs">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-primary">১,৬৩০+</div>
            <div className="text-xs sm:text-sm text-text-muted mt-1">{home.stats.brides}</div>
          </div>
          <div className="bg-surface/90 p-4 sm:p-5 rounded-card border border-input-border shadow-xs">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-accent">৫২০+</div>
            <div className="text-xs sm:text-sm text-text-muted mt-1">{home.stats.successfulMarriages}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
