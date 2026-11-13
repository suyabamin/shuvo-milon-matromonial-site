import { t } from "@/lib/strings";

export default function ContactPage() {
  const footer = t("footer");

  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto bg-surface rounded-card border border-border p-6 sm:p-10 shadow-sm space-y-6">
        <h1 className="text-3xl font-bold text-text">যোগাযোগ করুন</h1>
        <p className="text-text-secondary text-sm">
          আপনার যেকোনো জিজ্ঞাসা, পরামর্শ বা সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করতে পারেন।
        </p>

        <div className="space-y-3 pt-2 text-sm text-text">
          <div className="flex items-center gap-3">
            <span className="text-xl">✉️</span>
            <span>ইমেইল: <strong className="text-primary">{footer.contactEmail}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">📞</span>
            <span>হেল্পলাইন: <strong className="text-primary">{footer.contactPhone}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">📍</span>
            <span>ঠিকানা: ঢাকা, বাংলাদেশ</span>
          </div>
        </div>
      </div>
    </main>
  );
}
