"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { 
  Activity, 
  Flame, 
  ShieldCheck, 
  ArrowUpRight, 
  Apple, 
  CheckCircle2, 
  Phone, 
  ChevronRight,
  Smile,
  AlertTriangle,
  Play,
  Heart,
  Award,
  Stethoscope,
  Brain,
  Check,
  Calendar,
  Clock,
  Sparkle,
  FileText
} from "lucide-react";
import DailyHygieneChecklist from "@/components/DailyHygieneChecklist";
import { 
  getUserProfile, 
  fetchUserProfileFromServer, 
  hasUserCompletedOnboarding, 
  getActiveAccount, 
  DEFAULT_ACCOUNTS,
  ChildAccount 
} from "@/lib/userStore";
import LandingPage from "@/app/landing/page";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useAuth();
  const router = useRouter();
  const [activeChild, setActiveChild] = useState<ChildAccount | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // Daily Checklist Tracking State (Today YYYY-MM-DD)
  const todayKey = new Date().toISOString().split("T")[0];
  const [isTodayLogged, setIsTodayLogged] = useState(false);
  const [todayLogData, setTodayLogData] = useState<any>(null);

  // Check if today's checklist has been completed from local & DB
  const checkTodayLog = async (childId?: string) => {
    if (typeof window === "undefined") return;
    const cid = childId || activeChild?.id || "default";
    const storageKey = `asd_daily_hygiene_log_${cid}_${todayKey}`;
    const genericKey = `asd_daily_hygiene_log_${todayKey}`;
    const saved = localStorage.getItem(storageKey) || localStorage.getItem(genericKey) || localStorage.getItem("asd_today_checklist");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayKey || parsed.brushedMorning !== undefined) {
          setIsTodayLogged(true);
          setTodayLogData(parsed);
          return;
        }
      } catch (e) {
        // Fallback to API check
      }
    }

    // Secondary check from DB API
    try {
      const res = await fetch(`/api/daily-logs?childId=${encodeURIComponent(cid)}&userId=${encodeURIComponent(user?.id || "")}`);
      if (res.ok) {
        const data = await res.json();
        const found = (data.logs || []).find((l: any) => l.date === todayKey);
        if (found) {
          setIsTodayLogged(true);
          setTodayLogData(found);
          localStorage.setItem(storageKey, JSON.stringify(found));
          return;
        }
      }
    } catch (err) {
      // offline / local fallback
    }

    setIsTodayLogged(false);
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setIsCheckingProfile(false);
      return;
    }

    const checkAndLoad = async () => {
      try {
        setIsCheckingProfile(true);
        const userCompleted = hasUserCompletedOnboarding(user?.id);

        if (user?.id) {
          const serverProfile = await fetchUserProfileFromServer(user.id);
          const localProfile = getUserProfile(user.id);
          const resolved = serverProfile || localProfile;

          if (resolved) {
            setActiveChild(resolved);
            setHasCompletedOnboarding(true);
            checkTodayLog(resolved.id);
          } else if (userCompleted) {
            const fallback = getActiveAccount(user.id) || DEFAULT_ACCOUNTS[0];
            setActiveChild(fallback);
            setHasCompletedOnboarding(true);
            checkTodayLog(fallback.id);
          } else {
            // First time login! Prompt the 20 questionnaire intake once and nowhere again
            router.replace("/onboarding");
            return;
          }
        } else {
          const fallback = getActiveAccount() || DEFAULT_ACCOUNTS[0];
          setActiveChild(fallback);
          setHasCompletedOnboarding(true);
          checkTodayLog(fallback.id);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        const fallback = getActiveAccount() || DEFAULT_ACCOUNTS[0];
        setActiveChild(fallback);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkAndLoad();

    const handleAccountChange = () => {
      if (user?.id) {
        const updated = getUserProfile(user.id) || getActiveAccount(user.id) || DEFAULT_ACCOUNTS[0];
        if (updated) {
          setActiveChild(updated);
          checkTodayLog(updated.id);
        }
      }
    };

    const handleDailyLogUpdate = (e: any) => {
      if (e?.detail) {
        setIsTodayLogged(true);
        setTodayLogData(e.detail);
      } else {
        checkTodayLog();
      }
    };

    window.addEventListener("asd_account_changed", handleAccountChange);
    window.addEventListener("asd_daily_log_updated", handleDailyLogUpdate);
    return () => {
      window.removeEventListener("asd_account_changed", handleAccountChange);
      window.removeEventListener("asd_daily_log_updated", handleDailyLogUpdate);
    };
  }, [isLoaded, isSignedIn, user?.id, router]);

  // If user is signed out, render LandingPage immediately (no redirects, no spinner)
  if (!isSignedIn) {
    return <LandingPage />;
  }

  // Loading state only for signed-in caregivers fetching profile
  if (!isLoaded || (isCheckingProfile && !activeChild)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-300">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        <span className="text-xs font-medium text-slate-400">Loading child oral health portal...</span>
      </div>
    );
  }

  const childName = activeChild?.name || (user?.user_metadata?.name ? `${user.user_metadata.name}'s Child` : "Your Child");
  const childCode = activeChild?.code || "ASD-001";
  const caregiverName = activeChild?.caregiverName || user?.user_metadata?.full_name || user?.user_metadata?.name || "Caregiver";
  const asdLevel = activeChild?.asdLevel || "Registered ASD Profile";
  const latestAssessment = activeChild?.weeklyAssessments?.[0];

  const formattedToday = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-24 animate-fade-in">
      {/* ── Top Clinical Header Bar ── */}
      <div className="bg-[#0F172A] rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center flex-shrink-0">
            <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-400">
                ASD Pediatric Oral Care
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Dr. Nivrutti Reddy Clinical Protocol</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Care Portal for {childName}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Profile: <span className="text-slate-300 font-mono">{childCode}</span> • {asdLevel} • Caregiver: {caregiverName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link
            href="/helpline"
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 text-rose-300 border border-rose-500/25 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-rose-400" />
            <span>24/7 Helpline: 9284046972</span>
          </Link>
          <Link
            href="/consultants"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
            <span>Consultants</span>
          </Link>
        </div>
      </div>

      {/* ── DAILY CHECKLIST (ASKED ONCE DAILY) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              Child&apos;s Daily Oral Hygiene Checklist
            </h2>
            <p className="text-xs text-slate-400">
              {formattedToday} • Routine telemetry for active clinical monitoring
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isTodayLogged ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Logged for Today
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Pending Today&apos;s Routine
              </span>
            )}
          </div>
        </div>

        {/* If ALREADY logged today, show a clean, reassuring confirmation card (NEVER re-prompt) */}
        {isTodayLogged ? (
          <div className="bg-[#0F172A] rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Today&apos;s Oral Hygiene Routine Successfully Logged
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Data recorded in database and synced with monitoring telemetry & Argus AI.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/monitoring"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>View Full Monitoring Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Summary of Today's Log */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Morning Brushing</span>
                <span className="font-semibold text-emerald-400 mt-0.5 block">
                  {todayLogData?.brushedMorning ? "✓ Completed" : "Not Logged"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Bedtime Brushing</span>
                <span className="font-semibold text-emerald-400 mt-0.5 block">
                  {todayLogData?.brushedNight ? "✓ Completed" : "Scheduled Tonight"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Dietary Balance</span>
                <span className="font-semibold text-teal-300 mt-0.5 block">
                  {todayLogData?.healthyBreakfast && todayLogData?.healthyLunch ? "Healthy Meals" : "Standard"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Child Cooperation</span>
                <span className="font-semibold text-sky-400 mt-0.5 block">
                  {todayLogData?.cooperatedWithBrushing ? "Cooperative" : "Sensory Guided"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* If NOT yet logged today, prompt the 14-item checklist right here */
          <DailyHygieneChecklist 
            child={activeChild} 
            onSaveComplete={() => checkTodayLog(activeChild?.id)}
          />
        )}
      </div>

      {/* ── WEEKLY AI ASSESSMENT & REINFORCEMENT ── */}
      {latestAssessment && (
        <div className="bg-[#0F172A] rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Weekly Assessment • {latestAssessment.date}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {latestAssessment.motivationBadge?.title || "Routine Consistency Champion"}
                </h3>
              </div>
            </div>

            <Link
              href="/assessment"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <span>Weekly Telemetry & Certificate</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Oral Hygiene Index:</span>
              <span className="text-sm font-bold text-teal-400">{latestAssessment.oralHygieneScore}%</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Enamel Dietary Risk:</span>
              <span className="text-sm font-bold text-amber-400">{latestAssessment.dietaryRiskScore}%</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Sensory Comfort Index:</span>
              <span className="text-sm font-bold text-emerald-400">{latestAssessment.sensoryComfortScore}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 italic bg-[#0B1120]/60 p-3 rounded-xl border border-slate-800/50">
            “{latestAssessment.statusSummary}”
          </p>
        </div>
      )}

      {/* ── ON-SITE VIDEO SUITE PREVIEW ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-teal-400" />
              Visual Learning & Motivational Videos
            </h2>
            <p className="text-xs text-slate-400">
              On-site video lessons stored directly on our servers (no external links)
            </p>
          </div>

          <Link href="/learning" className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1">
            Open Video Suite <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/learning"
            className="bg-[#0F172A] rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs mb-3 border border-teal-500/20">
                01
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-teal-400 transition-colors">
                Step-by-Step Brushing
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Children happily demonstrating the 5 gentle steps to normalize sensations and build positive habits.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-teal-400 flex items-center gap-1">
              <span>Watch Video</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/learning"
            className="bg-[#0F172A] rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs mb-3 border border-amber-500/20">
                02
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                Diet Motivation: Shiny vs. Bugs
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Dr. Binocs explains how bacteria feast on chocolates and sodas, and how healthy food keeps teeth shiny.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-amber-400 flex items-center gap-1">
              <span>Watch Video</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/learning"
            className="bg-[#0F172A] rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3 border border-indigo-500/20">
                03
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                God Blesses Joyful Brushers
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Cleanliness is Godliness moral story showing how caring for teeth brings divine blessings and peace.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-indigo-400 flex items-center gap-1">
              <span>Watch Video</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── STORED CLINICAL BASELINE (5 DOMAINS) ── */}
      {activeChild && (
        <div className="bg-[#0F172A] rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Stored Clinical Baseline (Answered at Intake)
              </h3>
              <p className="text-xs text-slate-400">
                Calibrated against {activeChild.name}&apos;s profile on record • Never re-prompted
              </p>
            </div>

            <Link
              href="/profile"
              className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View Full Clinical Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80">
              <span className="text-teal-400 font-bold block mb-1">1. Demographics</span>
              <div className="text-slate-200">{activeChild.name}, {activeChild.age} yrs</div>
              <div className="text-[10px] text-slate-400 truncate">{activeChild.demographics?.communicationStyle}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80">
              <span className="text-teal-400 font-bold block mb-1">2. Brushing</span>
              <div className="text-slate-200">{activeChild.brushingHabits?.toothbrushType || "Soft manual"}</div>
              <div className="text-[10px] text-slate-400">{activeChild.brushingHabits?.frequency || "Twice daily"}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80">
              <span className="text-teal-400 font-bold block mb-1">3. Diet</span>
              <div className="text-slate-200">Sugar: {activeChild.dietaryHabits?.sugaryFoodFrequency || "Rarely"}</div>
              <div className="text-[10px] text-slate-400">Snacks: {activeChild.dietaryHabits?.snackingFrequency || "1-2 times"}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80">
              <span className="text-teal-400 font-bold block mb-1">4. Dental History</span>
              <div className="text-slate-200">{activeChild.dentalMedicalHistory?.lastDentalVisit || "Regular"}</div>
              <div className="text-[10px] text-slate-400">{activeChild.dentalMedicalHistory?.activeCavitiesOrPain || "None active"}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800/80">
              <span className="text-teal-400 font-bold block mb-1">5. Sensory/Behavior</span>
              <div className="text-slate-200 truncate">{activeChild.childBehaviour?.sensoryAversionTriggers?.slice(0, 2).join(", ") || "Standard"}</div>
              <div className="text-[10px] text-slate-400">{activeChild.childBehaviour?.mouthOpeningCooperation || "Cooperative"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
