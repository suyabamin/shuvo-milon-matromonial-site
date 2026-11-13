"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/strings";
import { bdPhoneSchema } from "@/lib/phone";

export default function LoginPage() {
  const router = useRouter();
  const authStrings = t("auth");
  const common = t("common");

  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = bdPhoneSchema.safeParse(phone);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "সঠিক নম্বর দিন");
      return;
    }

    setLoading(true);
    // Store phone number for OTP verification step
    if (typeof window !== "undefined") {
      sessionStorage.setItem("login_phone", parsed.data);
    }
    router.push("/login/verify");
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-bg-soft/30">
      <div className="w-full max-w-md bg-surface p-6 sm:p-8 rounded-card border border-input-border shadow-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-button bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
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
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="font-heading font-bold text-2xl text-text">
            {authStrings.loginTitle}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {authStrings.loginSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="phone-input"
              className="block text-sm font-medium text-text mb-1"
            >
              {authStrings.phoneLabel}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted text-sm font-medium select-none">
                +88
              </span>
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full pl-12 pr-4 py-3 rounded-input border border-input-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden text-text text-base bg-surface"
                autoComplete="tel"
                required
              />
            </div>
            {error && (
              <p className="text-xs text-error mt-1.5 font-medium">{error}</p>
            )}
          </div>

          <div id="recaptcha-container" />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-button bg-primary text-surface font-semibold hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center disabled:opacity-60"
          >
            {loading ? common.loading : authStrings.sendOtp}
          </button>
        </form>

        <p className="text-xs text-center text-text-muted mt-6">
          {authStrings.recaptchaNote}
        </p>
      </div>
    </div>
  );
}
