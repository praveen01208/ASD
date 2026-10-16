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
  Baby,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { getUserProfile, fetchUserProfileFromServer, getActiveAccount, ChildAccount } from "@/lib/userStore";

const navigation = [
  { name: "Care Overview", href: "/", icon: HeartHandshake },
  { name: "1. Baseline Assessment", href: "/assessment?tab=baseline", icon: ShieldCheck, badge: "Step 1" },
  { name: "2. Daily Routine Checklist", href: "/monitoring", icon: CheckCircle2, badge: "Step 2" },
  { name: "3. Visual Learning & Videos", href: "/learning", icon: PlaySquare, badge: "Step 3" },
  { name: "4. Child Care Plan", href: "/care-plan", icon: ListChecks, badge: "Step 4" },
  { name: "5. Argus AI Guide", href: "/assistant", icon: MessageSquareHeart, badge: "Step 5" },
  { name: "Child Profile", href: "/profile", icon: User },
  { name: "Weekly AI Assessment", href: "/assessment?tab=weekly", icon: Activity },
  { name: "Specialized Consultants", href: "/consultants", icon: Stethoscope },
  { name: "24/7 Helpline", href: "/helpline", icon: Phone, badge: "9284046972" },
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
    <aside aria-label="Sidebar Navigation" className="flex h-full w-64 flex-col bg-white border-r border-slate-200 text-slate-800 shadow-xs">
      {/* Brand Header with ASD Logo */}
      <div className="flex h-20 shrink-0 items-center px-4 border-b border-slate-200 bg-white">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 p-1 flex items-center justify-center flex-shrink-0 shadow-xs">
            <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-sm tracking-tight text-slate-900 truncate">ASD Oral Care AI</span>
            <span className="text-[10px] font-bold text-teal-700 truncate">Dr. Nivrutti Reddy</span>
          </div>
        </Link>
      </div>

      {/* User's Child Profile Banner */}
      <div className="px-3 pt-3">
        {activeAccount ? (
          <Link 
            href="/profile"
            className="p-2.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 hover:border-teal-400 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                {activeAccount.name.substring(0, 1)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                  <span>{activeAccount.name}</span>
                  <span className="text-[9px] font-mono text-teal-700">({activeAccount.code})</span>
                </div>
                <div className="text-[10px] text-teal-700 font-semibold truncate">
                  Score: {activeAccount.weeklyAssessments?.[0]?.oralHygieneScore || 75}%
                </div>
              </div>
            </div>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              Profile
            </span>
          </Link>
        ) : (
          <Link
            href="/profile"
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-slate-700 text-xs font-semibold"
          >
            <Baby className="w-4 h-4 flex-shrink-0 text-teal-600" />
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
                    ? "bg-teal-50 text-teal-900 border border-teal-200 font-bold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-x-2.5">
                  <item.icon
                    className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? "text-teal-600" : "text-slate-400 group-hover:text-teal-600"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Account / Sign In / Log Out */}
        <div className="mt-3 space-y-2">
          <Show when="signed-in">
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <UserButton />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-900 truncate">Caregiver Account</span>
                  <span className="text-[10px] text-teal-700 font-medium">Baseline Synced</span>
                </div>
              </div>

              <SignOutButton redirectUrl="/landing">
                <button className="w-full py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-900 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs">
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
