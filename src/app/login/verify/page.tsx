"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { t, formatString } from "@/lib/strings";

export default function VerifyOtpPage() {
  const router = useRouter();
  const authStrings = t("auth");
  const common = t("common");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [phoneNumber] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("login_phone") || "";
    }
    return "";
  });
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("সম্পূর্ণ ৬ ডিজিটের ওটিপি কোড দিন");
      return;
    }

    setLoading(true);
    setError(null);

    // Mock/emulator OTP verify or proceed to session
    setTimeout(() => {
      setLoading(false);
      // Route to create or profile after verification
      router.push("/create");
    }, 800);
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="font-heading font-bold text-2xl text-text">
            {authStrings.enterOtp}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {phoneNumber ? `${phoneNumber} নম্বরে কোড পাঠানো হয়েছে` : authStrings.loginSubtitle}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-input border border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-text bg-surface"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-error text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-button bg-primary text-surface font-semibold hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center disabled:opacity-60"
          >
            {loading ? common.loading : authStrings.verifyOtp}
          </button>
        </form>

        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-xs text-text-muted">
              {formatString(authStrings.resendIn, { seconds: timer })}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setTimer(60)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {authStrings.sendOtp}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
