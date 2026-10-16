"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import FloatingChatbot from "@/components/FloatingChatbot";
import { Menu, X, Phone } from "lucide-react";
import Link from "next/link";

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");
  const isLandingPage = pathname === "/landing" || (!isSignedIn && pathname === "/");
  const isAdminPage = pathname?.startsWith("/admin");
  const isOnboardingPage = pathname === "/onboarding";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // When user is not signed in, or is on landing, auth, onboarding, or admin pages:
  // Render clean full-width layout without the regular user sidebar!
  if (!isSignedIn || isLandingPage || isAuthPage || isAdminPage || isOnboardingPage) {
    return (
      <div className="relative min-h-screen w-full bg-[#F4FAF6] text-[#0B2B26] overflow-x-hidden">
        {/* Subtle Living Background Video with Luminous Sage Wash */}
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ opacity: 0.04, transform: "translateZ(0)" }}
            src="/bg.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F4FAF6]/95 via-[#DAF1DE]/25 to-[#F4FAF6]/98" />
        </div>

        <main className="relative z-10 w-full min-h-screen">{children}</main>
        {/* Argus chatbot is only shown when signed in and not on admin/onboarding */}
        {isSignedIn && !isLandingPage && !isAuthPage && !isAdminPage && !isOnboardingPage && (
          <FloatingChatbot />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F4FAF6] text-[#0B2B26] relative selection:bg-[#DAF1DE] selection:text-[#051F20] flex flex-col md:flex-row">
      {/* Subtle Living Background Video */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ opacity: 0.04, transform: "translateZ(0)" }}
          src="/bg.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4FAF6]/95 via-[#DAF1DE]/25 to-[#F4FAF6]/98" />
      </div>

      {/* Mobile Top Header with Hamburger & ASD Logo */}
      <div className="md:hidden sticky top-0 z-40 w-full px-4 py-2.5 flex items-center justify-between border-b border-[#D5E8DA] bg-white/95 backdrop-blur-md shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#DAF1DE] border border-[#8EB69B] p-0.5 flex items-center justify-center">
            <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-xs sm:text-sm text-[#051F20]">ASD Oral Care AI</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/helpline"
            className="p-1.5 px-2.5 rounded-xl bg-[#DAF1DE] text-[#163832] border border-[#8EB69B] text-[11px] font-bold flex items-center gap-1 shadow-2xs hover:bg-[#8EB69B]/30 transition-colors"
          >
            <Phone className="w-3 h-3 text-[#235347]" /> 9284046972
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-[#DAF1DE] text-[#051F20] hover:bg-[#8EB69B]/30 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#051F20]/40 backdrop-blur-xs flex animate-in fade-in">
          <div className="w-72 h-full bg-white border-r border-[#D5E8DA] relative flex flex-col shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-[#D5E8DA]">
              <span className="font-bold text-sm text-[#051F20]">Menu Navigation</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-[#DAF1DE] text-[#051F20] hover:bg-[#8EB69B]/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setMobileSidebarOpen(false)}>
              <Sidebar />
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 h-screen sticky top-0 z-30">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-h-screen p-4 sm:p-8 pt-4 md:pt-8 overflow-y-auto">
        {children}
      </main>

      {/* Floating Chatbot Widget: Argus appears ONLY when logged in inside */}
      {isSignedIn && <FloatingChatbot />}
    </div>
  );
}
