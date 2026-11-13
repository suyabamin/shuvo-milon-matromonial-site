"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/strings";
import { ProfileWizardData } from "@/features/profile/profileSchema";

export default function CreateBiodataPage() {
  const router = useRouter();
  const common = t("common");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProfileWizardData>>({
    country: "বাংলাদেশ",
    religion: "Islam",
    gender: "male",
    maritalStatus: "unmarried",
  });
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof ProfileWizardData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.name || !formData.dateOfBirth) {
        setError("অনুগ্রহ করে নাম ও জন্ম তারিখ দিন");
        return;
      }
    } else if (step === 2) {
      if (!formData.sect || !formData.religiousPractice) {
        setError("ধর্মীয় তথ্যাদি পূরণ করুন");
        return;
      }
    } else if (step === 3) {
      if (!formData.division || !formData.district || !formData.upazila) {
        setError("ঠিকানার সকল তথ্য দিন");
        return;
      }
    } else if (step === 4) {
      if (!formData.educationLevel || !formData.occupation) {
        setError("শিক্ষা ও পেশার তথ্য দিন");
        return;
      }
      // Save and navigate to photo upload step
      router.push("/me/photo");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-surface p-6 sm:p-8 rounded-card border border-input-border shadow-md">
        {/* Step indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted mb-2">
            <span>ধাপ {step} / ৪</span>
            <span>
              {step === 1 && "মৌলিক তথ্য"}
              {step === 2 && "ধর্ম ও চর্চা"}
              {step === 3 && "ঠিকানা"}
              {step === 4 && "শিক্ষা ও পেশা"}
            </span>
          </div>
          <div className="w-full bg-input-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-input bg-error/10 text-error text-sm font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-xl text-text">মৌলিক তথ্য</h2>
            <div>
              <label className="block text-sm font-medium text-text mb-1">পূর্ণ নাম</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ"
                className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">লিঙ্গ</label>
                <select
                  value={formData.gender || "male"}
                  onChange={(e) => updateField("gender", e.target.value as "male" | "female")}
                  className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base bg-surface"
                >
                  <option value="male">{common.male}</option>
                  <option value="female">{common.female}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">বৈবাহিক অবস্থা</label>
                <select
                  value={formData.maritalStatus || "unmarried"}
                  onChange={(e) => updateField("maritalStatus", e.target.value as "unmarried" | "divorced" | "widowed")}
                  className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base bg-surface"
                >
                  <option value="unmarried">অবিবাহিত</option>
                  <option value="divorced">ডিভোর্সড</option>
                  <option value="widowed">বিধবা/বিপত্নীক</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">জন্ম তারিখ</label>
              <input
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
              />
            </div>
          </div>
        )}

        {/* Step 2: Religious Info */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-xl text-text">ধর্মীয় তথ্য</h2>
            <div>
              <label className="block text-sm font-medium text-text mb-1">মাযহাব / ধারা</label>
              <input
                type="text"
                value={formData.sect || ""}
                onChange={(e) => updateField("sect", e.target.value)}
                placeholder="যেমন: হানাফি / সালাফি"
                className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">ধর্মীয় চর্চা ও জীবনযাপন</label>
              <textarea
                value={formData.religiousPractice || ""}
                onChange={(e) => updateField("religiousPractice", e.target.value)}
                rows={3}
                placeholder="যেমন: নিয়মিত ৫ ওয়াক্ত নামাজ, সুন্নাহ অনুযায়ী দাড়ি/পর্দা বজায় রাখা"
                className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
              />
            </div>
          </div>
        )}

        {/* Step 3: Address */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-xl text-text">ঠিকানা</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-text mb-1">বিভাগ</label>
                <input
                  type="text"
                  value={formData.division || ""}
                  onChange={(e) => updateField("division", e.target.value)}
                  placeholder="ঢাকা"
                  className="w-full px-3 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">জেলা</label>
                <input
                  type="text"
                  value={formData.district || ""}
                  onChange={(e) => updateField("district", e.target.value)}
                  placeholder="গাজীপুর"
                  className="w-full px-3 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">উপজেলা</label>
                <input
                  type="text"
                  value={formData.upazila || ""}
                  onChange={(e) => updateField("upazila", e.target.value)}
                  placeholder="কালিয়াকৈর"
                  className="w-full px-3 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Education & Occupation */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-xl text-text">শিক্ষা ও পেশা</h2>
            <div>
              <label className="block text-sm font-medium text-text mb-1">শিক্ষাগত যোগ্যতা</label>
              <input
                type="text"
                value={formData.educationLevel || ""}
                onChange={(e) => updateField("educationLevel", e.target.value)}
                placeholder="যেমন: স্নাতক / কামিল / ইঞ্জিনিয়ার"
                className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">শিক্ষা প্রতিষ্ঠান (ঐচ্ছিক)</label>
              <input
                type="text"
                value={formData.institution || ""}
                onChange={(e) => updateField("institution", e.target.value)}
                placeholder="প্রতিষ্ঠানের নাম"
                className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">পেশা</label>
                <input
                  type="text"
                  value={formData.occupation || ""}
                  onChange={(e) => updateField("occupation", e.target.value)}
                  placeholder="যেমন: সফটওয়্যার ইঞ্জিনিয়ার"
                  className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">মাসিক আয় (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={formData.monthlyIncome || ""}
                  onChange={(e) => updateField("monthlyIncome", e.target.value)}
                  placeholder="যেমন: ৫০,০০০ - ৭০,০০০ টাকা"
                  className="w-full px-4 py-2.5 rounded-input border border-input-border focus:border-primary text-text text-base"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-input-border">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2.5 rounded-button border border-input-border font-medium text-text hover:bg-bg-soft transition-colors h-11"
            >
              {common.back}
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-button bg-primary text-surface font-semibold hover:bg-primary/90 transition-colors shadow-xs h-11"
          >
            {step === 4 ? common.save : common.next}
          </button>
        </div>
      </div>
    </div>
  );
}
