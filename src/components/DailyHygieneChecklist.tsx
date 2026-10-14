"use client";

import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  Apple, 
  CheckCircle2, 
  Smile, 
  Flame, 
  Sparkles, 
  Save, 
  Check,
  AlertTriangle,
  Droplets,
  Heart,
  ShieldAlert,
  Cookie,
  UtensilsCrossed,
  Sparkle
} from "lucide-react";
import { getActiveAccount, ChildAccount } from "@/lib/userStore";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export interface DailyOralHygieneLog {
  date: string;
  childId?: string;
  // Brushing
  brushedMorning: boolean;
  brushedNight: boolean;
  allowedTongueCleaning: boolean;
  usedAdditionalAids: boolean;

  // Diet
  healthyBreakfast: boolean;
  healthyLunch: boolean;
  consumedSugarySnacksDrinks: boolean;
  consumedSnacksBetweenMeals: boolean;
  consumedStickyFood: boolean;
  drankSufficientWater: boolean;
  healthyDinner: boolean;

  // Behavior
  brushesIndependently: boolean;
  cooperatedWithBrushing: boolean;
  showResistanceOrCrying: boolean;
}

const defaultLog: DailyOralHygieneLog = {
  date: new Date().toISOString().split("T")[0],
  // Brushing
  brushedMorning: true,
  brushedNight: false,
  allowedTongueCleaning: false,
  usedAdditionalAids: false,

  // Diet
  healthyBreakfast: true,
  healthyLunch: true,
  consumedSugarySnacksDrinks: false,
  consumedSnacksBetweenMeals: false,
  consumedStickyFood: false,
  drankSufficientWater: true,
  healthyDinner: true,

  // Behavior
  brushesIndependently: false,
  cooperatedWithBrushing: true,
  showResistanceOrCrying: false,
};

