"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Menu, X, Activity } from "lucide-react";

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");
  const isLandingPage = pathname === "/landing";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLandingPage || isAuthPage) {
    return (
      <div className="relative min-h-screen w-full bg-[#030712] text-slate-100 overflow-x-hidden">
        {/* Background ambient lighting */}
        <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
        <main className="w-full min-h-screen">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 relative selection:bg-teal-500 selection:text-white flex flex-col md:flex-row">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Mobile Top Header with Hamburger */}
      <div className="md:hidden sticky top-0 z-40 w-full px-4 py-3 liquid-glass flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white">ASD Oral Care AI</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-white/10 text-slate-200 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex">
          <div className="w-72 h-full bg-[#040711] border-r border-white/10 relative flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <span className="font-bold text-sm text-white">Menu</span>
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

      {/* Main Content Area with natural window scrolling */}
      <main className="flex-1 w-full min-h-screen p-4 sm:p-8 pt-6 md:pt-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
