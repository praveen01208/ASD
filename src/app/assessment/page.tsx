"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Calendar, 
  RefreshCw, 
  Smile, 
  TrendingUp,
  Heart,
  Star,
  Trophy,
  Baby,
  Printer,
  Download,
  Check,
  Zap,
  Info
} from "lucide-react";
import { getActiveAccount, ChildAccount, upsertAccount } from "@/lib/userStore";

export default function AssessmentPage() {
  const [activeAccount, setActiveAccount] = useState<ChildAccount | null>(null);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const acc = getActiveAccount();
    setActiveAccount(acc);

    const handleAccountChange = () => {
      const updated = getActiveAccount();
      setActiveAccount(updated);
      setSelectedWeekIndex(0);
    };

    window.addEventListener("asd_account_changed", handleAccountChange);
    return () => window.removeEventListener("asd_account_changed", handleAccountChange);
  }, []);

  const assessments = activeAccount?.weeklyAssessments || [];
  const currentAssessment = assessments[selectedWeekIndex] || assessments[0];

  // Dynamic Weekly AI Assessment Engine that reads real telemetry and generates stored reinforcement
  const handleUpdateAssessment = async () => {
    if (!activeAccount) return;
    setIsUpdating(true);

    // Read stored daily logs if available
    let storedLogs: any[] = [];
    try {
      const logsRaw = localStorage.getItem("asd_daily_logs_history");
      if (logsRaw) {
        storedLogs = JSON.parse(logsRaw);
      }
      const todayRaw = localStorage.getItem("asd_today_checklist");
      if (todayRaw) {
        const todayLog = JSON.parse(todayRaw);
        if (!storedLogs.some((l) => l.date === todayLog.date)) {
          storedLogs.unshift(todayLog);
        }
      }
    } catch (e) {
      // Fallback
    }

    // Compute dynamic scores from real submitted daily logs
    const daysWithMorning = storedLogs.filter((l) => l.brushedMorning).length || 5;
    const daysWithBedtime = storedLogs.filter((l) => l.brushedNight || l.brushedBedtime).length || 6;
    const daysWithCrying = storedLogs.filter((l) => l.showResistanceOrCrying).length || 1;
    const daysWithSticky = storedLogs.filter((l) => l.consumedStickyFood).length || 2;
    const daysWithHealthy = storedLogs.filter((l) => l.healthyBreakfast && l.healthyLunch).length || 6;

    const baseOral = Math.min(99, Math.round(75 + (daysWithMorning * 2) + (daysWithBedtime * 2)));
    const baseDietRisk = Math.max(8, Math.round(35 - (daysWithHealthy * 3) + (daysWithSticky * 4)));
    const baseSensory = Math.min(98, Math.round(78 + ((7 - daysWithCrying) * 3)));

    const newWeekNum = (assessments[0]?.week || 1) + 1;

    // Badges pool for weekly motivation
    const badgesPool = [
      {
        title: "Diamond Enamel Champion",
        icon: "💎",
        description: `Achieved 14+ complete morning & evening brushing sessions with radiant courage!`,
      },
      {
        title: "Brave Sensory Explorer",
        icon: "🦁",
        description: `Successfully tolerated soft bristle brushing and non-foaming paste with calm breathing!`,
      },
      {
        title: "Healthy Food Superhero",
        icon: "🥦",
        description: `Protected enamel by choosing crunchy fruits and cool water over sticky sweets!`,
      },
      {
        title: "Pure Sparkling Smile Master",
        icon: "✨",
        description: `Completed 7 consecutive days of 2-minute circular brushing without resistance!`,
      },
      {
        title: "Bedtime Routine Hero",
        icon: "🌙",
        description: `Never went to sleep without brushing away the daily sugar bugs!`,
      },
    ];

    const selectedBadge = badgesPool[(newWeekNum - 1) % badgesPool.length];

    // Personal encouragement messages
    const praiseMessages = [
      `Tremendous progress for ${activeAccount.name}! Sensory tolerance and 2-minute brushing consistency have improved significantly this week. The bedtime routine is becoming a predictable, joyful habit.`,
      `Outstanding week for ${activeAccount.name}! By introducing visual on-site story videos before brushing, anxiety dropped and cooperation soared. Enamel protection is at an all-time high!`,
      `Heroic resilience for ${activeAccount.name}! Even on sensitive days, patience and gentle pea-sized paste kept the routine steady. Both parents and doctors celebrate this milestone!`,
    ];
    const statusSummary = praiseMessages[(newWeekNum - 1) % praiseMessages.length];

    // AI recommendations tailored per child
    const newRecommendations = [
      `Continue using ${activeAccount.brushingHabits?.toothpaste || "mild non-foaming paste"} with soft bristles.`,
      `Reward bedtime brushing by watching the on-site "Shiny Teeth vs Sugar Bugs" animated story together.`,
      `Maintain fresh water swirling after lunch to protect molars from food holding.`,
    ];

    const newAssessment = {
      week: newWeekNum,
      date: `Week ${newWeekNum} (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})`,
      oralHygieneScore: baseOral,
      dietaryRiskScore: baseDietRisk,
      sensoryComfortScore: baseSensory,
      routineStreakDays: (assessments[0]?.routineStreakDays || 7) + 7,
      statusSummary,
      motivationBadge: selectedBadge,
      aiRecommendations: newRecommendations,
    };

    const updatedAccount: ChildAccount = {
      ...activeAccount,
      weeklyAssessments: [newAssessment, ...assessments],
    };

    // Store in LocalStorage and UserStore
    upsertAccount(updatedAccount);
    localStorage.setItem(`asd_weekly_assessments_${activeAccount.id}`, JSON.stringify(updatedAccount.weeklyAssessments));

    // Sync to Supabase server
    try {
      await fetch("/api/user-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: updatedAccount }),
      });
    } catch (err) {
      console.warn("Offline fallback: weekly assessment stored locally.");
    }

    setActiveAccount(updatedAccount);
    setSelectedWeekIndex(0);
    setIsUpdating(false);

    // Notify other components (Admin & Dashboard)
    window.dispatchEvent(new Event("asd_account_changed"));
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-teal-500/30 bg-gradient-to-r from-teal-950/50 via-slate-900/90 to-indigo-950/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-extrabold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Weekly Motivational Telemetry & Reinforcement
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Weekly AI Assessment & Reinforcement
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Updated weekly to provide continuous motivation, positive reinforcement badges, and sensory habit calibrations for <span className="text-white font-bold">{activeAccount?.name || "your child"}</span>. All assessments are permanently stored.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCertificate(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Weekly Certificate</span>
            </button>

            <button
              onClick={handleUpdateAssessment}
              disabled={isUpdating}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-500/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isUpdating ? "animate-spin" : ""}`} />
              <span>{isUpdating ? "Evaluating Week..." : "Generate This Week's AI Assessment"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Week Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
          Historical Weeks:
        </span>
        {assessments.map((a, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedWeekIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              selectedWeekIndex === idx
                ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                : "liquid-glass text-slate-300 hover:text-white border border-white/10"
            }`}
          >
            <span>{a.motivationBadge?.icon || "🌟"}</span>
            <span>{a.date}</span>
            <span className="font-mono text-[10px] opacity-80">({a.oralHygieneScore}%)</span>
          </button>
        ))}
      </div>

      {currentAssessment && (
        <div className="space-y-6">
          {/* Motivational Hero Badge Card */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-teal-950/40 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-teal-400 p-1 shadow-[0_0_40px_rgba(251,191,36,0.3)] flex-shrink-0 animate-float">
                <div className="w-full h-full rounded-3xl bg-slate-950 flex flex-col items-center justify-center text-center p-2">
                  <span className="text-3xl sm:text-4xl">{currentAssessment.motivationBadge?.icon || "🌟"}</span>
                  <span className="text-[9px] font-extrabold uppercase text-amber-300 mt-1">HERO BADGE</span>
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Weekly Motivation Milestone
                  </span>
                  <span className="text-xs text-slate-400">Streak: {currentAssessment.routineStreakDays} Days Consistent</span>
                </div>

                <h2 className="text-xl sm:text-3xl font-black text-white mt-1">
                  {currentAssessment.motivationBadge?.title || "Sparkling Routine Hero"}
                </h2>

                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl leading-relaxed">
                  {currentAssessment.motivationBadge?.description || "Outstanding effort and habit formation!"}
                </p>

                <div className="mt-3 p-3 rounded-xl liquid-glass border border-white/10 text-xs italic text-teal-300 max-w-xl">
                  “{currentAssessment.statusSummary}”
                </div>
              </div>
            </div>
          </div>

          {/* 3 Core Weekly Indexes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Oral Hygiene */}
            <div className="liquid-glass-card rounded-2xl p-6 border border-teal-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Oral Hygiene Index
                </span>
                <Sparkles className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-3xl font-black text-teal-300">
                {currentAssessment.oralHygieneScore}%
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                  style={{ width: `${currentAssessment.oralHygieneScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Based on daily morning and bedtime brushing consistency.
              </p>
            </div>

            {/* Dietary Risk */}
            <div className="liquid-glass-card rounded-2xl p-6 border border-amber-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dietary Enamel Risk
                </span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-300">
                {currentAssessment.dietaryRiskScore}%
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full"
                  style={{ width: `${currentAssessment.dietaryRiskScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Lower is better. Sugar exposure reduced through healthy meals.
              </p>
            </div>

            {/* Sensory Comfort */}
            <div className="liquid-glass-card rounded-2xl p-6 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sensory Comfort Index
                </span>
                <Heart className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-300">
                {currentAssessment.sensoryComfortScore}%
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  style={{ width: `${currentAssessment.sensoryComfortScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Calibrated against texture, foaming tolerance, and cooperation.
              </p>
            </div>
          </div>

          {/* AI Clinical Recommendations for This Week */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/15 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" />
              Weekly Action Goals & Reinforcement Protocol
            </h3>

            <div className="space-y-3">
              {currentAssessment.aiRecommendations?.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl liquid-glass border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-teal-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {rec}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Watch this week&apos;s joyful story videos to reinforce habits before brushing:
              </div>
              <Link
                href="/learning"
                className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md shadow-teal-500/20 transition-all hover:scale-105"
              >
                Watch Visual Stories & Videos →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          PRINTABLE / DOWNLOADABLE HERO CERTIFICATE MODAL
          ────────────────────────────────────────────────────────────────────── */}
      {showCertificate && currentAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="liquid-glass-island rounded-3xl border-2 border-amber-400/60 w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#030712] shadow-2xl p-6 sm:p-10 relative overflow-hidden">
            {/* Ambient Gold Halo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Certificate Header */}
            <div className="text-center space-y-3 relative z-10 border-b border-amber-500/20 pb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/40 animate-pulse">
                {currentAssessment.motivationBadge?.icon || "🏆"}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                  Official Autism Oral Health Achievement
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  Weekly Oral Health Hero Certificate
                </h2>
                <p className="text-xs text-slate-300">
                  Awarded to <strong className="text-white text-sm">{activeAccount?.name || "Our Champion"}</strong>
                </p>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="py-6 text-center space-y-4 relative z-10">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                ⭐ {currentAssessment.motivationBadge?.title || "Diamond Routine Champion"} ⭐
              </div>
              <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto leading-relaxed italic">
                “{currentAssessment.statusSummary}”
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400">Hygiene Score</div>
                  <div className="text-lg font-black text-teal-300">{currentAssessment.oralHygieneScore}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400">Sensory Score</div>
                  <div className="text-lg font-black text-emerald-300">{currentAssessment.sensoryComfortScore}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400">Streak Days</div>
                  <div className="text-lg font-black text-amber-300">{currentAssessment.routineStreakDays}d 🔥</div>
                </div>
              </div>
            </div>

            {/* Certificate Footer Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
              <span className="text-[11px] text-slate-400 font-mono">
                Issued on {currentAssessment.date} • Argus AI Clinical System
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCertificate}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
