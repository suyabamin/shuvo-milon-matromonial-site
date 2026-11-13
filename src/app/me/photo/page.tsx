"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/strings";

export default function PhotoUploadPage() {
  const router = useRouter();
  const common = t("common");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blurOption, setBlurOption] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("ছবির সর্বোচ্চ সাইজ ৫ মেগাবাইট হতে হবে");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("শুধুমাত্র JPG, PNG বা WEBP ছবি গ্রহণযোগ্য");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("অনুগ্রহ করে একটি ছবি নির্বাচন করুন");
      return;
    }

    setUploading(true);
    setError(null);

    // Simulate signed upload pipeline
    setTimeout(() => {
      setUploading(false);
      router.push("/me/privacy");
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-surface p-6 sm:p-8 rounded-card border border-input-border shadow-md">
        <div className="text-center mb-6">
          <h1 className="font-heading font-bold text-2xl text-text">
            ছবি আপলোড ও গোপনীয়তা
          </h1>
          <p className="text-sm text-text-muted mt-1">
            শারীরিক গঠন ও শালীন পোশাক পরিহিত স্পষ্ট ছবি যুক্ত করুন
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-input bg-error/10 text-error text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Dropzone / Selector */}
          <div className="border-2 border-dashed border-border rounded-card p-6 text-center hover:bg-bg-soft/40 transition-colors">
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-48 rounded-button overflow-hidden mb-3 border border-input-border shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="প্রোফাইল ছবির প্রিভিউ"
                    className={`w-full h-full object-cover transition-all ${
                      blurOption ? "blur-md scale-105" : ""
                    }`}
                  />
                  {blurOption && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center text-xs font-semibold text-surface">
                      ব্লার প্রিভিউ
                    </div>
                  )}
                </div>
                <label className="text-xs text-primary font-semibold hover:underline cursor-pointer">
                  অন্য ছবি বেছে নিন
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-primary">
                  ছবি আপলোড করতে ক্লিক করুন
                </span>
                <span className="text-xs text-text-muted mt-1">
                  JPG, PNG অথবা WEBP (সর্বোচ্চ ৫ মেগাবাইট)
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Privacy Option Toggle */}
          <div className="bg-bg-soft/40 p-4 rounded-card border border-input-border space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={blurOption}
                onChange={(e) => setBlurOption(e.target.checked)}
                className="mt-1 h-4 w-4 rounded-xs text-primary focus:ring-primary border-input-border"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text">
                  ছবি ব্লার রাখুন (পর্দা রক্ষা)
                </span>
                <span className="text-xs text-text-muted">
                  সাধারণ ব্রাউজিংয়ে আপনার ছবি অস্পষ্ট দেখাবে। শুধুমাত্র ম্যাচিং ও অনুমতি সাপেক্ষে স্পষ্ট দেখা যাবে।
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-button border border-input-border font-medium text-text hover:bg-bg-soft transition-colors h-11"
            >
              {common.back}
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2.5 rounded-button bg-primary text-surface font-semibold hover:bg-primary/90 transition-colors shadow-xs h-11 disabled:opacity-60"
            >
              {uploading ? common.loading : common.next}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
