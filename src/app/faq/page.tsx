export default function FAQPage() {
  const faqs = [
    {
      q: "বায়োডাটা তৈরি করতে কি কোনো ফি দিতে হয়?",
      a: "না, সম্পূর্ণ বিনামূল্যে বায়োডাটা তৈরি ও নিবন্ধন করা যায়।",
    },
    {
      q: "ছবি কি সবার জন্য উন্মুক্ত থাকবে?",
      a: "আপনি চাইলে ছবি ব্লার (ঝাপসা) করে রাখতে পারেন। আপনার অনুমতি ব্যতীত মূল ছবি প্রদর্শিত হবে না।",
    },
    {
      q: "অভিভাবকের যোগাযোগ নম্বর কখন দেখা যাবে?",
      a: "উভয়পক্ষের সম্মতি ও প্রস্তাব গৃহীত হওয়ার পর অভিভাবকের যোগাযোগের তথ্য প্রকাশ করা হয়।",
    },
    {
      q: "সিভি (CV) কীভাবে ডাউনলোড করব?",
      a: "আমার সিভি পেজে প্রয়োজনীয় তথ্য পূরণ করার পর যেকোনো সময় পিডিএফ আকারে ডাউনলোড করতে পারবেন।",
    },
  ];

  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto bg-surface rounded-card border border-border p-6 sm:p-10 shadow-sm space-y-6">
        <h1 className="text-3xl font-bold text-text mb-6">সাধারণ প্রশ্নোত্তর (FAQ)</h1>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-md border border-border bg-muted/20">
              <h3 className="font-semibold text-text text-base mb-1.5">{faq.q}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
