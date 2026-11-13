import { t } from "@/lib/strings";

export default function GuidePage() {
  const howItWorks = t("home").howItWorks;

  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto bg-surface rounded-card border border-border p-6 sm:p-10 shadow-sm space-y-6">
        <h1 className="text-3xl font-bold text-text">{howItWorks.title}</h1>
        <p className="text-text-secondary">{howItWorks.subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-4 border border-border rounded-md bg-muted/10 space-y-2">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              ১
            </span>
            <h3 className="font-semibold text-text">{howItWorks.step1Title}</h3>
            <p className="text-xs text-text-secondary">{howItWorks.step1Desc}</p>
          </div>

          <div className="p-4 border border-border rounded-md bg-muted/10 space-y-2">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              ২
            </span>
            <h3 className="font-semibold text-text">{howItWorks.step2Title}</h3>
            <p className="text-xs text-text-secondary">{howItWorks.step2Desc}</p>
          </div>

          <div className="p-4 border border-border rounded-md bg-muted/10 space-y-2">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              ৩
            </span>
            <h3 className="font-semibold text-text">{howItWorks.step3Title}</h3>
            <p className="text-xs text-text-secondary">{howItWorks.step3Desc}</p>
          </div>

          <div className="p-4 border border-border rounded-md bg-muted/10 space-y-2">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              ৪
            </span>
            <h3 className="font-semibold text-text">{howItWorks.step4Title}</h3>
            <p className="text-xs text-text-secondary">{howItWorks.step4Desc}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
