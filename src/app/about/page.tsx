import { t } from "@/lib/strings";
import Link from "next/link";

export default function AboutPage() {
  const footer = t("footer");
  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto bg-surface rounded-card border border-border p-6 sm:p-10 shadow-sm space-y-6">
        <h1 className="text-3xl font-bold text-text">আমাদের সম্পর্কে</h1>
        <p className="text-text-secondary leading-relaxed">
          {footer.aboutText}
        </p>
        <p className="text-text-secondary leading-relaxed">
          আমরা বিশ্বাস করি দ্বীনদারিতা এবং পারিবারিক মূল্যবোধই একটি সফল দাম্পত্য জীবনের মূল ভিত্তি। আমাদের লক্ষ্য হলো পাত্র-পাত্রী এবং অভিভাবকদের জন্য একটি নিরাপদ, গোপনীয়তা রক্ষা করে এমন ডিজিটাল পরিবেশ তৈরি করা।
        </p>
        <div className="pt-4 border-t border-border flex gap-4">
          <Link href="/biodatas" className="px-5 py-2.5 bg-primary text-white rounded-md font-medium text-sm">
            বায়োডাটা খুঁজুন
          </Link>
          <Link href="/create" className="px-5 py-2.5 border border-border text-text rounded-md font-medium text-sm hover:bg-muted">
            বায়োডাটা তৈরি করুন
          </Link>
        </div>
      </div>
    </main>
  );
}
