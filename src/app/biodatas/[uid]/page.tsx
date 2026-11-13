export async function generateStaticParams() {
  return [
    { uid: "profile-101" },
    { uid: "profile-102" },
    { uid: "profile-103" },
    { uid: "profile-104" },
    { uid: "profile-105" },
    { uid: "profile-106" },
  ];
}

import React from "react";
import Link from "next/link";
import { t } from "@/lib/strings";

interface ProfileDetailParams {
  params: Promise<{ uid: string }>;
}

export default async function BiodataDetailPage({ params }: ProfileDetailParams) {
  const { uid } = await params;
  const profileStrings = t("profile");
  const common = t("common");

  // Mock biodata detail representation
  const profile = {
    uid,
    name: uid === "profile-102" ? "ফাতেমা জান্নাত" : "মুহাম্মদ আব্দুল্লাহ",
    gender: uid === "profile-102" ? "female" : "male",
    age: 26,
    height: "5' 7\"",
    weightKg: 68,
    bloodGroup: "B+",
    complexion: "উজ্জ্বল শ্যামলা",
    maritalStatus: "অবিবাহিত",
    religion: "ইসলাম",
    sect: "সুন্নি / হানাফি",
    religiousPractice: "নিয়মিত পাঁচ ওয়াক্ত জামাতে নামাজ আদায়, সুন্নাহর অনুসারী।",
    division: "ঢাকা",
    district: "গাজীপুর",
    upazila: "কালিয়াকৈর",
    educationLevel: "বিএসসি ইন কম্পিউটার সায়েন্স",
    institution: "ঢাকা বিশ্ববিদ্যালয়",
    occupation: "সফটওয়্যার ডেভেলপার",
    monthlyIncome: "৮০,০০০+ টাকা",
    familyStatus: "মধ্যবিত্ত দ্বীনদার পরিবার",
    fatherStatus: "জীবিত (অবসরপ্রাপ্ত সরকারি কর্মকর্তা)",
    motherStatus: "জীবিত (গৃহিনী)",
    brothers: 1,
    sisters: 2,
    photoBlur: true,
    verified: true,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-surface rounded-card border border-input-border shadow-md overflow-hidden">
        {/* Header Profile Summary */}
        <div className="bg-gradient-to-r from-bg-soft via-bg-soft2/50 to-surface p-6 sm:p-8 border-b border-input-border flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-32 h-36 rounded-button overflow-hidden bg-surface border border-input-border shadow-xs shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 text-primary opacity-40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            {profile.photoBlur && (
              <span className="absolute bottom-1 bg-surface/90 px-2 py-0.5 rounded-full text-[10px] font-bold text-primary">
                পর্দা রক্ষিত
              </span>
            )}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-text">
                {profile.name}
              </h1>
              {profile.verified && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1 border border-primary/20">
                  <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {profileStrings.verified}
                </span>
              )}
            </div>
            <p className="text-sm text-text-muted">
              {profile.age} বছর • {profile.height} • {profile.occupation} • {profile.district}
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-button bg-primary text-surface font-semibold text-sm shadow-xs hover:bg-primary/90 transition-colors"
            >
              {profileStrings.sendInterest}
            </button>
            <button
              type="button"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-button border border-input-border text-text font-semibold text-sm hover:bg-bg-soft transition-colors"
            >
              {profileStrings.shortlist}
            </button>
          </div>
        </div>

        {/* Sensitive Information Banner */}
        <div className="m-6 p-4 rounded-card bg-bg-soft/40 border border-dashed border-border flex items-center gap-3">
          <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div className="text-xs sm:text-sm text-text">
            <strong className="font-semibold text-primary">{profileStrings.contactHidden}।</strong>{" "}
            প্রস্তাব গ্রহণ ও উভয় পরিবারের সম্মতির পর অভিভাবকের মোবাইল নম্বর দেখতে পারবেন।
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Basic & Physical */}
          <div>
            <h2 className="font-heading font-bold text-lg text-text border-b border-input-border pb-2 mb-4">
              মৌলিক ও শারীরিক তথ্য
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-text-muted block text-xs">বৈবাহিক অবস্থা</span>
                <span className="font-medium text-text">{profile.maritalStatus}</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">উচ্চতা</span>
                <span className="font-medium text-text">{profile.height}</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">শারীরিক ওজন</span>
                <span className="font-medium text-text">{profile.weightKg} কেজি</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">গায়ের রঙ</span>
                <span className="font-medium text-text">{profile.complexion}</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">রক্তের গ্রুপ</span>
                <span className="font-medium text-text">{profile.bloodGroup}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Religious Practice */}
          <div>
            <h2 className="font-heading font-bold text-lg text-text border-b border-input-border pb-2 mb-4">
              ধর্মীয় তথ্য ও চর্চা
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-text-muted block text-xs">ধর্ম ও মাযহাব</span>
                <span className="font-medium text-text">{profile.religion} ({profile.sect})</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">ধর্মীয় দৈনন্দিন চর্চা</span>
                <p className="font-medium text-text leading-relaxed mt-0.5">{profile.religiousPractice}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Education & Career */}
          <div>
            <h2 className="font-heading font-bold text-lg text-text border-b border-input-border pb-2 mb-4">
              শিক্ষা ও কর্মজীবন
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-muted block text-xs">শিক্ষাগত যোগ্যতা</span>
                <span className="font-medium text-text">{profile.educationLevel}</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">শিক্ষা প্রতিষ্ঠান</span>
                <span className="font-medium text-text">{profile.institution}</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">বর্তমান পেশা</span>
                <span className="font-medium text-text">{profile.occupation}</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">মাসিক আয়</span>
                <span className="font-medium text-text">{profile.monthlyIncome}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Family */}
          <div>
            <h2 className="font-heading font-bold text-lg text-text border-b border-input-border pb-2 mb-4">
              পারিবারিক তথ্য
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-muted block text-xs">পিতার অবস্থা</span>
                <span className="font-medium text-text">{profile.fatherStatus}</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">মাতার অবস্থা</span>
                <span className="font-medium text-text">{profile.motherStatus}</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">ভাই-বোনের সংখ্যা</span>
                <span className="font-medium text-text">{profile.brothers} ভাই, {profile.sisters} বোন</span>
              </div>
              <div>
                <span className="text-text-muted block text-xs">পারিবারিক আর্থিক অবস্থান</span>
                <span className="font-medium text-text">{profile.familyStatus}</span>
              </div>
            </div>
          </div>

          {/* Section 5: CV Information */}
          <div className="pt-4 border-t border-input-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-lg text-text">
                  সম্পূর্ণ কারিকুলাম ভিটা (সিভি)
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  এই প্রার্থীর বিস্তারিত শিক্ষা, ক্যারিয়ার ও পারিবারিক বৃত্তান্ত
                </p>
              </div>
              <Link
                href={`/me/cv/preview?uid=${profile.uid}`}
                className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-md text-sm font-medium hover:bg-primary hover:text-white transition-colors"
              >
                সিভি দেখুন
              </Link>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="p-6 bg-bg-soft/20 border-t border-input-border flex items-center justify-between">
          <Link
            href="/biodatas"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
          >
            ← {common.back} (সকল বায়োডাটা)
          </Link>
        </div>
      </div>
    </div>
  );
}
