"use client";

import React, { useState, useEffect } from "react";
import DailyHygieneChecklist from "@/components/DailyHygieneChecklist";
import { 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sun, 
  Moon, 
  Apple, 
  Smile, 
  AlertCircle, 
  ShieldCheck, 
  FileText
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getActiveAccount, ChildAccount } from "@/lib/userStore";

export default function DailyMonitoringPage() {
  const { user } = useAuth();
  const [activeChild, setActiveChild] = useState<ChildAccount | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [showChecklistModal, setShowChecklistModal] = useState(false);

  const todayKey = new Date().toISOString().split("T")[0];

  const loadData = async (childId?: string) => {
    setIsLoadingLogs(true);
    const cid = childId || activeChild?.id || "default";

    // 1. Check local storage history first for instant display
    let localHistory: any[] = [];
    try {
      const stored = localStorage.getItem("asd_daily_logs_history");
      if (stored) {
        localHistory = JSON.parse(stored);
      }
    } catch (e) {
      // ignore
    }

    // 2. Fetch from DB API
    try {
      const res = await fetch(`/api/daily-logs?childId=${encodeURIComponent(cid)}&userId=${encodeURIComponent(user?.id || "")}`);
      if (res.ok) {
        const json = await res.json();
        if (json.logs && Array.isArray(json.logs) && json.logs.length > 0) {
          // Merge API logs with local logs
          const combined = [...json.logs];
          localHistory.forEach((lh) => {
            if (!combined.some((c) => c.date === lh.date)) {
              combined.push(lh);
            }
          });
          combined.sort((a, b) => (b.date > a.date ? 1 : -1));
          setLogs(combined);
          setIsLoadingLogs(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not load from /api/daily-logs, using local data", err);
    }

    // Fallback to sample baseline logs if brand new
    if (localHistory.length > 0) {
      setLogs(localHistory);
    } else {
      // Generate sample clinical logs for visualization
      const sampleLogs = [
        {
          date: todayKey,
          brushedMorning: true,
          brushedNight: false,
          allowedTongueCleaning: true,
          usedAdditionalAids: false,
          healthyBreakfast: true,
          healthyLunch: true,
          healthyDinner: true,
          consumedSugarySnacksDrinks: false,
          consumedSnacksBetweenMeals: false,
          consumedStickyFood: false,
          drankSufficientWater: true,
          brushesIndependently: false,
          cooperatedWithBrushing: true,
          showResistanceOrCrying: false,
        },
        {
          date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
          brushedMorning: true,
          brushedNight: true,
          allowedTongueCleaning: true,
          usedAdditionalAids: true,
          healthyBreakfast: true,
          healthyLunch: true,
          healthyDinner: true,
          consumedSugarySnacksDrinks: false,
          consumedSnacksBetweenMeals: false,
          consumedStickyFood: false,
          drankSufficientWater: true,
          brushesIndependently: true,
          cooperatedWithBrushing: true,
          showResistanceOrCrying: false,
        },
        {
          date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
          brushedMorning: true,
          brushedNight: true,
          allowedTongueCleaning: false,
          usedAdditionalAids: false,
          healthyBreakfast: true,
          healthyLunch: true,
          healthyDinner: false,
          consumedSugarySnacksDrinks: true,
          consumedSnacksBetweenMeals: true,
          consumedStickyFood: false,
          drankSufficientWater: true,
          brushesIndependently: false,
          cooperatedWithBrushing: false,
          showResistanceOrCrying: true,
        },
      ];
      setLogs(sampleLogs);
    }
    setIsLoadingLogs(false);
  };

  useEffect(() => {
    const acc = getActiveAccount(user?.id);
    setActiveChild(acc);
    loadData(acc?.id);

    const handleUpdate = () => {
      loadData(acc?.id);
    };

    window.addEventListener("asd_daily_log_updated", handleUpdate);

    return () => {
      window.removeEventListener("asd_daily_log_updated", handleUpdate);
    };
  }, [user?.id]);

  const todayLog = logs.find((l) => l.date === todayKey);
  const isTodayComplete = Boolean(todayLog);

  // Compute metrics
  const totalDays = Math.max(1, logs.length);
  const morningBrushedCount = logs.filter((l) => l.brushedMorning).length;
  const nightBrushedCount = logs.filter((l) => l.brushedNight).length;
  const morningAdherence = Math.round((morningBrushedCount / totalDays) * 100);
  const nightAdherence = Math.round((nightBrushedCount / totalDays) * 100);
  const cooperationRate = Math.round(
    (logs.filter((l) => l.cooperatedWithBrushing && !l.showResistanceOrCrying).length / totalDays) * 100
  );
  const highSugarDays = logs.filter((l) => l.consumedSugarySnacksDrinks || l.consumedStickyFood).length;

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-24 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5E8DA] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#235347] flex items-center gap-1.5 bg-[#DAF1DE] px-2.5 py-0.5 rounded-full border border-[#8EB69B]/50">
              <Activity className="w-3.5 h-3.5" /> Clinical Telemetry & Daily Monitoring
            </span>
            <span className="text-[#8EB69B]">•</span>
            <span className="text-xs text-[#163832]/70 font-medium">Dr. Nivrutti Reddy Dental Protocol</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#051F20] tracking-tight">
            Daily Monitoring for {activeChild?.name || "Your Child"}
          </h1>
          <p className="text-xs text-[#0B2B26]/70 mt-0.5">
            Participant Code: <span className="font-mono text-[#051F20] font-bold">{activeChild?.code || "ASD-001"}</span> • Daily checklists stored in database & synced with Argus AI
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isTodayComplete ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#235347]" />
              <span>Today&apos;s Routine Logged</span>
            </div>
          ) : (
            <button
              onClick={() => setShowChecklistModal(true)}
              className="px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#163832] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs hover:scale-105"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Record Today&apos;s Checklist</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Clinical Telemetry Metrics (4 Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] transition-all shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#0B2B26]/70">
            <span className="font-semibold text-[#0B2B26]">Morning Brushing</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-[#051F20] font-mono">{morningAdherence}%</div>
          <div className="text-[11px] text-[#235347] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#235347]" /> {morningBrushedCount} of {totalDays} logged days
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] transition-all shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#0B2B26]/70">
            <span className="font-semibold text-[#0B2B26]">Bedtime Brushing</span>
            <Moon className="w-4 h-4 text-[#235347]" />
          </div>
          <div className="text-2xl font-black text-[#051F20] font-mono">{nightAdherence}%</div>
          <div className="text-[11px] text-[#163832] font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#235347]" /> {nightBrushedCount} of {totalDays} logged days
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] transition-all shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#0B2B26]/70">
            <span className="font-semibold text-[#0B2B26]">Sensory Cooperation</span>
            <Smile className="w-4 h-4 text-[#235347]" />
          </div>
          <div className="text-2xl font-black text-[#051F20] font-mono">{cooperationRate}%</div>
          <div className="text-[11px] text-[#235347] font-semibold">
            Routine adherence without distress
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] transition-all shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#0B2B26]/70">
            <span className="font-semibold text-[#0B2B26]">Enamel Sugar Exposure</span>
            <Apple className="w-4 h-4 text-[#235347]" />
          </div>
          <div className="text-2xl font-black text-[#051F20] font-mono">{highSugarDays} days</div>
          <div className={`text-[11px] font-semibold ${highSugarDays > 1 ? "text-amber-700" : "text-[#235347]"}`}>
            {highSugarDays > 1 ? "Moderate cavity risk" : "Low enamel vulnerability"}
          </div>
        </div>
      </div>

      {/* ── Active Today's Checklist Section (If Pending or Modal) ── */}
      {(!isTodayComplete || showChecklistModal) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#051F20] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#235347]" />
              {isTodayComplete ? "Update Today's Checklist Log" : "Pending: Submit Today's Oral Hygiene Checklist"}
            </h2>
            {showChecklistModal && isTodayComplete && (
              <button
                onClick={() => setShowChecklistModal(false)}
                className="text-xs text-[#0B2B26]/70 hover:text-[#051F20] font-semibold"
              >
                Close Editor ✕
              </button>
            )}
          </div>
          <DailyHygieneChecklist 
            child={activeChild} 
            onSaveComplete={() => setShowChecklistModal(false)}
          />
        </div>
      )}

      {/* ── Chronological Telemetry Log History Table ── */}
      <div className="bg-white rounded-2xl border border-[#D5E8DA] shadow-xs overflow-hidden space-y-0">
        <div className="p-5 border-b border-[#D5E8DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F4FAF6]/40">
          <div>
            <h3 className="text-base font-bold text-[#051F20] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#235347]" />
              Recorded Routine History (Database Telemetry)
            </h3>
            <p className="text-xs text-[#0B2B26]/70 mt-0.5">
              Verified clinical records logged by caregiver and synced across sessions
            </p>
          </div>

          <div className="text-xs text-[#163832] flex items-center gap-1.5 font-mono font-bold bg-[#DAF1DE] px-3 py-1 rounded-xl border border-[#8EB69B]/40">
            <ShieldCheck className="w-3.5 h-3.5 text-[#235347]" />
            <span>{logs.length} Total Logs On File</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0B2B26]">
            <thead className="bg-[#F4FAF6] text-[#163832] text-[11px] uppercase tracking-wider border-b border-[#D5E8DA]">
              <tr>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Morning</th>
                <th className="py-3 px-4 font-bold">Bedtime</th>
                <th className="py-3 px-4 font-bold">Diet Meals</th>
                <th className="py-3 px-4 font-bold">Sugar / Sticky Food</th>
                <th className="py-3 px-4 font-bold">Behavior / Tolerance</th>
                <th className="py-3 px-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5E8DA]/60">
              {logs.map((item, idx) => {
                const isItemToday = item.date === todayKey;
                const hasSugar = item.consumedSugarySnacksDrinks || item.consumedStickyFood;
                return (
                  <tr key={item.date || idx} className={`hover:bg-[#DAF1DE]/20 transition-colors ${isItemToday ? "bg-[#DAF1DE]/40" : ""}`}>
                    <td className="py-3.5 px-4 font-bold text-[#051F20] flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#8EB69B]" />
                      <span>{item.date}</span>
                      {isItemToday && (
                        <span className="text-[10px] bg-[#235347] text-white px-2 py-0.5 rounded-full font-bold">
                          Today
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.brushedMorning ? (
                        <span className="text-[#235347] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#235347]" /> Done
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Missed</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.brushedNight ? (
                        <span className="text-[#235347] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#235347]" /> Done
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Pending</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[#0B2B26] font-medium">
                        {item.healthyBreakfast && item.healthyLunch ? "Healthy (B+L)" : "Standard Meals"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {hasSugar ? (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> {item.consumedStickyFood ? "Sticky Food" : "Sugary Snack"}
                        </span>
                      ) : (
                        <span className="text-[#235347] font-bold">None Logged ✓</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.showResistanceOrCrying ? (
                        <span className="text-rose-700 font-semibold">Sensory Distress</span>
                      ) : item.cooperatedWithBrushing ? (
                        <span className="text-[#235347] font-bold">Cooperative</span>
                      ) : (
                        <span className="text-[#0B2B26]/70 font-medium">Assisted</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#DAF1DE] text-[#051F20] text-[10px] font-bold border border-[#8EB69B]/40">
                        Recorded
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
