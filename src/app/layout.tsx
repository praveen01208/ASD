import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayoutClient from "@/components/AppLayoutClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASD Oral Care AI • Small steps, consistent routines, healthier smiles",
  description: "A simple, predictable digital space for parents and caregivers of children with ASD. Supervised by Dr. Nivrutti Reddy.",
  icons: {
    icon: "/asd-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen dark scroll-smooth`}
    >
      <body 
        suppressHydrationWarning 
        className="min-h-screen bg-[#030712] text-slate-100 antialiased overflow-x-hidden"
      >
        <AuthProvider>
          <AppLayoutClient>{children}</AppLayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}