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
    <div className="bg-white rounded-2xl border border-[#D5E8DA] p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5E8DA] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#DAF1DE] text-[#051F20] rounded-xl border border-[#8EB69B]">
              <CheckCircle2 className="w-5 h-5 text-[#235347]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#051F20] tracking-tight">
                Child&apos;s Daily Oral Hygiene Checklist
              </h3>
              <p className="text-xs text-[#163832] font-medium mt-0.5">
                Daily clinical tracking for <span className="font-extrabold text-[#051F20]">{childDisplayName}</span> • Supervised by Dr. Nivrutti Reddy
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-300 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{streak} Day Routine Streak</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#DAF1DE] text-[#051F20] px-3 py-1.5 rounded-lg text-xs font-black border border-[#8EB69B] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#235347]" />
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
          <div className="flex items-center justify-between pb-2 border-b border-[#D5E8DA]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#235347] flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" /> Brushing Routine
            </span>
            <span className="text-[11px] font-mono font-bold text-[#163832]">4 Items</span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: "brushedMorning" as const,
                label: "Brushed teeth in the morning",
                icon: Sun,
                iconColor: "text-amber-500",
              },
              {
                id: "brushedNight" as const,
                label: "Brushed teeth before going to bed at night",
                icon: Moon,
                iconColor: "text-indigo-500",
              },
              {
                id: "allowedTongueCleaning" as const,
                label: "Allowed mouth/tongue cleaning",
                icon: Sparkle,
                iconColor: "text-[#235347]",
              },
              {
                id: "usedAdditionalAids" as const,
                label: "Used additional aids (Floss, interdental brush)",
                icon: ShieldCheck,
                iconColor: "text-sky-600",
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
                      ? "bg-[#DAF1DE] border-[#8EB69B] text-[#051F20] font-medium shadow-2xs"
                      : "bg-[#DAF1DE]/15 border-[#D5E8DA] text-[#0B2B26] hover:border-[#8EB69B] hover:bg-[#DAF1DE]/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${item.iconColor}`} />
                    <span className="text-xs font-medium leading-snug">{item.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-all ${
                      active
                        ? "bg-[#235347] border-[#235347] text-white font-bold"
                        : "border-[#8EB69B]/60 bg-white group-hover:border-[#235347]"
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
          <div className="flex items-center justify-between pb-2 border-b border-[#D5E8DA]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#235347] flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5 text-[#235347]" /> Dietary Habits
            </span>
            <span className="text-[11px] font-mono font-bold text-[#163832]">7 Items</span>
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
                        ? "bg-amber-50 border-amber-300 text-amber-950 font-bold"
                        : "bg-[#DAF1DE] border-[#8EB69B] text-[#051F20] font-bold"
                      : "bg-[#F4FAF6] border-[#D5E8DA] text-[#0B2B26] hover:border-[#8EB69B] hover:bg-[#DAF1DE]/30 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    {item.risk ? (
                      <AlertCircle className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-amber-600" : "text-amber-700"}`} />
                    ) : (
                      <Apple className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-[#235347]" : "text-[#235347]"}`} />
                    )}
                    <span className="text-xs font-semibold leading-snug">{item.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-all ${
                      active
                        ? item.risk
                          ? "bg-amber-600 border-amber-600 text-white font-bold"
                          : "bg-[#235347] border-[#235347] text-white font-bold"
                        : "border-[#8EB69B] bg-white group-hover:border-[#235347]"
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
          <div className="flex items-center justify-between pb-2 border-b border-[#D5E8DA]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#235347] flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-[#235347]" /> Behavioral Response
            </span>
            <span className="text-[11px] font-mono font-bold text-[#163832]">3 Items</span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: "brushesIndependently" as const,
                label: "Brushes independently",
                risk: false,
                icon: Smile,
                iconColor: "text-[#235347]",
              },
              {
                id: "cooperatedWithBrushing" as const,
                label: "Cooperated with brushing",
                risk: false,
                icon: Heart,
                iconColor: "text-[#235347]",
              },
              {
                id: "showResistanceOrCrying" as const,
                label: "Show Resistance / crying while brushing",
                risk: true,
                icon: AlertCircle,
                iconColor: "text-rose-600",
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
                        ? "bg-rose-50 border-rose-300 text-rose-950 font-bold"
                        : "bg-[#DAF1DE] border-[#8EB69B] text-[#051F20] font-bold"
                      : "bg-[#F4FAF6] border-[#D5E8DA] text-[#0B2B26] hover:border-[#8EB69B] hover:bg-[#DAF1DE]/30 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${item.iconColor}`} />
                    <span className="text-xs font-semibold leading-snug">{item.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-all ${
                      active
                        ? item.risk
                          ? "bg-rose-600 border-rose-600 text-white font-bold"
                          : "bg-[#235347] border-[#235347] text-white font-bold"
                        : "border-[#8EB69B] bg-white group-hover:border-[#235347]"
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clinical Telemetry Insight Box */}
          <div className="p-3.5 rounded-xl bg-[#DAF1DE]/70 border border-[#8EB69B]/80 mt-4 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#051F20]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#235347]" />
              Argus AI Telemetry Calibration
            </div>
            <p className="text-[11px] text-[#0B2B26] leading-relaxed">
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#D5E8DA] pt-4">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#235347]" />
          <span>Stores in database & dynamically updates monitoring telemetry</span>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#235347] hover:bg-[#163832] text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
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
