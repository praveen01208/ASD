"use client";

import { downloadCSV, downloadPDF } from "@/lib/exportUtils";
import { FileText, Download, ShieldCheck, Activity, FileSpreadsheet, FileCheck } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 mb-2">
          <FileText className="w-3.5 h-3.5 text-teal-600" />
          Clinical Study Governance
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Clinical & Research Reports</h1>
        <p className="text-slate-600 mt-1.5 text-sm sm:text-base">
          De-identified study analytics, longitudinal data exports, and audit-ready trial summaries.
        </p>
      </div>

      {/* Participant Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            Participant Cohort Summary
          </h2>
          <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Active Study
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block font-mono mb-1">Subject Identifier</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">ASD-001</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block font-mono mb-1">Observation Timeline</span>
            <span className="text-xl font-extrabold text-teal-700 font-mono">Week 8 of 12</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block font-mono mb-1">Data Completeness Rate</span>
            <span className="text-xl font-extrabold text-emerald-700 font-mono">94.2%</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <span className="text-xs text-slate-600">
            Full IRB protocol compliance verification completed.
          </span>
          <button 
            onClick={downloadCSV}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" /> Export Participant CSV
          </button>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-600" />
          AI & Caregiver Interaction Volumes
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ActivityCard value="18" label="Visual Videos Viewed" />
          <ActivityCard value="24" label="Brushing Routines Run" />
          <ActivityCard value="16" label="Diet Interventions Logged" />
          <ActivityCard value="12" label="ASD Bot Interactions" />
        </div>
      </div>

      {/* Available Exports */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
          Research Data Exports
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button 
            onClick={downloadCSV} 
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-teal-300 text-left transition-all group"
          >
            <FileSpreadsheet className="w-6 h-6 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-slate-900 text-sm">Participant CSV</div>
            <div className="text-xs text-slate-500 mt-1">Raw telemetry logs</div>
          </button>

          <button 
            onClick={downloadPDF} 
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-cyan-300 text-left transition-all group"
          >
            <FileCheck className="w-6 h-6 text-cyan-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-slate-900 text-sm">Clinical Report PDF</div>
            <div className="text-xs text-slate-500 mt-1">Printable trial dossier</div>
          </button>

          <button 
            onClick={downloadCSV}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-300 text-left transition-all group"
          >
            <FileSpreadsheet className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-slate-900 text-sm">Intervention Logs</div>
            <div className="text-xs text-slate-500 mt-1">Action adherence log</div>
          </button>

          <button 
            onClick={downloadCSV}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-purple-300 text-left transition-all group"
          >
            <Download className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-slate-900 text-sm">Full Aggregate Dataset</div>
            <div className="text-xs text-slate-500 mt-1">Multi-modal synthesis</div>
          </button>
        </div>
        
        <p className="text-xs text-slate-500 italic">
          Data exports conform strictly to HIPAA and GCP guidelines with automatic participant de-identification.
        </p>
      </div>
    </div>
  );
}

function ActivityCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
      <div className="text-3xl sm:text-4xl font-extrabold text-teal-700 font-mono mb-2">{value}</div>
      <p className="text-xs sm:text-sm font-semibold text-slate-800">{label}</p>
    </div>
  );
}
