"use client";

import React from "react";
import { SearchFilters } from "./filterBuilder";
import { t } from "@/lib/strings";

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (updated: SearchFilters) => void;
  onReset: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  isOpenMobile,
  onCloseMobile,
}: FilterPanelProps) {
  const common = t("common");
  const home = t("home");

  const update = (key: keyof SearchFilters, val: unknown) => {
    onChange({ ...filters, [key]: val });
  };

  const content = (
    <div className="space-y-5">
      {/* Gender */}
      <div>
        <label className="block text-xs font-bold text-text mb-1.5 font-heading">
          {home.searchFor}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => update("gender", "female")}
            className={`py-2 px-3 text-sm rounded-input font-medium border transition-colors ${
              filters.gender === "female"
                ? "bg-primary text-surface border-primary"
                : "bg-surface text-text border-input-border hover:bg-bg-soft/40"
            }`}
          >
            {common.female}
          </button>
          <button
            type="button"
            onClick={() => update("gender", "male")}
            className={`py-2 px-3 text-sm rounded-input font-medium border transition-colors ${
              filters.gender === "male"
                ? "bg-primary text-surface border-primary"
                : "bg-surface text-text border-input-border hover:bg-bg-soft/40"
            }`}
          >
            {common.male}
          </button>
        </div>
      </div>

      {/* Marital Status */}
      <div>
        <label className="block text-xs font-bold text-text mb-1.5 font-heading">
          {home.maritalStatus}
        </label>
        <select
          value={filters.maritalStatus || "all"}
          onChange={(e) => update("maritalStatus", e.target.value as SearchFilters["maritalStatus"])}
          className="w-full px-3 py-2 text-sm rounded-input border border-input-border bg-surface text-text focus:border-primary"
        >
          <option value="all">{common.all}</option>
          <option value="unmarried">অবিবাহিত</option>
          <option value="divorced">ডিভোর্সড</option>
          <option value="widowed">বিধবা/বিপত্নীক</option>
        </select>
      </div>

      {/* District / Location */}
      <div>
        <label className="block text-xs font-bold text-text mb-1.5 font-heading">
          {home.address} (জেলা)
        </label>
        <input
          type="text"
          value={filters.district || ""}
          onChange={(e) => update("district", e.target.value)}
          placeholder="যেমন: ঢাকা"
          className="w-full px-3 py-2 text-sm rounded-input border border-input-border text-text focus:border-primary"
        />
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-xs font-bold text-text mb-1.5 font-heading">
          বয়সের সীমা (১৮ - ৭০)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={18}
            max={70}
            value={filters.minAge || 18}
            onChange={(e) => update("minAge", Number(e.target.value))}
            className="w-full px-2 py-2 text-sm rounded-input border border-input-border text-text text-center focus:border-primary"
          />
          <span className="text-text-muted text-xs">থেকে</span>
          <input
            type="number"
            min={18}
            max={70}
            value={filters.maxAge || 40}
            onChange={(e) => update("maxAge", Number(e.target.value))}
            className="w-full px-2 py-2 text-sm rounded-input border border-input-border text-text text-center focus:border-primary"
          />
        </div>
      </div>

      {/* Occupation */}
      <div>
        <label className="block text-xs font-bold text-text mb-1.5 font-heading">
          পেশা
        </label>
        <input
          type="text"
          value={filters.occupation || ""}
          onChange={(e) => update("occupation", e.target.value)}
          placeholder="যেমন: শিক্ষক, ব্যবসায়ী..."
          className="w-full px-3 py-2 text-sm rounded-input border border-input-border text-text focus:border-primary"
        />
      </div>

      {/* Reset button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full py-2 text-xs font-semibold text-text-muted hover:text-primary transition-colors border border-input-border rounded-input hover:bg-bg-soft/30"
        >
          {common.reset}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Panel */}
      <div className="hidden lg:block w-72 shrink-0 bg-surface p-5 rounded-card border border-input-border shadow-xs self-start sticky top-24">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-input-border">
          <h3 className="font-heading font-bold text-base text-text">ফিল্টার</h3>
        </div>
        {content}
      </div>

      {/* Mobile Bottom Sheet Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative bg-surface rounded-t-card p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-input-border">
              <h3 className="font-heading font-bold text-lg text-text">ফিল্টার করুন</h3>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-button text-text-muted hover:text-text"
              >
                ✕
              </button>
            </div>
            {content}
            <div className="mt-6 pt-3 border-t border-input-border">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3 rounded-button bg-primary text-surface font-semibold text-sm shadow-xs"
              >
                {common.apply}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