export default function DailyHygieneChecklist({ child }: { child?: ChildAccount | null }) {
  const { user } = useAuth();
  const [activeChild, setActiveChild] = useState<ChildAccount | null>(child || null);
  const [log, setLog] = useState<DailyOralHygieneLog>(defaultLog);
  const [isSaved, setIsSaved] = useState(false);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    if (child) {
      setActiveChild(child);
    } else {
      setActiveChild(getActiveAccount(user?.id));
    }

    const today = new Date().toISOString().split("T")[0];
    const childId = child?.id || activeChild?.id || "default";
    const storageKey = `asd_daily_hygiene_log_${childId}_${today}`;
    const genericKey = `asd_daily_hygiene_log_${today}`;

    const saved = localStorage.getItem(storageKey) || localStorage.getItem(genericKey);
    if (saved) {
      try {
        setLog(JSON.parse(saved));
      } catch (e) {
        console.error("Error reading saved daily log:", e);
      }
    }

    const handleChildChange = () => {
      setActiveChild(getActiveAccount(user?.id));
    };

    window.addEventListener("asd_account_changed", handleChildChange);
    return () => window.removeEventListener("asd_account_changed", handleChildChange);
  }, [child, user?.id]);

  const toggleField = (field: keyof Omit<DailyOralHygieneLog, "date" | "childId">) => {
    setLog((prev) => {
      const updated = { ...prev, [field]: !prev[field] };
      setIsSaved(false);
      return updated;
    });
  };

  const handleSave = async () => {
    const today = log.date || new Date().toISOString().split("T")[0];
    const childId = activeChild?.id || "default";
    const storageKey = `asd_daily_hygiene_log_${childId}_${today}`;
    const genericKey = `asd_daily_hygiene_log_${today}`;

    // 1. Save locally for instant reactivity and Argus context
    localStorage.setItem(storageKey, JSON.stringify(log));
    localStorage.setItem(genericKey, JSON.stringify(log));
    localStorage.setItem("asd_today_checklist", JSON.stringify(log));
    localStorage.setItem("asd_checklist_completed_today", today);

    try {
      const historyRaw = localStorage.getItem("asd_daily_logs_history");
      let history: any[] = historyRaw ? JSON.parse(historyRaw) : [];
      history = history.filter((h: any) => h.date !== today);
      history.unshift({ ...log, date: today });
      localStorage.setItem("asd_daily_logs_history", JSON.stringify(history.slice(0, 30)));
    } catch (e) {
      // ignore
    }

    // Dispatch event so Argus and other components react
    window.dispatchEvent(new CustomEvent("asd_daily_log_updated", { detail: log }));

    // 2. Sync to Supabase if configured
    if (supabase && activeChild) {
      try {
        // Attempt to sync to Supabase daily_logs or daily_oral_hygiene_logs
        await supabase.from("daily_logs").upsert({
          child_id: activeChild.id,
          date: today,
          brushed: log.brushedMorning || log.brushedNight,
          fluoridated_toothpaste: true,
          assistance_level: log.brushesIndependently ? "independent" : "partial",
          tolerance: log.showResistanceOrCrying ? "poor" : "good",
          brushing_resistance: log.showResistanceOrCrying ? "high" : "low",
          meals_count: (log.healthyBreakfast ? 1 : 0) + (log.healthyLunch ? 1 : 0) + (log.healthyDinner ? 1 : 0),
          snacks_count: log.consumedSnacksBetweenMeals ? 2 : 0,
          sugary_snacks_count: (log.consumedSugarySnacksDrinks ? 1 : 0) + (log.consumedStickyFood ? 1 : 0),
          water_intake: log.drankSufficientWater ? "good" : "poor",
        }, { onConflict: "child_id,date" });
      } catch (err) {
        console.warn("Supabase daily log sync skipped:", err);
      }
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Calculate completion percentage
  const calculateDailyScore = () => {
    const positiveFields: (keyof DailyOralHygieneLog)[] = [
      "brushedMorning",
      "brushedNight",
      "allowedTongueCleaning",
      "usedAdditionalAids",
      "healthyBreakfast",
      "healthyLunch",
      "healthyDinner",
      "drankSufficientWater",
      "cooperatedWithBrushing",
    ];
    let score = 0;
    positiveFields.forEach((f) => {
      if (log[f]) score++;
    });
    // Deduct slightly for risk items
    if (log.consumedStickyFood) score = Math.max(0, score - 0.5);
    if (log.showResistanceOrCrying) score = Math.max(0, score - 0.5);

    return Math.min(100, Math.round((score / positiveFields.length) * 100));
  };

  const score = calculateDailyScore();
  const childDisplayName = activeChild?.name || "Your Child";

  return (
    <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-sm relative space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Child&apos;s Daily Oral Hygiene Checklist
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Clinical telemetry for <span className="font-semibold text-teal-300">{childDisplayName}</span> ({activeChild?.code || "ASD Profile"})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold border border-orange-500/20">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            {streak} Day Streak
          </div>

          <div className="flex items-center gap-1.5 bg-teal-500/10 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            {score}% Today
          </div>
        </div>
      </div>

      {/* Checklist Domains Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =========================================================
            DOMAIN 1: BRUSHING (4 ITEMS)
            ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Brushing Habits
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold">4 Tasks</span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: "brushedMorning" as const,
                label: "Brushed teeth in the morning",
                icon: Sun,
                iconColor: "text-amber-400",
              },
              {
                id: "brushedNight" as const,
                label: "Brushed teeth before going to bed at night",
                icon: Moon,
                iconColor: "text-indigo-400",
              },
              {
                id: "allowedTongueCleaning" as const,
                label: "Allowed mouth/tongue cleaning",
                icon: Sparkle,
                iconColor: "text-teal-400",
              },
              {
                id: "usedAdditionalAids" as const,
                label: "Used additional aids (Floss, interdental brush)",
                icon: Sparkles,
                iconColor: "text-cyan-400",
              },
            ].map((item) => {
              const active = log[item.id];
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleField(item.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                    active
                      ? "bg-teal-500/15 border-teal-500/40 text-white shadow-sm"
                      : "liquid-glass border-white/10 text-slate-300 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${item.iconColor}`} />
                    <span className="text-xs font-medium leading-snug">{item.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border flex-shrink-0 transition-all ${
                      active
                        ? "bg-teal-400 border-teal-300 text-slate-950 font-black shadow-sm"
                        : "border-slate-700 bg-slate-900/60 group-hover:border-slate-500"
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            DOMAIN 2: DIET (7 ITEMS)
            ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5 text-emerald-400" /> Dietary Habits
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold">7 Tasks</span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: "healthyBreakfast" as const,
                label: "Healthy breakfast: fruits or juice, milk, etc.",
                risk: false,
              },
              {
                id: "healthyLunch" as const,
                label: "Lunch: healthy meal",
                risk: false,
              },
              {
                id: "consumedSugarySnacksDrinks" as const,
                label: "Consumed sugary snacks/ drinks",
                risk: true,
              },
              {
                id: "consumedSnacksBetweenMeals" as const,
                label: "Consumed snacks in between meals",
                risk: true,
              },
              {
                id: "consumedStickyFood" as const,
                label: "Consumed sticky food (chocolate)",
                risk: true,
              },
              {
                id: "drankSufficientWater" as const,
                label: "Drank sufficient water",
                risk: false,
              },
              {
                id: "healthyDinner" as const,
                label: "Dinner: Healthy meal",
                risk: false,
              },
            ].map((item) => {
              const active = log[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleField(item.id)}
                  className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                    active
                      ? item.risk
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-sm"
                        : "bg-emerald-500/15 border-emerald-500/40 text-white shadow-sm"
                      : "liquid-glass border-white/10 text-slate-300 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    {item.risk ? (
                      <Cookie className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-amber-400" : "text-slate-400"}`} />
                    ) : (
                      <Apple className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                    )}
                    <span className="text-xs font-medium leading-snug">{item.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border flex-shrink-0 transition-all ${
                      active
                        ? item.risk
                          ? "bg-amber-400 border-amber-300 text-slate-950 font-black shadow-sm"
                          : "bg-emerald-400 border-emerald-300 text-slate-950 font-black shadow-sm"
                        : "border-slate-700 bg-slate-900/60 group-hover:border-slate-500"
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            DOMAIN 3: BEHAVIOR (3 ITEMS)
            ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-purple-400" /> Child Behavior
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold">3 Tasks</span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: "brushesIndependently" as const,
                label: "Brushes independently",
                risk: false,
                icon: Smile,
                iconColor: "text-purple-400",
              },
              {
                id: "cooperatedWithBrushing" as const,
                label: "Cooperated with brushing",
                risk: false,
                icon: Heart,
                iconColor: "text-pink-400",
              },
              {
                id: "showResistanceOrCrying" as const,
                label: "Show Resistance/crying while brushing",
                risk: true,
                icon: AlertTriangle,
                iconColor: "text-rose-400",
              },
            ].map((item) => {
              const active = log[item.id];
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleField(item.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                    active
                      ? item.risk
                        ? "bg-rose-500/15 border-rose-500/40 text-rose-200 shadow-sm"
                        : "bg-purple-500/15 border-purple-500/40 text-purple-100 shadow-sm"
                      : "liquid-glass border-white/10 text-slate-300 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${item.iconColor}`} />
                    <span className="text-xs font-medium leading-snug">{item.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border flex-shrink-0 transition-all ${
                      active
                        ? item.risk
                          ? "bg-rose-500 border-rose-400 text-white font-black shadow-sm"
                          : "bg-purple-400 border-purple-300 text-slate-950 font-black shadow-sm"
                        : "border-slate-700 bg-slate-900/60 group-hover:border-slate-500"
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time AI Tip based on Today's Logs */}
          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/25 mt-4 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-teal-300">
              <Sparkles className="w-3.5 h-3.5" />
              Argus AI Real-time Calibration
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {log.showResistanceOrCrying
                ? `Sensory resistance logged today for ${childDisplayName}. Argus will emphasize non-verbal reassurance and 30-second pacing.`
                : log.consumedStickyFood
                ? "Sticky foods logged. Argus recommends a post-snack warm water rinse."
                : `Great routine today for ${childDisplayName}! Brushing cooperation strengthens the 7-day milestone badge.`}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Save Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Saves to clinical database and updates daily monitoring telemetry</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" /> Saved Today&apos;s Checklist!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Today&apos;s Checklist
            </>
          )}
        </button>
      </div>
    </div>
  );
}
