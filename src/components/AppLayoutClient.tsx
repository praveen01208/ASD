"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import FloatingChatbot from "@/components/FloatingChatbot";
import { Menu, X, Activity, Phone } from "lucide-react";
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
      <div className="relative min-h-screen w-full bg-[#080D1A] text-slate-100 overflow-x-hidden">
        <main className="w-full min-h-screen">{children}</main>
        {/* Argus chatbot is only shown when signed in and not on admin/onboarding */}
        {isSignedIn && !isLandingPage && !isAuthPage && !isAdminPage && !isOnboardingPage && (
          <FloatingChatbot />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#080D1A] text-slate-100 relative selection:bg-teal-600 selection:text-white flex flex-col md:flex-row">

      {/* Mobile Top Header with Hamburger & ASD Logo */}
      <div className="md:hidden sticky top-0 z-40 w-full px-4 py-2.5 liquid-glass flex items-center justify-between border-b border-white/10 bg-[#030712]/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-teal-400/40 p-0.5 flex items-center justify-center">
            <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-xs sm:text-sm text-white">ASD Oral Care AI</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/helpline"
            className="p-1.5 px-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1"
          >
            <Phone className="w-3 h-3" /> 9284046972
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-white/10 text-slate-200 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex animate-in fade-in">
          <div className="w-72 h-full bg-[#040711] border-r border-white/10 relative flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <span className="font-bold text-sm text-white">Menu Navigation</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 text-slate-300"
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
