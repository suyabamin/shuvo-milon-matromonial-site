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