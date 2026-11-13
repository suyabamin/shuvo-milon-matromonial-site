import { HeroSearch } from "@/components/HeroSearch";
import { t } from "@/lib/strings";

export default function HomePage() {
  const home = t("home");

  return (
    <div>
      {/* Hero with Search Card & Stats */}
      <HeroSearch />

      {/* "How It Works" Section */}
      <section className="py-16 md:py-24 bg-surface max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-text">
            {home.howItWorks.title}
          </h2>
          <p className="font-body text-text-muted mt-2 text-sm sm:text-base">
            {home.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="p-6 rounded-card border border-input-border bg-bg-soft/30 hover:border-border transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary text-surface flex items-center justify-center font-heading font-bold text-lg mb-4">
              ১
            </div>
            <h3 className="font-heading font-bold text-lg text-text mb-2">
              {home.howItWorks.step1Title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {home.howItWorks.step1Desc}
            </p>
          </div>

          <div className="p-6 rounded-card border border-input-border bg-bg-soft/30 hover:border-border transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary text-surface flex items-center justify-center font-heading font-bold text-lg mb-4">
              ২
            </div>
            <h3 className="font-heading font-bold text-lg text-text mb-2">
              {home.howItWorks.step2Title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {home.howItWorks.step2Desc}
            </p>
          </div>

          <div className="p-6 rounded-card border border-input-border bg-bg-soft/30 hover:border-border transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary text-surface flex items-center justify-center font-heading font-bold text-lg mb-4">
              ৩
            </div>
            <h3 className="font-heading font-bold text-lg text-text mb-2">
              {home.howItWorks.step3Title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {home.howItWorks.step3Desc}
            </p>
          </div>

          <div className="p-6 rounded-card border border-input-border bg-bg-soft/30 hover:border-border transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent text-surface flex items-center justify-center font-heading font-bold text-lg mb-4">
              ৪
            </div>
            <h3 className="font-heading font-bold text-lg text-text mb-2">
              {home.howItWorks.step4Title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {home.howItWorks.step4Desc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
