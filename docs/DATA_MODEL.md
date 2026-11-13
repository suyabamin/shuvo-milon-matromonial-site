# ডেটা মডেল (Cloud Firestore)

এই ফাইলটি শুভ মিলন প্ল্যাটফর্মের ক্লাউড ফায়ারস্টোর কালেকশন এবং ডকুমেন্টের স্ট্রাকচার নির্ধারণ করে।

---

## কালেকশন ওভারভিউ

| কালেকশন পাথ | বিবরণ | অ্যাক্সেস লেভেল |
|---|---|---|
| `users/{uid}` | ব্যবহারকারীর মূল অ্যাকাউন্ট ও মেটাডেটা | শুধু ব্যবহারকারী ও অ্যাডমিন |
| `profiles/{uid}` | বায়োডাটার পাবলিক ফিল্ড (সার্চ ও ভিউ) | যে কেউ (`status == 'published'`), এডিট শুধু মালিক |
| `profiles/{uid}/private/contact` | অভিভাবক ও প্রার্থীর যোগাযোগের ব্যক্তিগত তথ্য | ম্যাচ হওয়া ব্যবহারকারী ও অ্যাডমিন |
| `cvs/{uid}` | ব্যবহারকারীর তৈরি করা সিভি ডেটা | নিজের সবকিছু; অন্যরা পাবলিক অংশ (যদি `published`) |
| `interests/{interestId}` | প্রস্তাব পাঠানো ও গ্রহণের ট্র্যাকিং | প্রেরক (`fromUid`) ও প্রাপক (`toUid`) |
| `matches/{matchId}` | উভয়পক্ষ সম্মত হওয়ার পর ম্যাচ রেকর্ড | সংশ্লিষ্ট দুইজন ও অ্যাডমিন |
| `chats/{chatId}` | ম্যাচের পর চ্যাট কথোপকথনের তথ্য | কথোপকথনে অংশগ্রহণকারীরা |
| `chats/{chatId}/messages/{msgId}` | চ্যাট মেসেজসমূহ | কথোপকথনে অংশগ্রহণকারীরা |
| `reports/{reportId}` | আপত্তিজনক প্রোফাইল বা চ্যাট রিপোর্ট | রিপোর্টার ও অ্যাডমিন |
| `shortlists/{uid}/items/{targetUid}` | পছন্দের প্রোফাইল তালিকা | শুধু ব্যবহারকারী |

---

## ১. `users/{uid}`
ব্যবহারকারীর বেসিক প্রোফাইল ও ভূমিকা।
```typescript
interface UserDocument {
  uid: string;
  phone: string; // E.164 ফরম্যাট (+8801XXXXXXXXX)
  role: 'user' | 'admin'; // অ্যাডমিন রোল শুধু Cloud Function দিয়ে সেট হবে
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  isBlocked: boolean;
}
```

---

