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
        <div className="w-8 h-8 rounded-full border-2 border-[#235347] border-t-transparent animate-spin" />
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
      {/* ── 1. Top Clinical Welcome & Soothing Hero ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D5E8DA] shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#051F20] bg-[#DAF1DE] border border-[#8EB69B] px-2.5 py-0.5 rounded-full shadow-2xs">
                Dr. Nivrutti Reddy Clinical Protocol
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-500 font-medium">Autism Pediatric Oral Health System</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#051F20] tracking-tight">
              Sequential Care Portal for {childName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Welcome, <strong className="text-[#0B2B26] font-semibold">{caregiverName}</strong>. Follow your child&apos;s 5-step daily routine below. Designed to make brushing predictable, peaceful, and joyful.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="text-xs text-[#0B2B26] bg-[#DAF1DE]/40 px-3 py-1 rounded-xl border border-[#D5E8DA] font-mono">
                ID: <strong className="text-[#235347]">{childCode}</strong>
              </span>
              <span className="text-xs text-[#0B2B26] bg-[#DAF1DE]/40 px-3 py-1 rounded-xl border border-[#D5E8DA] font-medium">
                {asdLevel}
              </span>
              <Link
                href="/helpline"
                className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Phone className="w-3 h-3 text-rose-600" />
                <span>24/7 Helpline: 9284046972</span>
              </Link>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="rounded-2xl overflow-hidden border border-[#D5E8DA] shadow-sm aspect-video relative group">
              <img
                src="/images/dental_clinic_chair_care.jpg"
                alt="Gentle dentist examining child in dental chair"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051F20]/75 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] text-[#DAF1DE] font-medium">
                  Soothing pediatric clinical examination
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Sequential 5-Step Care Roadmap ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#051F20] flex items-center gap-2">
            <span>5-Step Sequential Care Journey</span>
          </h2>
          <span className="text-xs text-slate-500">Step-by-step guidance</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Link
            href="/assessment?tab=baseline"
            className="p-3.5 rounded-2xl bg-white border border-[#D5E8DA] hover:border-[#8EB69B] hover:shadow-xs transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <span className="text-[10px] font-black text-[#235347] uppercase tracking-wider block mb-1">
                Step 1
              </span>
              <div className="font-bold text-xs text-[#0B2B26] group-hover:text-[#235347] transition-colors">
                Baseline Assessment
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">20Q Clinical Profile</p>
            </div>
            <span className="mt-2 text-[10px] text-[#235347] font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 text-[#235347]" /> Calibrated
            </span>
          </Link>

          <a
            href="#daily-checklist"
            className="p-3.5 rounded-2xl bg-white border border-[#D5E8DA] hover:border-[#8EB69B] hover:shadow-xs transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <span className="text-[10px] font-black text-[#235347] uppercase tracking-wider block mb-1">
                Step 2
              </span>
              <div className="font-bold text-xs text-[#0B2B26] group-hover:text-[#235347] transition-colors">
                Daily Routine Checklist
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Morning & Bedtime</p>
            </div>
            <span className="mt-2 text-[10px] text-[#235347] font-semibold">
              {isTodayLogged ? "✓ Done Today" : "Pending Today"}
            </span>
          </a>

          <Link
            href="/learning"
            className="p-3.5 rounded-2xl bg-white border border-[#D5E8DA] hover:border-[#8EB69B] hover:shadow-xs transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <span className="text-[10px] font-black text-[#235347] uppercase tracking-wider block mb-1">
                Step 3
              </span>
              <div className="font-bold text-xs text-[#0B2B26] group-hover:text-[#235347] transition-colors">
                Visual Video Suite
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">3 Joyful Lessons</p>
            </div>
            <span className="mt-2 text-[10px] text-[#235347] font-semibold">On-site MP4s</span>
          </Link>

          <Link
            href="/care-plan"
            className="p-3.5 rounded-2xl bg-white border border-[#D5E8DA] hover:border-[#8EB69B] hover:shadow-xs transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <span className="text-[10px] font-black text-[#235347] uppercase tracking-wider block mb-1">
                Step 4
              </span>
              <div className="font-bold text-xs text-[#0B2B26] group-hover:text-[#235347] transition-colors">
                Child Care Plan
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Dr. Reddy Roadmap</p>
            </div>
            <span className="mt-2 text-[10px] text-[#235347] font-semibold">Sensory Paced</span>
          </Link>

          <Link
            href="/assistant"
            className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white border border-[#D5E8DA] hover:border-[#8EB69B] hover:shadow-xs transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <span className="text-[10px] font-black text-[#235347] uppercase tracking-wider block mb-1">
                Step 5
              </span>
              <div className="font-bold text-xs text-[#0B2B26] group-hover:text-[#235347] transition-colors">
                Argus AI Assistant
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Simple Steps Q&A</p>
            </div>
            <span className="mt-2 text-[10px] text-[#235347] font-semibold">24/7 Support</span>
          </Link>
        </div>
      </div>

      {/* ── 3. Step 2 in Action: Child's Daily Oral Hygiene Checklist ── */}
      <div id="daily-checklist" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#051F20] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#235347]" />
              Child&apos;s Daily Oral Hygiene Checklist
            </h2>
            <p className="text-xs text-slate-500">
              {formattedToday} • Routine telemetry for active clinical monitoring
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isTodayLogged ? (
              <span className="px-3 py-1 rounded-full bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#235347]" /> Logged for Today
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Today&apos;s Routine
              </span>
            )}
          </div>
        </div>

        {/* If ALREADY logged today, show a clean, reassuring confirmation card (NEVER re-prompt) */}
        {isTodayLogged ? (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5E8DA] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5E8DA]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DAF1DE] border border-[#8EB69B] text-[#051F20] flex items-center justify-center">
                  <Check className="w-5 h-5 stroke-[2.5] text-[#235347]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#051F20]">
                    Today&apos;s Oral Hygiene Routine Successfully Logged
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data recorded in database and synced with monitoring telemetry & Argus AI.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/monitoring"
                  className="px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>View Full Monitoring Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Summary of Today's Log */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA]">
                <span className="text-slate-500 block text-[11px]">Morning Brushing</span>
                <span className="font-semibold text-[#235347] mt-0.5 block">
                  {todayLogData?.brushedMorning ? "✓ Completed" : "Not Logged"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA]">
                <span className="text-slate-500 block text-[11px]">Bedtime Brushing</span>
                <span className="font-semibold text-[#235347] mt-0.5 block">
                  {todayLogData?.brushedNight ? "✓ Completed" : "Scheduled Tonight"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA]">
                <span className="text-slate-500 block text-[11px]">Dietary Balance</span>
                <span className="font-semibold text-[#051F20] mt-0.5 block">
                  {todayLogData?.healthyBreakfast && todayLogData?.healthyLunch ? "Healthy Meals" : "Standard"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA]">
                <span className="text-slate-500 block text-[11px]">Child Cooperation</span>
                <span className="font-semibold text-[#235347] mt-0.5 block">
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
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5E8DA] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D5E8DA]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B]">
                    Weekly Assessment • {latestAssessment.date}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#051F20] mt-0.5">
                  {latestAssessment.motivationBadge?.title || "Routine Consistency Champion"}
                </h3>
              </div>
            </div>

            <Link
              href="/assessment"
              className="px-3.5 py-1.5 rounded-xl bg-[#DAF1DE]/40 hover:bg-[#DAF1DE] text-[#0B2B26] border border-[#D5E8DA] font-semibold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <span>Weekly Telemetry & Certificate</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA] flex items-center justify-between">
              <span className="text-slate-500">Oral Hygiene Index:</span>
              <span className="text-sm font-bold text-[#235347]">{latestAssessment.oralHygieneScore}%</span>
            </div>
            <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA] flex items-center justify-between">
              <span className="text-slate-500">Enamel Dietary Risk:</span>
              <span className="text-sm font-bold text-amber-700">{latestAssessment.dietaryRiskScore}%</span>
            </div>
            <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA] flex items-center justify-between">
              <span className="text-slate-500">Sensory Comfort Index:</span>
              <span className="text-sm font-bold text-[#235347]">{latestAssessment.sensoryComfortScore}%</span>
            </div>
          </div>

          <p className="text-xs text-[#0B2B26] italic bg-[#DAF1DE]/40 p-3 rounded-xl border border-[#8EB69B]/40">
            “{latestAssessment.statusSummary}”
          </p>
        </div>
      )}

      {/* ── ON-SITE VIDEO SUITE PREVIEW ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#051F20] flex items-center gap-2">
              <Play className="w-4 h-4 text-[#235347]" />
              Visual Learning & Motivational Videos
            </h2>
            <p className="text-xs text-slate-500">
              On-site video lessons stored directly on our servers (no external links)
            </p>
          </div>

          <Link href="/learning" className="text-xs font-semibold text-[#235347] hover:text-[#051F20] flex items-center gap-1">
            Open Video Suite <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/learning"
            className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#DAF1DE] text-[#051F20] flex items-center justify-center font-bold text-xs mb-3 border border-[#8EB69B]">
                01
              </div>
              <h3 className="font-bold text-sm text-[#0B2B26] group-hover:text-[#235347] transition-colors">
                Step-by-Step Brushing
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Child showing the 5 brushing steps with pure joy, gentle circles, and zero sensory fear.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#D5E8DA] text-xs font-semibold text-[#235347] flex items-center gap-1">
              <span>Watch Video Module</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/learning"
            className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs mb-3 border border-amber-200">
                02
              </div>
              <h3 className="font-bold text-sm text-[#0B2B26] group-hover:text-amber-700 transition-colors">
                Diet Motivation: Shiny vs. Bugs
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Healthy food makes teeth shiny like diamonds. Unhealthy chocolates and soda feed bacteria that eat teeth and turn them black.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#D5E8DA] text-xs font-semibold text-amber-700 flex items-center gap-1">
              <span>Watch Video Module</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/learning"
            className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#DAF1DE] text-[#051F20] flex items-center justify-center font-bold text-xs mb-3 border border-[#8EB69B]">
                03
              </div>
              <h3 className="font-bold text-sm text-[#0B2B26] group-hover:text-[#235347] transition-colors">
                God Blesses Joyful Brushers
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Cleanliness is Godliness: caring for your mouth and teeth brings health, peace, and divine blessings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#D5E8DA] text-xs font-semibold text-[#235347] flex items-center gap-1">
              <span>Watch Video Module</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── STORED CLINICAL BASELINE (5 DOMAINS) ── */}
      {activeChild && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5E8DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5E8DA]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#051F20] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#235347]" />
                Step 1: Stored Baseline Assessment (Intake Record)
              </h3>
              <p className="text-xs text-slate-500">
                Calibrated against {activeChild.name}&apos;s profile on record • Never re-prompted
              </p>
            </div>

            <Link
              href="/assessment?tab=baseline"
              className="text-xs font-semibold text-[#235347] hover:text-[#051F20] flex items-center gap-1"
            >
              <span>View Full Baseline Assessment</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA]">
              <span className="text-[#051F20] font-bold block mb-1">1. Demographics</span>
              <div className="text-slate-800 font-medium">{activeChild.name}, {activeChild.age} yrs</div>
              <div className="text-[10px] text-slate-500 truncate">{activeChild.demographics?.communicationStyle}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA]">
              <span className="text-[#051F20] font-bold block mb-1">2. Brushing</span>
              <div className="text-slate-800 font-medium">{activeChild.brushingHabits?.toothbrushType || "Soft manual"}</div>
              <div className="text-[10px] text-slate-500">{activeChild.brushingHabits?.frequency || "Twice daily"}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA]">
              <span className="text-[#051F20] font-bold block mb-1">3. Diet</span>
              <div className="text-slate-800 font-medium">Sugar: {activeChild.dietaryHabits?.sugaryFoodFrequency || "Rarely"}</div>
              <div className="text-[10px] text-slate-500">Snacks: {activeChild.dietaryHabits?.snackingFrequency || "1-2 times"}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA]">
              <span className="text-[#051F20] font-bold block mb-1">4. Dental History</span>
              <div className="text-slate-800 font-medium">{activeChild.dentalMedicalHistory?.lastDentalVisit || "Regular"}</div>
              <div className="text-[10px] text-slate-500">{activeChild.dentalMedicalHistory?.activeCavitiesOrPain || "None active"}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#DAF1DE]/30 border border-[#D5E8DA]">
              <span className="text-[#051F20] font-bold block mb-1">5. Sensory/Behavior</span>
              <div className="text-slate-800 font-medium truncate">{activeChild.childBehaviour?.sensoryAversionTriggers?.slice(0, 2).join(", ") || "Standard"}</div>
              <div className="text-[10px] text-slate-500">{activeChild.childBehaviour?.mouthOpeningCooperation || "Cooperative"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
