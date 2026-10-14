"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Show, SignInButton, SignOutButton, UserButton } from "@/components/AuthComponents";
import { 
  HeartHandshake,
  User, 
  Activity, 
  ListChecks, 
  PlaySquare, 
  MessageSquareHeart, 
  LineChart, 
  Stethoscope, 
  FileText, 
  Settings,
  Phone,
  PlusCircle,
  Sparkles,
  LogOut,
  Home,
  Baby
} from "lucide-react";
import { getUserProfile, fetchUserProfileFromServer, getActiveAccount, ChildAccount } from "@/lib/userStore";

const navigation = [
  { name: "My Child's Care", href: "/", icon: HeartHandshake },
  { name: "Child Profile", href: "/profile", icon: User },
  { name: "AI Assessment (Weekly)", href: "/assessment", icon: Activity },
  { name: "Care Plan", href: "/care-plan", icon: ListChecks },
  { name: "Visual Learning & Videos", href: "/learning", icon: PlaySquare },
  { name: "Daily Monitoring", href: "/monitoring", icon: FileText },
  { name: "Argus AI Assistant", href: "/assistant", icon: MessageSquareHeart },
  { name: "24/7 Helpline", href: "/helpline", icon: Phone, badge: "9284046972" },
  { name: "Consultants Panel", href: "/consultants", icon: Stethoscope },
  { name: "Progress & Telemetry", href: "/progress", icon: LineChart },
  { name: "Clinical Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [activeAccount, setActiveAccount] = useState<ChildAccount | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        const prof = await fetchUserProfileFromServer(user.id);
        setActiveAccount(prof || getUserProfile(user.id) || getActiveAccount(user.id));
      } else {
        setActiveAccount(getActiveAccount());
      }
    };

    loadProfile();

    const handleAccChange = () => {
      if (user?.id) {
        setActiveAccount(getUserProfile(user.id) || getActiveAccount(user.id));
      } else {
        setActiveAccount(getActiveAccount());
      }
    };

    window.addEventListener("asd_account_changed", handleAccChange);
    return () => window.removeEventListener("asd_account_changed", handleAccChange);
  }, [user?.id]);

  return (
    <aside aria-label="Sidebar Navigation" className="flex h-full w-64 flex-col liquid-glass border-r border-white/10 text-slate-200">
      {/* Brand Header with ASD Logo */}
      <div className="flex h-20 shrink-0 items-center px-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-teal-400/40 p-1 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
            <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-sm tracking-tight text-white truncate">ASD Oral Care AI</span>
            <span className="text-[10px] font-semibold text-teal-400 truncate">Dr. Nivrutti Reddy</span>
          </div>
        </Link>
      </div>

      {/* User's Child Profile Banner */}
      <div className="px-3 pt-3">
        {activeAccount ? (
          <Link 
            href="/profile"
            className="p-2.5 rounded-2xl liquid-glass border border-teal-500/30 hover:border-teal-400/60 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-teal-400/20 text-teal-300 font-black text-sm flex items-center justify-center flex-shrink-0">
                {activeAccount.name.substring(0, 1)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                  <span>{activeAccount.name}</span>
                  <span className="text-[9px] font-mono text-teal-300">({activeAccount.code})</span>
                </div>
                <div className="text-[10px] text-teal-400/90 font-medium truncate">
                  Score: {activeAccount.weeklyAssessments?.[0]?.oralHygieneScore || 75}%
                </div>
              </div>
            </div>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/10 text-slate-300 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
              Profile
            </span>
          </Link>
        ) : (
          <Link
            href="/profile"
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2 text-slate-300 text-xs font-semibold"
          >
            <Baby className="w-4 h-4 flex-shrink-0 text-teal-400" />
            <span className="truncate">Child Oral Profile</span>
          </Link>
        )}
      </div>

      {/* Navigation items */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-2 pb-3 px-3 no-scrollbar">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-x-2.5">
                  <item.icon
                    className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? "text-teal-400" : "text-slate-400 group-hover:text-teal-300"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Quick Helpline Support Card (Calling 9284046972) */}
        <div className="mt-3 p-3 rounded-2xl liquid-glass border border-rose-500/30 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1">
              <Phone className="w-3 h-3" /> 24/7 Helpline
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          </div>
          <div className="text-[11px] text-white font-mono font-bold mb-2">+91 9284046972</div>
          <Link
            href="/helpline"
            className="w-full py-1.5 px-2.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
          >
            Emergency & Support
          </Link>
        </div>

        {/* User Account / Sign In / Log Out */}
        <div className="mt-3 space-y-2">
          <Show when="signed-in">
            <div className="liquid-glass rounded-xl p-2.5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 min-w-0">
                <UserButton />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate">Caregiver Account</span>
                  <span className="text-[10px] text-teal-400">Baseline Synced</span>
                </div>
              </div>

              <SignOutButton redirectUrl="/landing">
                <button className="w-full py-1.5 px-3 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-rose-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm">
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </SignOutButton>
            </div>
          </Show>

          <Show when="signed-out">
            <div className="liquid-glass rounded-xl p-2.5 border border-white/10 space-y-2">
              <SignInButton mode="modal">
                <button className="w-full text-center py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-all shadow-sm">
                  Sign In / Register
                </button>
              </SignInButton>
              <Link
                href="/landing"
                className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <Home className="w-3.5 h-3.5 text-teal-400" />
                Landing Page
              </Link>
            </div>
          </Show>
        </div>
      </div>
    </aside>
  );
}
