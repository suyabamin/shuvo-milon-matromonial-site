"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import { getCVByUid } from "@/features/cv/cvApi";
import { CVDoc } from "@/features/cv/cvSchema";
import { t } from "@/lib/strings";
import Link from "next/link";

const sampleCV: CVDoc = {
  uid: "sample",
  status: "published",
  templateId: "classic",
  personalInfo: {
    fullName: "মুহাম্মদ আব্দুল্লাহ",
    fatherName: "আব্দুল করিম",
    motherName: "রাবেয়া বেগম",
    dob: "১৯৯৮-০৫-১৫",
    gender: "male",
    religion: "ইসলাম",
    maritalStatus: "অবিবাহিত",
    height: "৫' ৭\"",
    weight: "৬৮ কেজি",
    complexion: "উজ্জ্বল শ্যামলা",
    bloodGroup: "B+",
  },
  education: [
    {
      degree: "বিএসসি ইন কম্পিউটার সায়েন্স",
      institution: "ঢাকা বিশ্ববিদ্যালয়",
      passingYear: "২০২০",
      result: "৩.৭৫",
    },
  ],
  career: [
    {
      designation: "সফটওয়্যার ডেভেলপার",
      organization: "টেক সল্যুশনস লিমিটেড",
      startYear: "২০২১",
      endYear: "",
    },
  ],
  skills: ["কুরআন তিলাওয়াত", "সফটওয়্যার ডেভেলপমেন্ট", "ড্রাইভিং"],
  familyDetails: {
    fatherProfession: "অবসরপ্রাপ্ত সরকারি কর্মকর্তা",
    motherProfession: "গৃহিনী",
    siblingsInfo: "১ ভাই ও ২ বোন",
  },
  contactDetails: {
    showPhone: true,
    phone: "+৮৮০১৭১২-৩৪৫৬৭৮",
    email: "abdullah@example.com",
    permanentAddress: "কালিয়াকৈর, গাজীপুর",
    presentAddress: "মিরপুর, ঢাকা",
  },
};

function CVPreviewContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const cvStrings = t("cv");
  const commonStrings = t("common");

  const [cv, setCv] = useState<CVDoc>(sampleCV);
  const [template, setTemplate] = useState<"classic" | "minimal" | "modern">("classic");
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetUid = searchParams.get("uid") || user?.uid;
    if (targetUid) {
      getCVByUid(targetUid).then((doc) => {
        if (doc) {
          setCv(doc);
          if (doc.templateId) setTemplate(doc.templateId);
        }
      });
    }
  }, [searchParams, user]);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setDownloading(true);

    try {
      // Dynamic import to prevent SSR issues with html2pdf
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default;

      const opt = {
        margin: 10,
        filename: `CV_${cv.personalInfo.fullName || "Biodata"}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
      };

      await html2pdf().set(opt).from(previewRef.current).save();
    } catch {
      // fallback
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top Bar with Template Selector and Download */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-surface p-4 rounded-card border border-border">
        <div className="flex items-center gap-3">
          <Link href="/me/cv" className="text-xs text-text-secondary hover:text-text font-medium">
            ← {commonStrings.back} (সম্পাদনা)
          </Link>
          <span className="text-sm font-semibold text-text">{cvStrings.template}:</span>
          <div className="flex gap-1.5">
            {(["classic", "minimal", "modern"] as const).map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => setTemplate(tmpl)}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${
                  template === tmpl
                    ? "bg-primary text-white font-medium"
                    : "bg-muted text-text-secondary hover:text-text"
                }`}
              >
                {tmpl === "classic" ? "ক্লাসিক" : tmpl === "minimal" ? "মিনিমাল" : "মডার্ন"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="w-full sm:w-auto px-5 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {downloading ? "প্রস্তুত হচ্ছে..." : `📥 ${cvStrings.download}`}
        </button>
      </div>

      {/* CV Paper Preview */}
      <div
        ref={previewRef}
        className={`bg-white text-gray-900 p-8 sm:p-12 rounded-card shadow-md border border-gray-200 min-h-[1000px] ${
          template === "minimal"
            ? "font-sans border-t-4 border-t-gray-700"
            : template === "modern"
            ? "font-sans border-t-8 border-t-emerald-600"
            : "font-serif border-t-8 border-t-primary"
        }`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {cv.personalInfo.fullName || "পূর্ণ নাম"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {cv.career[0]?.designation
              ? `${cv.career[0].designation} | `
              : ""}
            {cv.personalInfo.religion} | {cv.personalInfo.maritalStatus}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
            {cv.contactDetails.showPhone && cv.contactDetails.phone && (
              <span>📞 {cv.contactDetails.phone}</span>
            )}
            {cv.contactDetails.email && <span>✉️ {cv.contactDetails.email}</span>}
            {cv.contactDetails.presentAddress && (
              <span>📍 {cv.contactDetails.presentAddress}</span>
            )}
          </div>
        </div>

        {/* 2-column or structured body */}
        <div className="space-y-6 text-sm">
          {/* Personal & Physical Information */}
          <section>
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-1 mb-3">
              ব্যক্তিগত তথ্য
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
              <div>
                <span className="text-gray-500">পিতার নাম:</span>{" "}
                <strong className="text-gray-800">{cv.personalInfo.fatherName}</strong>
              </div>
              <div>
                <span className="text-gray-500">মাতার নাম:</span>{" "}
                <strong className="text-gray-800">{cv.personalInfo.motherName}</strong>
              </div>
              <div>
                <span className="text-gray-500">জন্ম তারিখ:</span>{" "}
                <strong className="text-gray-800">{cv.personalInfo.dob}</strong>
              </div>
              <div>
                <span className="text-gray-500">উচ্চতা:</span>{" "}
                <strong className="text-gray-800">{cv.personalInfo.height}</strong>
              </div>
              <div>
                <span className="text-gray-500">শারীরিক ওজন:</span>{" "}
                <strong className="text-gray-800">{cv.personalInfo.weight || "—"}</strong>
              </div>
              <div>
                <span className="text-gray-500">গায়ের রঙ:</span>{" "}
                <strong className="text-gray-800">{cv.personalInfo.complexion}</strong>
              </div>
              <div>
                <span className="text-gray-500">রক্তের গ্রুপ:</span>{" "}
                <strong className="text-gray-800">{cv.personalInfo.bloodGroup || "—"}</strong>
              </div>
            </div>
          </section>

          {/* Education */}
          {cv.education.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-1 mb-3">
                শিক্ষাগত যোগ্যতা
              </h2>
              <div className="space-y-2">
                {cv.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-xs">
                    <div>
                      <strong className="text-gray-900 block">{edu.degree}</strong>
                      <span className="text-gray-600">{edu.institution}</span>
                    </div>
                    <div className="text-right text-gray-500">
                      <span>{edu.passingYear}</span>
                      {edu.result && <span className="block font-medium">সিজিপিএ: {edu.result}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Career */}
          {cv.career.length > 0 && cv.career[0].organization && (
            <section>
              <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-1 mb-3">
                কর্মজীবন
              </h2>
              <div className="space-y-2">
                {cv.career.map((car, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-xs">
                    <div>
                      <strong className="text-gray-900 block">{car.designation}</strong>
                      <span className="text-gray-600">{car.organization}</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {car.startYear} - {car.endYear || "বর্তমান"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Family */}
          <section>
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-1 mb-3">
              পারিবারিক তথ্য
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">পিতার পেশা:</span>{" "}
                <strong className="text-gray-800">{cv.familyDetails.fatherProfession || "—"}</strong>
              </div>
              <div>
                <span className="text-gray-500">মাতার পেশা:</span>{" "}
                <strong className="text-gray-800">{cv.familyDetails.motherProfession || "—"}</strong>
              </div>
              <div className="col-span-full">
                <span className="text-gray-500">ভাই-বোনের বিবরণ:</span>{" "}
                <strong className="text-gray-800">{cv.familyDetails.siblingsInfo || "—"}</strong>
              </div>
            </div>
          </section>

          {/* Skills */}
          {cv.skills.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-1 mb-3">
                দক্ষতা ও অন্যান্য
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Addresses */}
          <section>
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-1 mb-3">
              ঠিকানা
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500 block">বর্তমান ঠিকানা:</span>
                <span className="text-gray-800">{cv.contactDetails.presentAddress}</span>
              </div>
              <div>
                <span className="text-gray-500 block">স্থায়ী ঠিকানা:</span>
                <span className="text-gray-800">{cv.contactDetails.permanentAddress}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CVPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary text-sm">
          লোড হচ্ছে...
        </div>
      }
    >
      <CVPreviewContent />
    </Suspense>
  );
}
