# সেটআপ গাইড

## প্রয়োজনীয় সফটওয়্যার
- Node.js 20 LTS বা নতুন
- npm বা pnpm
- Git
- Firebase CLI: `npm i -g firebase-tools`
- VS Code (সুপারিশকৃত)

## ধাপ ১: প্রজেক্ট তৈরি
```bash
npx create-next-app@latest shuvo-milon --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd shuvo-milon
```

## ধাপ ২: ফোল্ডার বানাও
```bash
mkdir -p docs src/strings src/design src/features src/lib src/components
mkdir -p src/design && touch src/design/tokens.json
mkdir -p functions
```

## ধাপ ৩: প্যাকেজ ইনস্টল
```bash
npm i firebase zod @tanstack/react-query react-hook-form @hookform/resolvers
npm i -D vitest @testing-library/react jsdom
npm i html2pdf.js
```

## ধাপ ৪: Firebase সেটআপ
```bash
firebase login
firebase init
# নির্বাচন কর: Firestore, Functions (TypeScript), Hosting, Emulators (Auth, Firestore, Functions)
```
Firebase Console-এ:
1. নতুন প্রজেক্ট: `shuvo-milon-dev`।
2. Authentication → Sign-in method → **Phone** চালু কর।
3. Authorized domains-এ `localhost` যোগ কর।
4. Firestore Database বানাও (test mode শুধু ডেভেলপমেন্টে; তারপর rules দিয়ে বন্ধ)।
5. Web app যোগ কর, config কপি কর।

## ধাপ ৫: এনভায়রনমেন্ট
`.env.local` (Git-এ যাবে না):

## Manual setup (human)

> These steps cannot be automated. A human must complete each one before the app can go live.

- [ ] Firebase Authentication: Phone sign-in enabled in Firebase Console
- [ ] Firebase Authentication: `localhost` (and production domain) added to Authorized Domains
- [ ] Firestore Database created in production mode, region `asia-south1`
- [ ] `.env.local` filled with Firebase web config (variable names are in `.env.example`)
- [ ] Google Cloud API key restricted to HTTP referrers (`localhost:3000/*`, production domain) and only the APIs needed (Firestore, Auth)
- [ ] Firebase Budget Alert set at 50%, 90%, and 100% of monthly budget (T8.4)
- [ ] Cloudinary account created; `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_API_SECRET` filled in `.env.local`
- [x] Java 21 installed (`java -version`) — required to run Firebase Emulator for rule tests (T8.2)
- [ ] Responsive check at 360px, 768px, and 1440px in a real browser (T8.1)
- [ ] Lighthouse audit run on production build — target score 80+ (T8.3)
- [ ] Firebase Blaze (pay-as-you-go) plan enabled — required only for Cloud Functions deploy
- [ ] Production deploy via `firebase deploy` after all automated checks pass (T8.5)
- [ ] Beta users recruited and onboarded (T8.6)