"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  ChevronRight,
  Smile,
  AlertTriangle,
  ClipboardList,
  Users,
  Play,
  Heart,
  Star,
  Award,
  Stethoscope,
  Brain
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

  // If visitor is signed out, render LandingPage directly without any delay or sidebar
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setIsCheckingProfile(false);
      return;
    }

    const checkAndLoad = async () => {
      try {
        setIsCheckingProfile(true);
        if (user?.id) {
          const serverProfile = await fetchUserProfileFromServer(user.id);
          const localProfile = getUserProfile(user.id);
          const resolved = serverProfile || localProfile;

          if (resolved) {
            setActiveChild(resolved);
            setHasCompletedOnboarding(true);
          } else {
            // First time user: provide default account context & show setup questionnaire banner
            const fallback = getActiveAccount(user.id) || DEFAULT_ACCOUNTS[0];
            setActiveChild(fallback);
            setHasCompletedOnboarding(false);
          }
        } else {
          const fallback = getActiveAccount() || DEFAULT_ACCOUNTS[0];
          setActiveChild(fallback);
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
        if (updated) setActiveChild(updated);
      }
    };

    window.addEventListener("asd_account_changed", handleAccountChange);
    return () => window.removeEventListener("asd_account_changed", handleAccountChange);
  }, [isLoaded, isSignedIn, user?.id, router]);

  // If auth is loaded and user is signed out, render the landing page directly
  if (isLoaded && !isSignedIn) {
    return <LandingPage />;
  }

  // Brief loading spinner while checking user profile
  if (!isLoaded || isCheckingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-300">
        <div className="w-10 h-10 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-slate-400">Loading your child's care portal...</span>
      </div>
    );
  }

  const childName = activeChild?.name || (user?.user_metadata?.name ? `${user.user_metadata.name}'s Child` : "Your Child");
  const childCode = activeChild?.code || "ASD-001";
  const caregiverName = activeChild?.caregiverName || user?.user_metadata?.full_name || user?.user_metadata?.name || "Caregiver";
  const asdLevel = activeChild?.asdLevel || "Registered ASD Profile";
  const latestAssessment = activeChild?.weeklyAssessments?.[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      {/* =========================================================================
          TAGLINE BANNER / VALUE PROPOSITION
          ========================================================================= */}
      <div className="liquid-glass-card rounded-3xl p-5 sm:p-6 border border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-teal-400/40 p-1 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
            <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-teal-300 text-xs sm:text-sm font-black tracking-tight">
              “Small steps, consistent routines, healthier smiles.”
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
              A simple, predictable digital space for parents and caregivers of children with ASD
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/helpline"
            className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-rose-400" />
            <span>24/7 Helpline: 9284046972</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          FIRST-TIME LOGIN BANNER IF APPLICABLE
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
                  Initial Setup (5 Domains)
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">Complete Child Baseline Questionnaire</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Answer demographic details, brushing habits, dietary habits, medical history, and child behaviour to calibrate sensory desensitization.
              </p>
            </div>
          </div>

          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 text-xs font-black shadow-lg shadow-teal-500/30 transition-all hover:scale-105 whitespace-nowrap text-center"
          >
            Start Setup (3 Mins) →
          </Link>
        </div>
      )}

      {/* =========================================================================
          DASHBOARD MAIN HEADER
          ========================================================================= */}
      <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-extrabold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Active Child Profile: {childName} ({childCode}) • {asdLevel}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Good day, {caregiverName}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Sensory desensitization schedule, weekly AI progress updates, and structured oral care routines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/helpline"
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-rose-500/10"
            >
              <Phone className="w-4 h-4" />
              <span>Helpline: 9284046972</span>
            </Link>

            <Link
              href="/consultants"
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-500/10"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Consultants Panel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          WEEKLY AI ASSESSMENT & MOTIVATIONAL REINFORCEMENT
          ========================================================================= */}
      {latestAssessment && (
        <div className="liquid-glass-card rounded-3xl p-6 border border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-2xl flex items-center justify-center">
                {latestAssessment.motivationBadge?.icon || "🌟"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
                    Weekly AI Assessment • {latestAssessment.date}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  {latestAssessment.motivationBadge?.title || "Sparkling Routine Hero"}
                </h3>
              </div>
            </div>

            <Link
              href="/assessment"
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/20 self-start sm:self-auto"
            >
              <span>Weekly AI Details</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl liquid-glass border border-white/10 flex items-center justify-between">
              <span className="text-slate-300">Oral Hygiene Score:</span>
              <span className="text-base font-black text-teal-300">{latestAssessment.oralHygieneScore}%</span>
            </div>
            <div className="p-3 rounded-xl liquid-glass border border-white/10 flex items-center justify-between">
              <span className="text-slate-300">Enamel Dietary Risk:</span>
              <span className="text-base font-black text-amber-300">{latestAssessment.dietaryRiskScore}%</span>
            </div>
            <div className="p-3 rounded-xl liquid-glass border border-white/10 flex items-center justify-between">
              <span className="text-slate-300">Sensory Comfort:</span>
              <span className="text-base font-black text-emerald-300">{latestAssessment.sensoryComfortScore}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 italic">
            “{latestAssessment.statusSummary}”
          </p>
        </div>
      )}

      {/* =========================================================================
          CATCHY ON-SITE ANIMATED VIDEOS PREVIEW ROW
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-teal-400 fill-teal-400/20" />
              On-Site Visual Learning & Catchy Video Stories
            </h2>
            <p className="text-xs text-slate-300">
              Interactive video modules to motivate your child before and after daily routines
            </p>
          </div>

          <Link href="/learning" className="text-xs font-bold text-teal-300 hover:underline flex items-center gap-1">
            Open Video Suite <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/learning"
            className="liquid-glass-card rounded-2xl p-5 border border-white/15 hover:border-teal-400/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xl mb-3 group-hover:scale-110 transition-transform">
                🪥
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                1. Step-by-Step Brushing
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Cheerful child character demonstrating 2-minute brushing steps with joy and celebratory chimes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-teal-300 flex items-center gap-1">
              <span>Play Interactive Video</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/learning"
            className="liquid-glass-card rounded-2xl p-5 border border-white/15 hover:border-amber-400/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xl mb-3 group-hover:scale-110 transition-transform">
                🍎
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                2. Sparkle vs Sugar Bugs
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Watch healthy food make teeth shiny while sugary chocolates feed bacteria until brushing saves the day!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-amber-300 flex items-center gap-1">
              <span>Play Story Simulation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/learning"
            className="liquid-glass-card rounded-2xl p-5 border border-white/15 hover:border-indigo-400/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xl mb-3 group-hover:scale-110 transition-transform">
                🌟
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                3. God Blesses Joyful Brushers
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Heartwarming animated story showing how taking care of your teeth brings divine blessings, glowing health, and sweet dreams.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-indigo-300 flex items-center gap-1">
              <span>Play Motivational Video</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          5 STORED INTAKE DOMAINS SUMMARY CARD
          ========================================================================= */}
      {activeChild && (
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-7 border border-white/15 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                Stored Clinical Baseline (5 Domains)
              </h3>
              <p className="text-xs text-slate-300">
                Calibrated against {activeChild.name}&apos;s profile on record
              </p>
            </div>

            <Link
              href="/onboarding"
              className="text-xs font-bold text-teal-300 hover:underline"
            >
              Update Baseline Form →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl liquid-glass border border-white/10">
              <span className="text-teal-300 font-bold block mb-1">1. Demographics</span>
              <div className="text-slate-200">{activeChild.name}, {activeChild.age} yrs</div>
              <div className="text-[10px] text-slate-400 truncate">{activeChild.demographics?.communicationStyle}</div>
            </div>

            <div className="p-3 rounded-xl liquid-glass border border-white/10">
              <span className="text-teal-300 font-bold block mb-1">2. Brushing</span>
              <div className="text-slate-200 truncate">{activeChild.brushingHabits?.frequency}</div>
              <div className="text-[10px] text-slate-400 truncate">{activeChild.brushingHabits?.toothbrushType}</div>
            </div>

            <div className="p-3 rounded-xl liquid-glass border border-white/10">
              <span className="text-teal-300 font-bold block mb-1">3. Diet</span>
              <div className="text-slate-200 truncate">{activeChild.dietaryHabits?.sugaryFoodFrequency}</div>
              <div className="text-[10px] text-slate-400 truncate">Holding: {activeChild.dietaryHabits?.foodHoldingInMouth}</div>
            </div>

            <div className="p-3 rounded-xl liquid-glass border border-white/10">
              <span className="text-teal-300 font-bold block mb-1">4. Medical</span>
              <div className="text-slate-200 truncate">{activeChild.dentalMedicalHistory?.activeCavitiesOrPain}</div>
              <div className="text-[10px] text-slate-400 truncate">Visit: {activeChild.dentalMedicalHistory?.lastDentalVisit}</div>
            </div>

            <div className="p-3 rounded-xl liquid-glass border border-white/10">
              <span className="text-teal-300 font-bold block mb-1">5. Behaviour</span>
              <div className="text-slate-200 truncate">{activeChild.childBehaviour?.mouthOpeningCooperation}</div>
              <div className="text-[10px] text-slate-400 truncate">Triggers: {activeChild.childBehaviour?.sensoryAversionTriggers?.length || 0} active</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DAILY HYGIENE LOGGING
          ========================================================================= */}
      <DailyHygieneChecklist />
    </div>
  );
}
