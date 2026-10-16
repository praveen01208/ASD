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
  Stethoscope, 
  FileText, 
  Settings,
  Phone,
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
    <aside aria-label="Sidebar Navigation" className="flex h-full w-64 flex-col bg-white border-r border-[#D5E8DA] text-[#0B2B26] shadow-xs">
      {/* Brand Header with ASD Logo */}
      <div className="flex h-20 shrink-0 items-center px-4 border-b border-[#D5E8DA] bg-white">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#DAF1DE] border border-[#8EB69B] p-1 flex items-center justify-center flex-shrink-0 shadow-xs">
            <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-sm tracking-tight text-[#051F20] truncate">ASD Oral Care AI</span>
            <span className="text-[10px] font-bold text-[#235347] truncate">Dr. Nivrutti Reddy</span>
          </div>
        </Link>
      </div>

      {/* User's Child Profile Banner */}
      <div className="px-3 pt-3">
        {activeAccount ? (
          <Link 
            href="/profile"
            className="p-2.5 rounded-2xl bg-[#DAF1DE]/70 border border-[#8EB69B] hover:border-[#235347] transition-all flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#235347] text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                {activeAccount.name.substring(0, 1)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#051F20] truncate flex items-center gap-1">
                  <span>{activeAccount.name}</span>
                  <span className="text-[9px] font-mono text-[#235347]">({activeAccount.code})</span>
                </div>
                <div className="text-[10px] text-[#235347] font-bold truncate">
                  Score: {activeAccount.weeklyAssessments?.[0]?.oralHygieneScore || 75}%
                </div>
              </div>
            </div>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white text-[#163832] border border-[#8EB69B] group-hover:bg-[#235347] group-hover:text-white transition-colors">
              Profile
            </span>
          </Link>
        ) : (
          <Link
            href="/profile"
            className="p-2.5 rounded-2xl bg-[#DAF1DE]/40 border border-[#D5E8DA] hover:border-[#8EB69B] transition-all flex items-center gap-2 text-[#163832] text-xs font-semibold"
          >
            <Baby className="w-4 h-4 flex-shrink-0 text-[#235347]" />
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
                className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all ${
                  isActive
                    ? "bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] font-black shadow-2xs"
                    : "text-[#051F20] font-bold hover:bg-[#DAF1DE]/60 hover:text-[#051F20]"
                }`}
              >
                <div className="flex items-center gap-x-2.5">
                  <item.icon
                    className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? "text-[#235347]" : "text-[#235347] group-hover:text-[#051F20]"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded border ${
                    isActive 
                      ? "bg-white text-[#235347] border-[#8EB69B]" 
                      : "bg-[#DAF1DE] text-[#051F20] border-[#8EB69B]"
                  }`}>
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
            <div className="bg-[#DAF1DE]/40 rounded-xl p-2.5 border border-[#D5E8DA] space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <UserButton />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#051F20] truncate">Caregiver Account</span>
                  <span className="text-[10px] text-[#235347] font-semibold">Baseline Synced</span>
                </div>
              </div>

              <SignOutButton redirectUrl="/landing">
                <button className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-rose-50 border border-[#D5E8DA] hover:border-rose-200 text-[#051F20] hover:text-rose-800 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-2xs">
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </SignOutButton>
            </div>
          </Show>

          <Show when="signed-out">
            <div className="bg-[#DAF1DE]/40 rounded-xl p-2.5 border border-[#D5E8DA] space-y-2">
              <SignInButton mode="modal">
                <button className="w-full text-center py-2 px-3 bg-[#235347] hover:bg-[#163832] text-white text-xs font-bold rounded-lg transition-all shadow-xs">
                  Sign In / Register
                </button>
              </SignInButton>
              <Link
                href="/landing"
                className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-[#DAF1DE] border border-[#D5E8DA] text-[#163832] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <Home className="w-3.5 h-3.5 text-[#235347]" />
                Landing Page
              </Link>
            </div>
          </Show>
        </div>
      </div>
    </aside>
  );
}
