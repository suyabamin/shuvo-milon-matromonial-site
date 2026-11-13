import type { Metadata } from "next";
import { Suspense } from "react";
import { Hind_Siliguri, Noto_Sans_Bengali, Poppins } from "next/font/google";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/features/auth/AuthContext";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-heading",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-body",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-english-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "শুভ মিলন - সেরা ইসলামিক ম্যাট্রিমনি",
  description: "বাংলাদেশের দ্বীনদার পাত্র-পাত্রী খোঁজার বিশ্বস্ত বায়োডাটা প্ল্যাটফর্ম",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${notoSansBengali.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-surface text-text">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
