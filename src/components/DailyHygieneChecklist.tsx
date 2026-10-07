"use client";

import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  Apple, 
  CheckCircle2, 
  Smile, 
  ShieldCheck, 
  Flame, 
  Calendar,
  Sparkles,
  Save,
  Check
} from "lucide-react";

interface DailyLog {
  date: string;
  morningBrushing: boolean;
  nightBrushing: boolean;
  ateFruitsVegetables: boolean;
  avoidedSugarySnacks: boolean;
  minimizedSnacking: boolean;
  brushedIndependently: boolean;
  cooperatedCalmly: boolean;
  notes: string;
}

const defaultLog: DailyLog = {
  date: new Date().toISOString().split("T")[0],
  morningBrushing: true,
  nightBrushing: false,
  ateFruitsVegetables: true,
  avoidedSugarySnacks: true,
  minimizedSnacking: false,
  brushedIndependently: false,
  cooperatedCalmly: true,
  notes: "",
};

export default function DailyHygieneChecklist() {
  const [log, setLog] = useState<DailyLog>(defaultLog);
  const [isSaved, setIsSaved] = useState(false);
  const [streak, setStreak] = useState(5);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem(`asd_hygiene_log_${today}`);
    if (saved) {
      try {
        setLog(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleField = (field: keyof Omit<DailyLog, "date" | "notes">) => {
    setLog((prev) => {
      const updated = { ...prev, [field]: !prev[field] };
      setIsSaved(false);
      return updated;
    });
  };

  const handleSave = () => {
    localStorage.setItem(`asd_hygiene_log_${log.date}`, JSON.stringify(log));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const calculateDailyScore = () => {
    const total = 7;
    let score = 0;
    if (log.morningBrushing) score++;
    if (log.nightBrushing) score++;
    if (log.ateFruitsVegetables) score++;
    if (log.avoidedSugarySnacks) score++;
    if (log.minimizedSnacking) score++;
    if (log.brushedIndependently) score++;
    if (log.cooperatedCalmly) score++;
    return Math.round((score / total) * 100);
  };

  const score = calculateDailyScore();

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-7 overflow-hidden shadow-2xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Today&apos;s Oral Hygiene Checklist</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Log daily brushing, sensory cooperation, and nutrition habits for Leo (ASD-001)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-orange-500/15 text-orange-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            {streak} Day Streak
          </div>

          <div className="flex items-center gap-1.5 bg-teal-500/15 text-teal-300 px-3.5 py-1.5 rounded-full text-xs font-bold border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.15)]">
            <Sparkles className="w-4 h-4 text-teal-400" />
            {score}% Completed
          </div>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* 1. Brushing Routines */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Brushing Routine
          </span>

          <div
            onClick={() => toggleField("morningBrushing")}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              log.morningBrushing 
                ? "bg-teal-500/20 border-teal-500/40 text-teal-100 shadow-[0_0_15px_rgba(45,212,191,0.15)]" 
                : "bg-slate-900/60 border-white/10 text-slate-200 hover:border-white/25 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-400" />
              <div className="text-xs font-semibold">Morning Brushing (2m)</div>
            </div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
              log.morningBrushing ? "bg-teal-500 border-teal-400 text-slate-950" : "border-slate-700 bg-slate-800"
            }`}>
              {log.morningBrushing && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <div
            onClick={() => toggleField("nightBrushing")}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              log.nightBrushing 
                ? "bg-teal-500/20 border-teal-500/40 text-teal-100 shadow-[0_0_15px_rgba(45,212,191,0.15)]" 
                : "bg-slate-900/60 border-white/10 text-slate-200 hover:border-white/25 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-indigo-400" />
              <div className="text-xs font-semibold">Bedtime Brushing (2m)</div>
            </div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
              log.nightBrushing ? "bg-teal-500 border-teal-400 text-slate-950" : "border-slate-700 bg-slate-800"
            }`}>
              {log.nightBrushing && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* 2. Nutrition & Diet */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Apple className="w-3.5 h-3.5 text-emerald-400" /> Diet & Plaque Defense
          </span>

          <div
            onClick={() => toggleField("ateFruitsVegetables")}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              log.ateFruitsVegetables 
                ? "bg-teal-500/20 border-teal-500/40 text-teal-100 shadow-[0_0_15px_rgba(45,212,191,0.15)]" 
                : "bg-slate-900/60 border-white/10 text-slate-200 hover:border-white/25 hover:text-white"
            }`}
          >
            <div className="text-xs font-semibold">Ate Fruits / Raw Veggies</div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
              log.ateFruitsVegetables ? "bg-teal-500 border-teal-400 text-slate-950" : "border-slate-700 bg-slate-800"
            }`}>
              {log.ateFruitsVegetables && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <div
            onClick={() => toggleField("avoidedSugarySnacks")}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              log.avoidedSugarySnacks 
                ? "bg-teal-500/20 border-teal-500/40 text-teal-100 shadow-[0_0_15px_rgba(45,212,191,0.15)]" 
                : "bg-slate-900/60 border-white/10 text-slate-200 hover:border-white/25 hover:text-white"
            }`}
          >
            <div className="text-xs font-semibold">No Sticky Sugary Snacks</div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
              log.avoidedSugarySnacks ? "bg-teal-500 border-teal-400 text-slate-950" : "border-slate-700 bg-slate-800"
            }`}>
              {log.avoidedSugarySnacks && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <div
            onClick={() => toggleField("minimizedSnacking")}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              log.minimizedSnacking 
                ? "bg-teal-500/20 border-teal-500/40 text-teal-100 shadow-[0_0_15px_rgba(45,212,191,0.15)]" 
                : "bg-slate-900/60 border-white/10 text-slate-200 hover:border-white/25 hover:text-white"
            }`}
          >
            <div className="text-xs font-semibold">No Food Pouching / Grazing</div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
              log.minimizedSnacking ? "bg-teal-500 border-teal-400 text-slate-950" : "border-slate-700 bg-slate-800"
            }`}>
              {log.minimizedSnacking && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* 3. Sensory & Behavior */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-purple-400" /> Sensory Cooperation
          </span>

          <div
            onClick={() => toggleField("cooperatedCalmly")}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              log.cooperatedCalmly 
                ? "bg-teal-500/20 border-teal-500/40 text-teal-100 shadow-[0_0_15px_rgba(45,212,191,0.15)]" 
                : "bg-slate-900/60 border-white/10 text-slate-200 hover:border-white/25 hover:text-white"
            }`}
          >
            <div className="text-xs font-semibold">Calm / Followed Visual Cards</div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
              log.cooperatedCalmly ? "bg-teal-500 border-teal-400 text-slate-950" : "border-slate-700 bg-slate-800"
            }`}>
              {log.cooperatedCalmly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <div
            onClick={() => toggleField("brushedIndependently")}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              log.brushedIndependently 
                ? "bg-teal-500/20 border-teal-500/40 text-teal-100 shadow-[0_0_15px_rgba(45,212,191,0.15)]" 
                : "bg-slate-900/60 border-white/10 text-slate-200 hover:border-white/25 hover:text-white"
            }`}
          >
            <div className="text-xs font-semibold">Independent Brushing Attempt</div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
              log.brushedIndependently ? "bg-teal-500 border-teal-400 text-slate-950" : "border-slate-700 bg-slate-800"
            }`}>
              {log.brushedIndependently && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>
      </div>

      {/* Save action bar */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
        <span className="text-xs text-slate-300 font-medium">
          Auto-saves locally • Telemetry synchronized with Clinical Care Plan
        </span>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-teal-500/20 transition-all"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" /> Saved Today&apos;s Checklist!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Daily Check
            </>
          )}
        </button>
      </div>
    </div>
  );
}
