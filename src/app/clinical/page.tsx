"use client";

import { useState } from "react";
import { CheckCircle2, Stethoscope, Save } from "lucide-react";

export default function ClinicalOutcomesPage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-[#051F20] bg-[#DAF1DE] border border-[#8EB69B] mb-2 shadow-2xs">
          <Stethoscope className="w-3.5 h-3.5 text-[#235347]" />
          Clinical Ground Truth Verification
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#051F20] tracking-tight">Clinical Outcomes</h1>
        <p className="text-[#0B2B26]/70 mt-1.5 text-sm sm:text-base">
          Professional pediatric dental examination benchmarks validating multimodal AI telemetry.
        </p>
      </div>

      {/* Measures Section */}
      <div className="bg-white rounded-2xl border border-[#D5E8DA] shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D5E8DA]/60">
          <h2 className="text-lg sm:text-xl font-bold text-[#051F20]">Baseline vs. Current Clinical Measurements</h2>
          <span className="text-xs font-mono font-bold text-[#051F20] bg-[#DAF1DE] px-3 py-1 rounded-full border border-[#8EB69B]">
            Week 8 Active
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <MeasureCard title="Plaque Index (PI)" baseline="1.8" current="1.2" delta="-33% reduction" />
          <MeasureCard title="Gingival Index (GI)" baseline="1.4" current="1.0" delta="-29% reduction" />
          <MeasureCard title="dmft / DMFT" baseline="5" current="4" delta="Decay arrested" />
        </div>
      </div>

      {/* Professional Assessment Card */}
      <div className="bg-white rounded-2xl border border-[#D5E8DA] shadow-xs p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-[#051F20] mb-6 pb-4 border-b border-[#D5E8DA]/60">
          Professional Assessment
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA]">
            <span className="text-xs font-semibold text-[#0B2B26]/70 block mb-1">Overall Oral Hygiene Status</span>
            <span className="text-base font-bold text-[#235347]">Significantly Improved</span>
          </div>
          <div className="p-4 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA]">
            <span className="text-xs font-semibold text-[#0B2B26]/70 block mb-1">Preventive Intervention Need</span>
            <span className="text-base font-bold text-[#235347]">Ongoing Desensitization</span>
          </div>
          <div className="p-4 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA]">
            <span className="text-xs font-semibold text-[#0B2B26]/70 block mb-1">Dental Treatment Status</span>
            <span className="text-base font-bold text-[#235347]">Fluoride Varnish Applied</span>
          </div>
        </div>
        
        <p className="text-xs text-[#0B2B26]/60 italic mb-8">
          Note: Clinical measurements remain the clinical gold standard. AI predictions are adjunctive and do not substitute direct dentist examination.
        </p>
        
        {/* Clinician Entry Form */}
        <div className="pt-6 border-t border-[#D5E8DA]/60">
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="font-bold text-[#051F20] text-base">Record New Clinical Visit Benchmarks</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#051F20] mb-1.5">Plaque Index</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="w-full bg-[#F4FAF6] border border-[#D5E8DA] rounded-xl py-2.5 px-3.5 text-[#051F20] font-mono placeholder-[#0B2B26]/40 focus:bg-white focus:outline-none focus:border-[#8EB69B] transition-all text-sm" 
                  placeholder="e.g. 1.1" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#051F20] mb-1.5">Gingival Index</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="w-full bg-[#F4FAF6] border border-[#D5E8DA] rounded-xl py-2.5 px-3.5 text-[#051F20] font-mono placeholder-[#0B2B26]/40 focus:bg-white focus:outline-none focus:border-[#8EB69B] transition-all text-sm" 
                  placeholder="e.g. 0.9" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#051F20] mb-1.5">dmft / DMFT</label>
                <input 
                  type="number" 
                  className="w-full bg-[#F4FAF6] border border-[#D5E8DA] rounded-xl py-2.5 px-3.5 text-[#051F20] font-mono placeholder-[#0B2B26]/40 focus:bg-white focus:outline-none focus:border-[#8EB69B] transition-all text-sm" 
                  placeholder="e.g. 4" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#051F20] mb-1.5">Examiner Clinical Observations</label>
              <textarea 
                className="w-full bg-[#F4FAF6] border border-[#D5E8DA] rounded-xl py-2.5 px-3.5 h-24 text-[#051F20] placeholder-[#0B2B26]/40 focus:bg-white focus:outline-none focus:border-[#8EB69B] transition-all text-sm" 
                placeholder="Log child tolerance to mirror/probe examination, cooperative behavior, and parent feedback..."
              />
            </div>
            
            <div className="flex justify-end pt-2 items-center gap-4">
              {isSaved && (
                <div className="flex items-center gap-1.5 text-[#235347] text-xs font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#235347]" /> Visit entry stored successfully
                </div>
              )}
              <button 
                type="submit" 
                className="px-6 py-2.5 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all hover:scale-105"
              >
                <Save className="w-4 h-4" /> Save Clinical Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function MeasureCard({ title, baseline, current, delta }: { title: string; baseline: string; current: string; delta: string }) {
  return (
    <div className="p-5 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] hover:border-[#8EB69B] flex flex-col justify-between transition-all">
      <div>
        <h3 className="font-bold text-[#051F20] text-sm mb-3">{title}</h3>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl font-extrabold text-[#8EB69B] font-mono">{baseline}</span>
          <span className="text-[#235347] font-bold text-lg">→</span>
          <span className="text-3xl font-black text-[#235347] font-mono">{current}</span>
        </div>
      </div>
      <div className="pt-2 border-t border-[#D5E8DA]/60 flex items-center justify-between text-xs font-mono">
        <span className="text-[#0B2B26]/60">Baseline → Now</span>
        <span className="text-[#235347] font-bold">{delta}</span>
      </div>
    </div>
  );
}
