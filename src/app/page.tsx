"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { 
  Activity, 
  Flame, 
  Shield, 
  ArrowUpRight, 
  ArrowDownRight, 
  Video, 
  Apple, 
  CheckCircle2, 
  MessageSquareHeart, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  ChevronRight,
  Smile,
  AlertTriangle,
  ClipboardList
} from "lucide-react";
import DailyHygieneChecklist from "@/components/DailyHygieneChecklist";

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  // Redirect unauthenticated visitors to the landing page
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/landing");
    }
  }, [isLoaded, isSignedIn, router]);

  // Load onboarding state from localStorage (must be before any early return)
  useEffect(() => {
    const isCompleted = localStorage.getItem("asd_onboarding_completed");
    const savedData = localStorage.getItem("asd_onboarding_data");

    if (savedData) {
      try {
        setProfileData(JSON.parse(savedData));
      } catch (e) {
        console.error(e);
      }
    }

    // Default to completed for demo if not set, or show initial gate
    if (isCompleted === "false") {
      setHasCompletedOnboarding(false);
    }
  }, []);

  // Show spinner while Clerk loads or redirect is in flight
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030712]">
        <div className="w-10 h-10 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const doctorWhatsapp = "https://wa.me/917758022942?text=" + encodeURIComponent(
    "Hello Dr. Nivrutti Reddy, I am contacting you through the ASD Oral Care AI Platform regarding child ASD-001."
  );

  const childName = profileData?.childName || "Leo (ASD-001)";
  const caregiverName = profileData?.guardianName || "Caregiver";
  const asdLevel = profileData?.asdLevel || "Level 1 (Mild Support)";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* =========================================================================
          FIRST-TIME LOGIN BANNER (ONLY SHOWN ONCE IF ONBOARDING NOT COMPLETED)
          ========================================================================= */}
      {!hasCompletedOnboarding && (
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-7 border border-teal-400/50 flex flex-col sm:flex-row items-center justify-between gap-5 bg-gradient-to-r from-teal-950/60 via-slate-900/80 to-indigo-950/60 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/25 border border-teal-400/40 text-teal-300 flex items-center justify-center flex-shrink-0 shadow-lg">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Initial Setup Required (One-Time)
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">Complete Child Baseline Questionnaire</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Please complete the 20-question baseline once so our clinical AI engine can calibrate sensory tolerance and desensitization routines for your child.
              </p>
            </div>
          </div>

          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 text-xs font-black shadow-lg shadow-teal-500/30 transition-all hover:scale-105 whitespace-nowrap text-center"
          >
            Start Setup (5 Mins) →
          </Link>
        </div>
      )}

      {/* =========================================================================
          DASHBOARD HEADER (FOR LOGGED IN CAREGIVER)
          ========================================================================= */}
      <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-extrabold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Child Profile: {childName} • {asdLevel}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Good morning, {caregiverName}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Supervised clinical oral telemetry, sensory desensitization plan, and daily habit tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={doctorWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-500/10"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-300/30" />
              <span>WhatsApp Dr. Nivrutti Reddy</span>
            </a>

            <a
              href="tel:+917758022942"
              className="p-2.5 rounded-xl liquid-glass-pill hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/15"
              title="Call Dr. Reddy"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KEY TELEMETRY METRICS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="liquid-glass-card rounded-3xl p-6 border border-white/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-teal-400 font-semibold mb-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Activity className="h-4 w-4" />
              </div>
              <span>Oral Hygiene Index</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
              Optimal
            </span>
          </div>
          <div className="text-4xl font-black text-white">78%</div>
          <div className="mt-4 text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            +8% weekly compliance gain
          </div>
        </div>

        <div className="liquid-glass-card rounded-3xl p-6 border border-white/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-orange-400 font-semibold mb-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Flame className="h-4 w-4" />
              </div>
              <span>Dietary Plaque Risk</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">
              Moderate
            </span>
          </div>
          <div className="text-4xl font-black text-white">62%</div>
          <div className="mt-4 text-xs font-semibold text-amber-400 flex items-center gap-1">
            <ArrowDownRight className="h-3.5 w-3.5" />
            -6% sugar snacking exposure
          </div>
        </div>

        <div className="liquid-glass-card rounded-3xl p-6 border border-white/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-400 font-semibold mb-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Shield className="h-4 w-4" />
              </div>
              <span>Sensory Comfort</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              Calm
            </span>
          </div>
          <div className="text-4xl font-black text-white">82%</div>
          <div className="mt-4 text-xs font-semibold text-indigo-300 flex items-center gap-1">
            Accepting 3-sided manual soft brush
          </div>
        </div>
      </div>

      {/* =========================================================================
          DAILY HYGIENE CHECKLIST (LIQUID GLASS)
          ========================================================================= */}
      <DailyHygieneChecklist />

      {/* =========================================================================
          TODAY'S SCHEDULE & AI CARE PLAN
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Today&apos;s Sensory Schedule</h2>
            <span className="text-xs text-slate-400">Calibrated for {childName}</span>
          </div>

          <div className="liquid-glass-card rounded-3xl border border-white/15 divide-y divide-white/10 overflow-hidden">
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="bg-teal-500/20 border border-teal-500/30 text-teal-400 p-2.5 rounded-2xl mt-0.5">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Bedtime Posterior Brushing (2 Min)</h3>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">Use unflavored paste with 3-sided soft brush on molars.</p>
                </div>
              </div>
              <Link
                href="/learning"
                className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-extrabold transition-all whitespace-nowrap shadow-sm shadow-teal-500/20"
              >
                Visual Routine
              </Link>
            </div>
            
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-2xl mt-0.5">
                  <Apple className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Low-Sugar Fibrous Snack</h3>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">Crunchy cucumber slices to stimulate natural salivary flow.</p>
                </div>
              </div>
              <Link
                href="/care-plan"
                className="px-4 py-2 rounded-xl liquid-glass-pill hover:bg-white/10 text-slate-200 text-xs font-bold transition-all whitespace-nowrap"
              >
                Dietary Guide
              </Link>
            </div>

            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 p-2.5 rounded-2xl mt-0.5">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Visual Social Story Video</h3>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">Review 45-second visual countdown card before bathroom visit.</p>
                </div>
              </div>
              <Link
                href="/learning"
                className="px-4 py-2 rounded-xl liquid-glass-pill hover:bg-white/10 text-slate-200 text-xs font-bold transition-all whitespace-nowrap"
              >
                Play Video
              </Link>
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Clinical AI Insight</h2>
            <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">Supervised</span>
          </div>

          <div className="liquid-glass-card p-6 rounded-3xl border border-white/15 flex flex-col justify-between space-y-4">
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-white/10">
              <div className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-1">
                Posterior Molars Attention
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Telemetry indicates Leo tends to skip inner tooth surfaces when rushed. Keep using the 2-minute visual countdown timer.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-teal-300 uppercase tracking-widest block">
                Next Recommendation
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adaptive desensitization plan calibrated for Leo&apos;s mild tactile sensitivity.
              </p>
              <Link
                href="/care-plan"
                className="block w-full text-center py-3 px-4 bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-300 hover:to-indigo-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all"
              >
                Open Full Care Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ASD BOT CHAT BAR
          ========================================================================= */}
      <div className="liquid-glass-card rounded-3xl border border-indigo-400/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/25 border border-indigo-400/50 text-indigo-300 flex items-center justify-center flex-shrink-0 shadow-md">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">ASD Bot</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/35">
                Active & Synced
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 font-normal">
              Instant advice on brushing meltdowns, sensory desensitization, and unflavored toothpaste selection.
            </p>
          </div>
        </div>

        <Link
          href="/assistant"
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 text-center whitespace-nowrap"
        >
          Chat with ASD Bot →
        </Link>
      </div>
    </div>
  );
}
