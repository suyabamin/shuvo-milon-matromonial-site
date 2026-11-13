"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getCVByUid, saveCVDoc } from "@/features/cv/cvApi";
import { CVDoc } from "@/features/cv/cvSchema";
import { t } from "@/lib/strings";
import Link from "next/link";

const initialCV: CVDoc = {
  uid: "",
  status: "draft",
  templateId: "classic",
  personalInfo: {
    fullName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "male",
    religion: "ইসলাম",
    maritalStatus: "অবিবাহিত",
    height: "5' 6\"",
    weight: "",
    complexion: "উজ্জ্বল শ্যামলা",
    bloodGroup: "B+",
  },
  education: [
    {
      degree: "",
      institution: "",
      passingYear: "",
      result: "",
    },
  ],
  career: [
    {
      designation: "",
      organization: "",
      startYear: "",
      endYear: "",
    },
  ],
  skills: [],
  familyDetails: {
    fatherProfession: "",
    motherProfession: "",
    siblingsInfo: "",
  },
  contactDetails: {
    showPhone: false,
    phone: "",
    email: "",
    permanentAddress: "",
    presentAddress: "",
  },
};

export default function MyCVPage() {
  const { user } = useAuth();
  const cvStrings = t("cv");
  const commonStrings = t("common");

  const [cvData, setCvData] = useState<CVDoc>(initialCV);
  const [step, setStep] = useState<number>(1);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [skillInput, setSkillInput] = useState<string>("");

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let active = true;
    if (!user) return;
    getCVByUid(user.uid).then((doc) => {
      if (!active) return;
      if (doc) {
        setCvData(doc);
      } else {
        setCvData((prev) => ({ ...prev, uid: user.uid }));
      }
    });
    return () => {
      active = false;
    };
  }, [user]);

  const triggerAutoSave = useCallback((data: CVDoc) => {
    if (!data.uid) return;
    setSaveStatus("সেভ হচ্ছে...");
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        await saveCVDoc(data);
        setSaveStatus(cvStrings.autoSaved);
      } catch {
        setSaveStatus("অটো-সেভ ব্যর্থ হয়েছে");
      }
    }, 1000);
  }, [cvStrings.autoSaved]);

  const handleUpdate = (updated: CVDoc) => {
    setCvData(updated);
    triggerAutoSave(updated);
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const updatedSkills = [...cvData.skills, skillInput.trim()];
    handleUpdate({ ...cvData, skills: updatedSkills });
    setSkillInput("");
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = cvData.skills.filter((_, i) => i !== index);
    handleUpdate({ ...cvData, skills: updatedSkills });
  };

  return (
    <main className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-2xl mx-auto bg-surface rounded-card border border-border p-6 shadow-sm">
        {/* Header with Autosave Status */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text">{cvStrings.title}</h1>
            <p className="text-xs text-text-secondary mt-1">ধাপ {step} / ৬</p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus && (
              <span className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">
                {saveStatus}
              </span>
            )}
            <Link
              href="/me/cv/preview"
              className="text-xs px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 font-medium"
            >
              প্রিভিউ ও ডাউনলোড
            </Link>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-between items-center mb-6 overflow-x-auto pb-2 gap-2 text-xs font-medium">
          {["ব্যক্তিগত", "শিক্ষা", "পেশা", "দক্ষতা", "পরিবার", "যোগাযোগ"].map(
            (label, idx) => (
              <button
                key={label}
                onClick={() => setStep(idx + 1)}
                className={`px-3 py-1.5 rounded-full shrink-0 transition-colors ${
                  step === idx + 1
                    ? "bg-primary text-white"
                    : "bg-muted text-text-secondary hover:text-text"
                }`}
              >
                {idx + 1}. {label}
              </button>
            )
          )}
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-text">ব্যক্তিগত তথ্য</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, fullName: e.target.value },
                    })
                  }
                  className="w-full text-sm border border-border rounded-md p-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  জন্ম তারিখ *
                </label>
                <input
                  type="date"
                  value={cvData.personalInfo.dob}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, dob: e.target.value },
                    })
                  }
                  className="w-full text-sm border border-border rounded-md p-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  পিতার নাম *
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.fatherName}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, fatherName: e.target.value },
                    })
                  }
                  className="w-full text-sm border border-border rounded-md p-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  মাতার নাম *
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.motherName}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, motherName: e.target.value },
                    })
                  }
                  className="w-full text-sm border border-border rounded-md p-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  উচ্চতা
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.height}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, height: e.target.value },
                    })
                  }
                  className="w-full text-sm border border-border rounded-md p-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  গাত্রবর্ণ
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.complexion}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, complexion: e.target.value },
                    })
                  }
                  className="w-full text-sm border border-border rounded-md p-2 bg-background"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-text">শিক্ষাগত যোগ্যতা</h2>
            {cvData.education.map((edu, idx) => (
              <div key={idx} className="p-4 border border-border rounded-card space-y-3 bg-muted/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1">
                      ডিগ্রি *
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const copy = [...cvData.education];
                        copy[idx] = { ...copy[idx], degree: e.target.value };
                        handleUpdate({ ...cvData, education: copy });
                      }}
                      className="w-full text-sm border border-border rounded-md p-2 bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1">
                      প্রতিষ্ঠান *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const copy = [...cvData.education];
                        copy[idx] = { ...copy[idx], institution: e.target.value };
                        handleUpdate({ ...cvData, education: copy });
                      }}
                      className="w-full text-sm border border-border rounded-md p-2 bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1">
                      পাসের সাল *
                    </label>
                    <input
                      type="text"
                      value={edu.passingYear}
                      onChange={(e) => {
                        const copy = [...cvData.education];
                        copy[idx] = { ...copy[idx], passingYear: e.target.value };
                        handleUpdate({ ...cvData, education: copy });
                      }}
                      className="w-full text-sm border border-border rounded-md p-2 bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1">
                      ফলাফল / সিজিপিএ
                    </label>
                    <input
                      type="text"
                      value={edu.result || ""}
                      onChange={(e) => {
                        const copy = [...cvData.education];
                        copy[idx] = { ...copy[idx], result: e.target.value };
                        handleUpdate({ ...cvData, education: copy });
                      }}
                      className="w-full text-sm border border-border rounded-md p-2 bg-background"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                handleUpdate({
                  ...cvData,
                  education: [
                    ...cvData.education,
                    { degree: "", institution: "", passingYear: "", result: "" },
                  ],
                });
              }}
              className="text-xs text-primary font-medium hover:underline block"
            >
              + আরও শিক্ষা যোগ করুন
            </button>
          </div>
        )}

        {/* Step 3: Career */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-text">কর্মজীবন / পেশা</h2>
            {cvData.career.map((car, idx) => (
              <div key={idx} className="p-4 border border-border rounded-card space-y-3 bg-muted/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1">
                      পদবী *
                    </label>
                    <input
                      type="text"
                      value={car.designation}
                      onChange={(e) => {
                        const copy = [...cvData.career];
                        copy[idx] = { ...copy[idx], designation: e.target.value };
                        handleUpdate({ ...cvData, career: copy });
                      }}
                      className="w-full text-sm border border-border rounded-md p-2 bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1">
                      প্রতিষ্ঠান *
                    </label>
                    <input
                      type="text"
                      value={car.organization}
                      onChange={(e) => {
                        const copy = [...cvData.career];
                        copy[idx] = { ...copy[idx], organization: e.target.value };
                        handleUpdate({ ...cvData, career: copy });
                      }}
                      className="w-full text-sm border border-border rounded-md p-2 bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1">
                      শুরুর বছর *
                    </label>
                    <input
                      type="text"
                      value={car.startYear}
                      onChange={(e) => {
                        const copy = [...cvData.career];
                        copy[idx] = { ...copy[idx], startYear: e.target.value };
                        handleUpdate({ ...cvData, career: copy });
                      }}
                      className="w-full text-sm border border-border rounded-md p-2 bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1">
                      শেষের বছর (চলমান হলে খালি রাখুন)
                    </label>
                    <input
                      type="text"
                      value={car.endYear || ""}
                      onChange={(e) => {
                        const copy = [...cvData.career];
                        copy[idx] = { ...copy[idx], endYear: e.target.value };
                        handleUpdate({ ...cvData, career: copy });
                      }}
                      className="w-full text-sm border border-border rounded-md p-2 bg-background"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                handleUpdate({
                  ...cvData,
                  career: [
                    ...cvData.career,
                    { designation: "", organization: "", startYear: "", endYear: "" },
                  ],
                });
              }}
              className="text-xs text-primary font-medium hover:underline block"
            >
              + আরও কর্মক্ষেত্র যোগ করুন
            </button>
          </div>
        )}

        {/* Step 4: Skills */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-text">দক্ষতা ও শখ</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="যেমন: কুরআন তিলাওয়াত, ড্রাইভিং, গ্রাফিক্স ডিজাইন"
                className="flex-1 text-sm border border-border rounded-md p-2 bg-background"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
              >
                যোগ করুন
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {cvData.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-muted text-text rounded-full text-xs flex items-center gap-1.5"
                >
                  {s}
                  <button
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-text-secondary hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Family Details */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-text">পারিবারিক তথ্য</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  পিতার পেশা
                </label>
                <input
                  type="text"
                  value={cvData.familyDetails.fatherProfession || ""}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      familyDetails: {
                        ...cvData.familyDetails,
                        fatherProfession: e.target.value,
                      },
                    })
                  }
                  className="w-full text-sm border border-border rounded-md p-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  মাতার পেশা
                </label>
                <input
                  type="text"
                  value={cvData.familyDetails.motherProfession || ""}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      familyDetails: {
                        ...cvData.familyDetails,
                        motherProfession: e.target.value,
                      },
                    })
                  }
                  className="w-full text-sm border border-border rounded-md p-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  ভাই-বোনের বিবরণ
                </label>
                <textarea
                  value={cvData.familyDetails.siblingsInfo || ""}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      familyDetails: {
                        ...cvData.familyDetails,
                        siblingsInfo: e.target.value,
                      },
                    })
                  }
                  placeholder="যেমন: ২ ভাই ও ১ বোন, সবাই প্রতিষ্ঠিত।"
                  className="w-full text-sm border border-border rounded-md p-2 bg-background h-20 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Contact Details */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-text">যোগাযোগের ঠিকানা</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  বর্তমান ঠিকানা *
                </label>
                <input
                  type="text"
                  value={cvData.contactDetails.presentAddress}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      contactDetails: {
                        ...cvData.contactDetails,
                        presentAddress: e.target.value,
                      },
                    })
                  }
                  className="w-full text-sm border border-border rounded-md p-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  স্থায়ী ঠিকানা *
                </label>
                <input
                  type="text"
                  value={cvData.contactDetails.permanentAddress}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      contactDetails: {
                        ...cvData.contactDetails,
                        permanentAddress: e.target.value,
                      },
                    })
                  }
                  className="w-full text-sm border border-border rounded-md p-2 bg-background"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    value={cvData.contactDetails.phone || ""}
                    onChange={(e) =>
                      handleUpdate({
                        ...cvData,
                        contactDetails: {
                          ...cvData.contactDetails,
                          phone: e.target.value,
                        },
                      })
                    }
                    className="w-full text-sm border border-border rounded-md p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={cvData.contactDetails.email || ""}
                    onChange={(e) =>
                      handleUpdate({
                        ...cvData,
                        contactDetails: {
                          ...cvData.contactDetails,
                          email: e.target.value,
                        },
                      })
                    }
                    className="w-full text-sm border border-border rounded-md p-2 bg-background"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="showPhone"
                  checked={cvData.contactDetails.showPhone}
                  onChange={(e) =>
                    handleUpdate({
                      ...cvData,
                      contactDetails: {
                        ...cvData.contactDetails,
                        showPhone: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-border text-primary"
                />
                <label htmlFor="showPhone" className="text-xs text-text">
                  সিভিতে মোবাইল নম্বর দৃশ্যমান রাখুন
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-border">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="px-4 py-2 text-sm text-text-secondary border border-border rounded-md hover:bg-muted disabled:opacity-50"
          >
            {commonStrings.back}
          </button>
          <button
            type="button"
            disabled={step === 6}
            onClick={() => setStep((s) => Math.min(6, s + 1))}
            className="px-5 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium"
          >
            {commonStrings.next}
          </button>
        </div>
      </div>
    </main>
  );
}
