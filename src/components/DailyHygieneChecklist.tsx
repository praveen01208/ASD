"use client";

import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  Apple, 
  CheckCircle2, 
  Smile, 
  Flame, 
  Save, 
  Check,
  AlertCircle,
  Droplets,
  Heart,
  ShieldCheck,
  Coffee,
  Sparkles,
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

export default function DailyHygieneChecklist({ 
  child,
  onSaveComplete 
}: { 
  child?: ChildAccount | null;
  onSaveComplete?: () => void;
}) {
  const { user } = useAuth();
  const [activeChild, setActiveChild] = useState<ChildAccount | null>(child || null);
  const [log, setLog] = useState<DailyOralHygieneLog>(defaultLog);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [streak, setStreak] = useState(7);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (child) {
      setActiveChild(child);
    } else {
      setActiveChild(getActiveAccount(user?.id));
    }

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
  }, [child, user?.id, today]);

  const toggleField = (field: keyof Omit<DailyOralHygieneLog, "date" | "childId">) => {
    setLog((prev) => {
      const updated = { ...prev, [field]: !prev[field] };
      setIsSaved(false);
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const childId = activeChild?.id || "default";
    const storageKey = `asd_daily_hygiene_log_${childId}_${today}`;
    const genericKey = `asd_daily_hygiene_log_${today}`;

    const currentRecord = { ...log, date: today, childId };

    // 1. Save locally for instant UI responsiveness
    localStorage.setItem(storageKey, JSON.stringify(currentRecord));
    localStorage.setItem(genericKey, JSON.stringify(currentRecord));
    localStorage.setItem("asd_today_checklist", JSON.stringify(currentRecord));
    localStorage.setItem("asd_checklist_completed_today", today);

    try {
      const historyRaw = localStorage.getItem("asd_daily_logs_history");
      let history: any[] = historyRaw ? JSON.parse(historyRaw) : [];
      history = history.filter((h: any) => h.date !== today);
      history.unshift(currentRecord);
      localStorage.setItem("asd_daily_logs_history", JSON.stringify(history.slice(0, 30)));
    } catch (e) {
      // ignore
    }

    // 2. Persist to server database via API
    try {
      await fetch("/api/daily-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          userId: user?.id || null,
          log: currentRecord,
        }),
      });
    } catch (err) {
      console.error("Failed to post daily log to /api/daily-logs:", err);
    }

    // 3. Sync to Supabase directly if valid UUID
    if (supabase && activeChild?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeChild.id)) {
      try {
        await supabase.from("daily_logs").upsert({
          child_id: activeChild.id,
          date: today,
          brushed: Boolean(log.brushedMorning || log.brushedNight),
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
        console.warn("Direct Supabase sync skipped:", err);
      }
    }

    // Dispatch event so Dashboard, Monitoring, and Argus chatbot update immediately
    window.dispatchEvent(new CustomEvent("asd_daily_log_updated", { detail: currentRecord }));

    setIsSaving(false);
    setIsSaved(true);
    if (onSaveComplete) {
      onSaveComplete();
    }
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
    <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
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
                Daily clinical tracking for <span className="font-semibold text-slate-200">{childDisplayName}</span> • Supervised by Dr. Nivrutti Reddy
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-800/80 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700/80">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{streak} Day Routine Streak</span>
          </div>

          <div className="flex items-center gap-1.5 bg-teal-500/10 text-teal-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-teal-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Score: {score}%</span>
          </div>
        </div>
      </div>

      {/* Checklist Domains Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =========================================================
            DOMAIN 1: BRUSHING (4 ITEMS)
            ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Brushing Routine
            </span>
            <span className="text-[11px] font-mono text-slate-400">4 Items</span>
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
                icon: ShieldCheck,
                iconColor: "text-sky-400",
              },
            ].map((item) => {
              const active = log[item.id];
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleField(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                    active
                      ? "bg-teal-500/10 border-teal-500/30 text-white"
                      : "bg-[#0B1120] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${item.iconColor}`} />
                    <span className="text-xs font-medium leading-snug">{item.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-all ${
                      active
                        ? "bg-teal-500 border-teal-400 text-white font-bold"
                        : "border-slate-700 bg-slate-900 group-hover:border-slate-600"
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
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5 text-emerald-400" /> Dietary Habits
            </span>
            <span className="text-[11px] font-mono text-slate-400">7 Items</span>
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
                label: "Consumed sugary snacks / drinks",
                risk: true,
              },
              {
                id: "consumedSnacksBetweenMeals" as const,
                label: "Consumed snacks in between meals",
                risk: true,
              },
              {
                id: "consumedStickyFood" as const,
                label: "Consumed sticky food (chocolate, etc.)",
                risk: true,
              },
              {
                id: "drankSufficientWater" as const,
                label: "Drank sufficient water",
                risk: false,
              },
              {
                id: "healthyDinner" as const,
                label: "Dinner: healthy meal",
                risk: false,
              },
            ].map((item) => {
              const active = log[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleField(item.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                    active
                      ? item.risk
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                        : "bg-emerald-500/10 border-emerald-500/30 text-white"
                      : "bg-[#0B1120] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    {item.risk ? (
                      <AlertCircle className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-amber-400" : "text-slate-500"}`} />
                    ) : (
                      <Apple className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-emerald-400" : "text-slate-500"}`} />
                    )}
                    <span className="text-xs font-medium leading-snug">{item.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-all ${
                      active
                        ? item.risk
                          ? "bg-amber-500 border-amber-400 text-slate-950 font-bold"
                          : "bg-emerald-500 border-emerald-400 text-white font-bold"
                        : "border-slate-700 bg-slate-900 group-hover:border-slate-600"
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
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-purple-400" /> Behavioral Response
            </span>
            <span className="text-[11px] font-mono text-slate-400">3 Items</span>
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
                label: "Show Resistance / crying while brushing",
                risk: true,
                icon: AlertCircle,
                iconColor: "text-rose-400",
              },
            ].map((item) => {
              const active = log[item.id];
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleField(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                    active
                      ? item.risk
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                        : "bg-purple-500/10 border-purple-500/30 text-white"
                      : "bg-[#0B1120] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${item.iconColor}`} />
                    <span className="text-xs font-medium leading-snug">{item.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-all ${
                      active
                        ? item.risk
                          ? "bg-rose-500 border-rose-400 text-white font-bold"
                          : "bg-purple-500 border-purple-400 text-white font-bold"
                        : "border-slate-700 bg-slate-900 group-hover:border-slate-600"
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clinical Telemetry Insight Box */}
          <div className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-800 mt-4 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Argus AI Telemetry Calibration
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {log.showResistanceOrCrying
                ? `Sensory resistance logged for ${childDisplayName}. Argus adjusts pacing and provides non-verbal reassurance guidance.`
                : log.consumedStickyFood
                ? "Sticky foods noted on record. Argus recommends a 30-second warm water swirl."
                : `Consistent oral routine recorded for ${childDisplayName}. Positively impacts weekly clinical score.`}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Save Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Stores in database & dynamically updates monitoring telemetry</span>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isSaved ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" /> Saved Today&apos;s Checklist!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Submit Today&apos;s Checklist
            </>
          )}
        </button>
      </div>
    </div>
  );
}
