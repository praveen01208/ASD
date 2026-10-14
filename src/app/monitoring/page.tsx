"use client";

import React from "react";
import DailyHygieneChecklist from "@/components/DailyHygieneChecklist";
import { FileEdit, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getActiveAccount } from "@/lib/userStore";

export default function DailyMonitoringPage() {
  const { user } = useAuth();
  const activeChild = getActiveAccount(user?.id);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
            <FileEdit className="w-3.5 h-3.5 text-teal-400" />
            Daily Oral Hygiene Telemetry
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Daily Monitoring</h1>
          <p className="text-slate-300 mt-1.5 text-xs sm:text-sm max-w-2xl">
            Track daily brushing routines, meal/snack behaviors, and sensory resistance for{" "}
            <span className="font-bold text-teal-300">{activeChild?.name || "your child"}</span>. Logged data feeds real-time calibration into the Argus AI companion.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 w-fit">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Synced with Supabase</span>
        </div>
      </div>

      {/* Main Checklist Component */}
      <DailyHygieneChecklist child={activeChild} />
    </div>
  );
}
