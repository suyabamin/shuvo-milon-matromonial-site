# আর্কিটেকচার

## সিস্টেম চিত্র
[ব্রাউজার / মোবাইল]
│ Next.js (React, Tailwind)
│
├── Firebase Auth ──── Phone OTP
├── Firestore ──────── ডেটা (প্রোফাইল, ইন্টারেস্ট, চ্যাট, CV)
├── Cloud Functions ── Signed upload, ম্যাচ লজিক, অ্যাডমিন, পেমেন্ট ওয়েবহুক
└── Cloudinary ─────── ছবি স্টোরেজ (প্রাইভেট, signed URL)

## মূল সিদ্ধান্ত
1. **ক্লায়েন্ট সরাসরি Firestore পড়ে/লেখে,** কিন্তু নিয়ম Security Rules-এ লেখা।
2. **সংবেদনশীল কাজ Cloud Functions-এ:** ফোন নম্বর শেয়ার, ম্যাচ তৈরি, পেমেন্ট যাচাই।
3. **ছবি Cloudinary-তে,** Firestore-এ শুধু URL ও মেটাডেটা।
4. **CV ডেটা Firestore-এ,** PDF প্রতিবার ক্লায়েন্টে তৈরি (স্টোরেজ লাগবে না)।
5. **সার্চ:** প্রথমে Firestore-এর `where` ফিল্টার। জটিল হলে পরে Algolia/Typesense।

## ডিরেক্টরি ও রুট (Next.js App Router)

/ হোম
/biodatas সার্চ ও ফিল্টার
/biodatas/[uid] প্রোফাইল বিস্তারিত
/login লগইন (ফোন)
/login/verify OTP
/create বায়োডাটা তৈরি (ধাপে ধাপে)
/me আমার প্রোফাইল
/me/cv CV ফর্ম
/me/cv/preview CV প্রিভিউ ও ডাউনলোড
/interests ইন্টারেস্ট
/shortlist শর্টলিস্ট
/chat চ্যাট তালিকা
/chat/[chatId] চ্যাট স্ক্রিন
/admin অ্যাডমিন (আলাদা রোল)
/about, /faq, /guide, /contact, /privacy, /terms, /refund

## Cloud Functions তালিকা
| নাম | কাজ | ট্রিগার |
|---|---|---|
| `createSignedUpload` | Cloudinary signed upload | HTTPS callable |
| `onInterestUpdated` | গ্রহণ হলে ম্যাচ তৈরি | Firestore onUpdate |
| `revealContactOnMatch` | ম্যাচের পর ফোন শেয়ার | HTTPS callable |
| `setAdminRole` | অ্যাডমিন রোল দেওয়া | HTTPS callable (সুপার-অ্যাডমিন) |
| `paymentWebhook` | bKash/Nagad/SSLCommerz যাচাই | HTTPS |
| `onPhotoUploaded` | ছবি যাচাই ফ্ল্যাগ | Firestore onCreate |

## ফোল্ডার (Functions)
functions/
├── src/
│ ├── index.ts
│ ├── matches.ts
│ ├── uploads.ts
│ ├── admin.ts
│ └── payments.ts


## পরিবেশ
- `development`: Firebase Emulator (Auth, Firestore, Functions)
- `staging`: আলাদা Firebase প্রজেক্ট
- `production`: মূল প্রজেক্ট

## পারফরম্যান্স
- বায়োডাটা লিস্টে পেজিনেশন (২০টি করে)।
- প্রোফাইল ইমেজে Cloudinary transform (লো-রেজোলিউশন থাম্বনেইল)।
- ক্লায়েন্টে cache (TanStack Query বা SWR)।

## খরচ নজর
- Firebase Budget Alert সেট কর।
- Firestore read কমাতে cache ও pagination।