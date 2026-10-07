"use client";

import { useState } from "react";
import { CheckCircle2, Info, FileEdit, Sparkles, Check } from "lucide-react";

export default function DailyMonitoring() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
            <FileEdit className="w-3.5 h-3.5 text-teal-400" />
            Daily Caregiver Log
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Daily Monitoring</h1>
          <p className="text-slate-300 mt-1.5 text-sm sm:text-base">
            Caregiver observation log paired with automated computer-vision brush tracking.
          </p>
        </div>

        <button 
          type="submit" 
          className="self-start sm:self-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-slate-950" /> Saved!
            </>
          ) : (
            "Save Today's Log"
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Morning Brushing */}
        <div className="liquid-glass-card rounded-2xl p-6 sm:p-7 border border-white/15">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white">Morning Routine</h2>
            <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
              AM Session
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm font-semibold text-slate-200">Brushing Status</span>
              <select className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl focus:outline-none">
                <option value="Completed" className="bg-slate-900 text-white">Completed</option>
                <option value="Missed" className="bg-slate-900 text-white">Missed</option>
                <option value="Refused" className="bg-slate-900 text-white">Refused</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm font-semibold text-slate-200">Routine Duration</span>
              <select defaultValue="90 seconds" className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl focus:outline-none">
                <option value="30 seconds" className="bg-slate-900 text-white">30 seconds</option>
                <option value="60 seconds" className="bg-slate-900 text-white">60 seconds</option>
                <option value="90 seconds" className="bg-slate-900 text-white">90 seconds</option>
                <option value="120 seconds" className="bg-slate-900 text-white">120 seconds</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm font-semibold text-slate-200">Fluoridated Toothpaste</span>
              <select className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl focus:outline-none">
                <option value="Yes" className="bg-slate-900 text-white">Yes</option>
                <option value="No" className="bg-slate-900 text-white">No</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm font-semibold text-slate-200">Caregiver Assistance</span>
              <select defaultValue="Moderate" className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl focus:outline-none">
                <option value="Full" className="bg-slate-900 text-white">Full Assistance</option>
                <option value="Moderate" className="bg-slate-900 text-white">Moderate Prompting</option>
                <option value="Minimal" className="bg-slate-900 text-white">Minimal Guidance</option>
                <option value="Independent" className="bg-slate-900 text-white">Fully Independent</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-semibold text-slate-200">Sensory Tolerance</span>
              <select defaultValue="Good" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl focus:outline-none">
                <option value="Good" className="bg-slate-900 text-white">Good (Calm)</option>
                <option value="Fair" className="bg-slate-900 text-white">Fair (Mild resistance)</option>
                <option value="Poor" className="bg-slate-900 text-white">Poor (Distressed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Diet Today */}
        <div className="liquid-glass-card rounded-2xl p-6 sm:p-7 border border-white/15">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white">Diet & Sugar Exposure</h2>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              Caries Risk Factors
            </span>
          </div>
          
          <div className="space-y-4">
            <DietRow label="Main Meals Logged" defaultValue="3" />
            <DietRow label="Snack Frequency" defaultValue="2" />
            <DietRow label="Sticky / Sugary Snacks" defaultValue="1" highlight={true} />
            <DietRow label="Sugary Drinks / Juices" defaultValue="0" />
            
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm font-semibold text-slate-200">Hydration (Water)</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                Optimal (5+ glasses)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Behavior & Sensory Section */}
      <div className="liquid-glass-card rounded-2xl p-6 sm:p-7 border border-white/15">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-bold text-white">Behavioral & Sensory Indicators</h2>
          <span className="text-xs font-mono text-slate-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
            Longitudinal Tracking
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <BehaviorField label="Brushing Resistance" value="Mild" tagColor="text-teal-300 bg-teal-500/10 border-teal-500/20" />
          <BehaviorField label="Prompting Level" value="Moderate" tagColor="text-amber-300 bg-amber-500/10 border-amber-500/20" />
          <BehaviorField label="Sensory Disturbance" value="Mild" tagColor="text-teal-300 bg-teal-500/10 border-teal-500/20" />
          <BehaviorField label="Food Refusal Episodes" value="1 Episode" tagColor="text-orange-300 bg-orange-500/10 border-orange-500/20" />
        </div>
        
        {/* CV Mock Box */}
        <div className="mt-6 rounded-xl liquid-glass border border-cyan-500/30 p-5 bg-gradient-to-r from-cyan-950/30 to-teal-950/30">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Computer Vision (CV) Automated Brush Telemetry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-2">
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                  <span className="text-[11px] text-slate-400 block font-mono">Posterior Coverage</span>
                  <span className="text-sm font-mono font-bold text-teal-300">72%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                  <span className="text-[11px] text-slate-400 block font-mono">Repeated Brushing</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">Low (Consistent)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                  <span className="text-[11px] text-slate-400 block font-mono">Routine Completion</span>
                  <span className="text-sm font-mono font-bold text-cyan-300">80%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-2 italic">
                Values captured via camera routine tracking model for clinical research validation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function DietRow({ label, defaultValue, highlight = false }: { label: string; defaultValue: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <span className={`text-sm font-mono font-bold px-3 py-1 rounded-lg border ${
        highlight 
          ? "text-orange-300 bg-orange-500/10 border-orange-500/30" 
          : "text-white bg-slate-800/80 border-white/10"
      }`}>
        {defaultValue}
      </span>
    </div>
  );
}

function BehaviorField({ label, value, tagColor }: { label: string; value: string; tagColor: string }) {
  return (
    <div className="p-4 rounded-xl liquid-glass border border-white/10 flex flex-col justify-between">
      <h3 className="text-xs font-semibold text-slate-300 mb-2">{label}</h3>
      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border inline-block w-fit ${tagColor}`}>
        {value}
      </span>
    </div>
  );
}
