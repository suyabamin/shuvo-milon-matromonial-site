# AGENTS.md: কোডিং এজেন্টের নিয়ম

এই ফাইল পড়ার পর কোড লেখা শুরু কর। প্রতিটা কাজের আগে `docs/TASKS.md` দেখ।

## প্রজেক্ট কী
"শুভ মিলন": বাংলাদেশের বায়োডাটা-ভিত্তিক ম্যাট্রিমনিয়াল ওয়েবসাইট।
বিস্তারিত: `docs/PRD.md`, ফিচার: `docs/FEATURES.md`।

## প্রযুক্তি স্ট্যাক (বদলাবে না)
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Auth: Firebase Authentication (Phone OTP)
- Database: Cloud Firestore
- Image: Cloudinary (signed upload)
- Server logic: Firebase Cloud Functions (v2)
- PDF (CV): HTML → PDF (html2pdf.js বা pdfmake), বাংলা ফন্ট এমবেড

## মূল নিয়ম
1. **TypeScript strict mode।** `any` ব্যবহার করবে না।
2. **বাংলা টেক্সট কোডে সরাসরি লিখবে না।** সব UI টেক্সট `src/strings/bn.json` থেকে নেবে।
3. **রং ও স্পেসিং হার্ডকোড করবে না।** `src/design/tokens.json` বা Tailwind config ব্যবহার কর।
4. **সব ইনপুট ভ্যালিডেট কর।** ফোন নম্বর: `+8801XXXXXXXXX`। Zod ব্যবহার কর।
5. **সিক্রেট কোডে রাখবে না।** `.env.local` ব্যবহার কর, `.env.example` আপডেট রাখ।
6. **Firestore Security Rules ছাড়া কোনো ডেটা অ্যাক্সেস কোড লিখবে না।** `docs/SECURITY.md` মেনে চল।
7. **রেসপনসিভ বাধ্যতামূলক।** মোবাইল (360px+), ট্যাবলেট (640px+), ডেস্কটপ (1024px+)।
8. **প্রতিটা ফিচারের সাথে টেস্ট লেখ।** অন্তত লজিক ফাংশনের জন্য।
9. **একবারে একটা কাজ।** `docs/TASKS.md`-এর একটা আইটেম শেষ করে তারপর পরেরটা।
10. **কাজ শেষে:** কী বদলেছে, কোন ফাইল, কী বাকি, সংক্ষেপে জানাও।

## ফোল্ডার নিয়ম
- `src/app/`: রুট ও পেজ (App Router)
- `src/components/`: রিইউজেবল UI
- `src/features/<feature>/`: ফিচার-ভিত্তিক কোড (api, hooks, components)
- `src/lib/`: Firebase, Cloudinary, utils
- `src/strings/`: বাংলা টেক্সট
- `src/design/`: টোকেন
- `functions/`: Cloud Functions

## নামকরণ
- কম্পোনেন্ট: PascalCase (`ProfileCard.tsx`)
- হুক: `useXxx.ts`
- ফাংশন/ভেরিয়েবল: camelCase
- Firestore কালেকশন: camelCase (`profiles`, `interests`)

## ডিজাইন অনুসরণ
1. কাজ শুরুর আগে `docs/design/INDEX.md` পড়।
2. সংশ্লিষ্ট ছবি `docs/design/sections/`-এ খোঁজ। না থাকলে `docs/design/all-pages.jpg` খুলে সেই অংশ দেখ।
3. ছবি ও কোড মিলিয়ে তবে কাজ শেষ বলবে। মিল না হলে কী আলাদা জানাও।