## ২. `profiles/{uid}`
বায়োডাটার সর্বজনীন ফিল্ডসমূহ (সার্চ, ফিল্টারিং ও কার্ডের জন্য)।
```typescript
interface ProfileDocument {
  uid: string;
  status: 'draft' | 'pending' | 'published' | 'hidden';
  verified: boolean; // অ্যাডমিন কর্তৃক ভেরিফাইড কি না
  reportCount: number; // ৩ বা ততোধিক হলে স্বয়ংক্রিয়ভাবে hidden
  
  // ১. মৌলিক তথ্য
  name: string;
  gender: 'male' | 'female'; // পাত্র / পাত্রী
  dateOfBirth: string; // YYYY-MM-DD
  age: number; // হিসাবকৃত বয়স
  maritalStatus: 'unmarried' | 'divorced' | 'widowed';

  // ২. ধর্মীয় তথ্য
  religion: 'Islam';
  sect?: string; // সুন্নি / হানাফি ইত্যাদি
  religiousPractice: string; // যেমন: পাঁচ ওয়াক্ত নামাজ, দাড়ি/পর্দা

  // ৩. ঠিকানা
  country: string; // ডিফল্ট: বাংলাদেশ
  division: string;
  district: string;
  upazila: string;

  // ৪. শিক্ষা ও পেশা
  educationLevel: string; // যেমন: স্নাতক, দাওরায়ে হাদিস
  institution?: string;
  occupation: string; // যেমন: শিক্ষক, ইঞ্জিনিয়ার, ব্যবসায়ী
  monthlyIncome?: string;

  // ৫. শারীরিক তথ্য
  height: string; // যেমন: 5' 6"
  complexion: string; // যেমন: উজ্জ্বল শ্যামলা, ফর্সা
  weightKg?: number;
  bloodGroup?: string;

  // ৬. পারিবারিক তথ্য
  fatherAlive: boolean;
  fatherOccupation?: string;
  motherAlive: boolean;
  motherOccupation?: string;
  brotherCount: number;
  sisterCount: number;
  familyFinancialStatus: 'middle_class' | 'upper_middle_class' | 'affluent';

  // ৭. ছবি ও প্রাইভেসি
  photoUrl?: string; // Cloudinary থাম্বনেইল URL
  photoBlur: boolean; // পাবলিকের জন্য ব্লার থাকবে কি না
  photoStatus: 'approved' | 'pending' | 'rejected';

  // মেটাডেটা
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

---

## ৩. `profiles/{uid}/private/contact`
সংবেদনশীল ব্যক্তিগত ও অভিভাবকের যোগাযোগের তথ্য (ম্যাচের পর প্রকাশ্য)।
```typescript
interface ContactSubdocument {
  guardianName: string;
  guardianRelation: string; // পিতা, চাচা ইত্যাদি
  guardianPhone: string; // +8801XXXXXXXXX
  candidatePhone?: string; // +8801XXXXXXXXX
  fullPresentAddress: string;
  fullPermanentAddress: string;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

---

## ৪. `cvs/{uid}`
সিভি জেনারেশনের জন্য কাঠামোগত তথ্য।
```typescript
interface CVDocument {
  uid: string;
  status: 'draft' | 'published';
  templateId: 'minimal' | 'classic' | 'modern';
  
  personalInfo: {
    fullName: string;
    fatherName: string;
    motherName: string;
    dob: string;
    gender: 'male' | 'female';
    religion: string;
    maritalStatus: string;
    height: string;
    weight?: string;
    complexion: string;
    bloodGroup?: string;
  };
  
  education: Array<{
    degree: string;
    institution: string;
    passingYear: string;
    result?: string;
  }>;
  
  career: Array<{
    designation: string;
    organization: string;
    startYear: string;
    endYear?: string; // বর্তমান হলে খালি
  }>;
  
  skills: string[];
  
  familyDetails: {
    fatherProfession?: string;
    motherProfession?: string;
    siblingsInfo?: string;
  };
  
  contactDetails: {
    showPhone: boolean;
    phone?: string;
    email?: string;
    permanentAddress: string;
    presentAddress: string;
  };

  updatedAt: FirebaseFirestore.Timestamp;
}
```

---

## ৫. `interests/{interestId}`
এক প্রার্থীর অন্য প্রার্থীর প্রতি আগ্রহ প্রকাশ ট্র্যাকিং।
```typescript
interface InterestDocument {
  id: string;
  fromUid: string; // প্রেরক
  toUid: string; // প্রাপক
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

---

## ৬. `matches/{matchId}`
উভয়পক্ষের সম্মতিতে সৃষ্টি হওয়া ম্যাচ রেকর্ড।
```typescript
interface MatchDocument {
  id: string;
  users: [string, string]; // [uid1, uid2]
  interestId: string;
  status: 'active' | 'dissolved'; // active = match is live; dissolved = one party withdrew
  createdAt: FirebaseFirestore.Timestamp;
  dissolvedAt?: FirebaseFirestore.Timestamp; // set when status changes to 'dissolved'
}
```

---

## ৭. `chats/{chatId}` ও `chats/{chatId}/messages/{msgId}`
ম্যাচ প্রাপ্ত দুটি অ্যাকাউন্টের পারস্পরিক বার্তালাপ।
```typescript
interface ChatDocument {
  id: string;
  participants: [string, string];
  lastMessage?: string;
  lastMessageTimestamp?: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
}

interface MessageDocument {
  id: string;
  senderUid: string;
  text: string;
  timestamp: FirebaseFirestore.Timestamp;
  read: boolean;
}
```

---

## ৮. `reports/{reportId}`
ব্যবহারকারী কর্তৃক আপত্তিকর প্রোফাইল বা আচরণের অভিযোগ।
```typescript
interface ReportDocument {
  id: string;
  reporterUid: string;
  targetUid: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: FirebaseFirestore.Timestamp;
}
```

---

## ৯. `shortlists/{uid}/items/{targetUid}`
বুকমার্ক বা পছন্দের বায়োডাটা সেভ রাখার তালিকা।
```typescript
interface ShortlistDocument {
  targetUid: string;
  createdAt: FirebaseFirestore.Timestamp;
}
```
