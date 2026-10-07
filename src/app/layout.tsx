import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import AppLayoutClient from "@/components/AppLayoutClient";

export const metadata: Metadata = {
  title: "ASD Oral Care AI • Supervised by Dr. Nivrutti Reddy",
  description: "Advanced pediatric oral care, visual desensitization, and AI caregiver assistance for children with ASD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen dark scroll-smooth`}
      >
        <body 
          suppressHydrationWarning 
          className="min-h-screen bg-[#030712] text-slate-100 antialiased overflow-x-hidden"
        >
          <AppLayoutClient>{children}</AppLayoutClient>
        </body>
      </html>
    </ClerkProvider>
  );
}