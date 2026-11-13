export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto bg-surface rounded-card border border-border p-6 sm:p-10 shadow-sm space-y-6">
        <h1 className="text-3xl font-bold text-text">ব্যবহারের শর্তাবলী</h1>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>
            শুভ মিলন প্ল্যাটফর্মে নিবন্ধন ও সেবা গ্রহণের মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>বায়োডাটাতে কোনো মিথ্যা, বিভ্রান্তিকর বা অসত্য তথ্য প্রদান করা যাবে না।</li>
            <li>প্ল্যাটফর্মটি কেবলমাত্র শরীয়াহসম্মত ও পারিবারিক উপায়ে পাত্র-পাত্রী খোঁজার কাজে ব্যবহার করা যাবে।</li>
            <li>অন্য কোনো ব্যবহারকারীর সাথে কুরুচিপূর্ণ বা আপত্তিকর আচরণ করলে প্রোফাইল স্থায়ীভাবে ব্লক করা হবে।</li>
            <li>অভিভাবকের অনুমতি ব্যতীত কোনো বায়োডাটা নিবন্ধন করা উচিত নয়।</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
