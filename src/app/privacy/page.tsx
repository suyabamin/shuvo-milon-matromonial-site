export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto bg-surface rounded-card border border-border p-6 sm:p-10 shadow-sm space-y-6">
        <h1 className="text-3xl font-bold text-text">প্রাইভেসি পলিসি</h1>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>
            শুভ মিলন ব্যবহারকারীদের ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। আপনার ব্যক্তিগত ও স্পর্শকাতর তথ্য আমাদের সুরক্ষিত ডেটাবেসে সংরক্ষিত থাকে।
          </p>
          <h2 className="text-base font-bold text-text pt-2">তথ্যের সুরক্ষা</h2>
          <p>
            প্রার্থীর মোবাইল নম্বর ও সঠিক ঠিকানা সর্বজনীনভাবে প্রকাশিত হয় না। শুধুমাত্র উভয়পক্ষের সম্মতিতে অভিভাবকের যোগাযোগের নম্বর প্রকাশ করা হয়।
          </p>
          <h2 className="text-base font-bold text-text pt-2">ছবির গোপনীয়তা</h2>
          <p>
            ব্যবহারকারীরা তাদের ছবি ব্লার রাখার পূর্ণ স্বাধীনতা পান। যে কেউ চাইলে অনুমতি সাপেক্ষে মূল ছবি দেখার অনুরোধ পাঠাতে পারেন।
          </p>
        </div>
      </div>
    </main>
  );
}
