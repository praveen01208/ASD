"use client";

import { downloadCSV, downloadPDF } from "@/lib/exportUtils";
import { FileText, Download, ShieldCheck, Activity, FileSpreadsheet, FileCheck } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-[#051F20] bg-[#DAF1DE] border border-[#8EB69B] mb-2 shadow-2xs">
          <FileText className="w-3.5 h-3.5 text-[#235347]" />
          Clinical Study Governance
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#051F20] tracking-tight">Clinical & Research Reports</h1>
        <p className="text-[#0B2B26]/70 mt-1.5 text-sm sm:text-base">
          De-identified study analytics, longitudinal data exports, and audit-ready trial summaries.
        </p>
      </div>

      {/* Participant Summary */}
      <div className="bg-white rounded-2xl border border-[#D5E8DA] shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D5E8DA]/60">
          <h2 className="text-lg sm:text-xl font-bold text-[#051F20] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#235347]" />
            Participant Cohort Summary
          </h2>
          <span className="bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Active Study
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA]">
            <span className="text-xs text-[#0B2B26]/70 block font-mono mb-1 font-semibold">Subject Identifier</span>
            <span className="text-xl font-black text-[#051F20] font-mono">ASD-001</span>
          </div>
          <div className="p-4 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA]">
            <span className="text-xs text-[#0B2B26]/70 block font-mono mb-1 font-semibold">Observation Timeline</span>
            <span className="text-xl font-black text-[#235347] font-mono">Week 8 of 12</span>
          </div>
          <div className="p-4 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA]">
            <span className="text-xs text-[#0B2B26]/70 block font-mono mb-1 font-semibold">Data Completeness Rate</span>
            <span className="text-xl font-black text-[#235347] font-mono">94.2%</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#D5E8DA]/60">
          <span className="text-xs text-[#0B2B26]/70">
            Full IRB protocol compliance verification completed.
          </span>
          <button 
            onClick={downloadCSV}
            className="px-5 py-2.5 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" /> Export Participant CSV
          </button>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-2xl border border-[#D5E8DA] shadow-xs p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-[#051F20] mb-6 pb-4 border-b border-[#D5E8DA]/60 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#235347]" />
          AI & Caregiver Interaction Volumes
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ActivityCard value="18" label="Visual Videos Viewed" />
          <ActivityCard value="24" label="Brushing Routines Run" />
          <ActivityCard value="16" label="Diet Interventions Logged" />
          <ActivityCard value="12" label="Argus AI Interactions" />
        </div>
      </div>

      {/* Available Exports */}
      <div className="bg-white rounded-2xl border border-[#D5E8DA] shadow-xs p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-[#051F20] mb-6 pb-4 border-b border-[#D5E8DA]/60">
          Research Data Exports
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button 
            onClick={downloadCSV} 
            className="p-4 rounded-xl bg-[#F4FAF6] hover:bg-[#DAF1DE]/40 border border-[#D5E8DA] hover:border-[#8EB69B] text-left transition-all group"
          >
            <FileSpreadsheet className="w-6 h-6 text-[#235347] mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-[#051F20] text-sm">Participant CSV</div>
            <div className="text-xs text-[#0B2B26]/70 mt-1">Raw telemetry logs</div>
          </button>

          <button 
            onClick={downloadPDF} 
            className="p-4 rounded-xl bg-[#F4FAF6] hover:bg-[#DAF1DE]/40 border border-[#D5E8DA] hover:border-[#8EB69B] text-left transition-all group"
          >
            <FileCheck className="w-6 h-6 text-[#235347] mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-[#051F20] text-sm">Clinical Report PDF</div>
            <div className="text-xs text-[#0B2B26]/70 mt-1">Printable trial dossier</div>
          </button>

          <button 
            onClick={downloadCSV}
            className="p-4 rounded-xl bg-[#F4FAF6] hover:bg-[#DAF1DE]/40 border border-[#D5E8DA] hover:border-[#8EB69B] text-left transition-all group"
          >
            <FileSpreadsheet className="w-6 h-6 text-[#235347] mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-[#051F20] text-sm">Intervention Logs</div>
            <div className="text-xs text-[#0B2B26]/70 mt-1">Action adherence log</div>
          </button>

          <button 
            onClick={downloadCSV}
            className="p-4 rounded-xl bg-[#F4FAF6] hover:bg-[#DAF1DE]/40 border border-[#D5E8DA] hover:border-[#8EB69B] text-left transition-all group"
          >
            <Download className="w-6 h-6 text-[#235347] mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-[#051F20] text-sm">Full Aggregate Dataset</div>
            <div className="text-xs text-[#0B2B26]/70 mt-1">Multi-modal synthesis</div>
          </button>
        </div>
        
        <p className="text-xs text-[#0B2B26]/60 italic">
          Data exports conform strictly to HIPAA and GCP guidelines with automatic participant de-identification.
        </p>
      </div>
    </div>
  );
}

function ActivityCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-5 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] hover:border-[#8EB69B] flex flex-col justify-between transition-all">
      <div className="text-3xl sm:text-4xl font-black text-[#235347] font-mono mb-2">{value}</div>
      <p className="text-xs sm:text-sm font-bold text-[#051F20]">{label}</p>
    </div>
  );
}
