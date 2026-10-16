"use client";

import { useState } from "react";
import { Settings, Bell, Globe, Shield, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 mb-2">
            <Settings className="w-3.5 h-3.5 text-teal-600" />
            System & Privacy Configuration
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#051F20] tracking-tight">Settings</h1>
          <p className="text-[#0B2B26] mt-1.5 text-sm sm:text-base font-medium">
            Caregiver preferences, clinical study telemetry controls, and sensory display options.
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="self-start sm:self-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all hover:scale-105"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-white" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Preferences
            </>
          )}
        </button>
      </div>

      {/* Notifications Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-[#051F20] p-6 pb-4 border-b border-slate-100 flex items-center gap-2">
          <Bell className="w-5 h-5 text-teal-600" />
          Caregiver Reminders & Notifications
        </h2>
        <div className="p-6 space-y-4">
          <SettingRow label="Daily Morning Brushing Alarm" value="Enabled (08:00 AM)" action="ON" isActive={true} />
          <SettingRow label="Evening Routine Visual Prompt" value="Enabled (07:30 PM)" action="ON" isActive={true} />
          <SettingRow label="Weekly Pediatric Progress Digest" value="Enabled (Sundays)" action="ON" isActive={true} />
        </div>
      </div>

      {/* Language & Accessibility */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-[#051F20] p-6 pb-4 border-b border-slate-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-600" />
          Language & Sensory Display
        </h2>
        <div className="p-6 space-y-4">
          <SettingRow label="Interface Language" value="English (US)" action="CHANGE" />
          <SettingRow label="Sensory Contrast Theme" value="Soothing Light Clinical" action="DEFAULT" isActive={true} />
          <SettingRow label="Typography Legibility" value="High Contrast + Rich" action="OPTIMAL" isActive={true} />
        </div>
      </div>

      {/* Privacy & Governance */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-[#051F20] p-6 pb-4 border-b border-slate-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          Clinical Study Governance & Privacy
        </h2>
        <div className="p-6 space-y-4">
          <SettingRow label="Computer Vision Video Storage" value="Local Processing Only" action="SECURE" isActive={true} />
          <SettingRow label="De-identified Telemetry Sharing" value="Dr. Nivrutti Reddy Only" action="RESTRICTED" isActive={true} />
          <SettingRow label="Longitudinal Research Export" value="IRB Consent Verified" action="VERIFIED" isActive={true} />
        </div>
      </div>

      {/* Account & Session Controls */}
      <div className="bg-white rounded-2xl border border-rose-200 overflow-hidden p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h3 className="font-bold text-[#051F20] text-base">Account Session</h3>
          <p className="text-xs text-[#163832] mt-0.5 font-semibold">
            Sign out of your caregiver session and return to the main landing page.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href="/landing"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs border border-slate-200 transition-all text-center"
          >
            Go to Landing Page
          </a>
          <button
            onClick={() => {
              window.location.href = "/landing";
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all shadow-xs"
          >
            Log Out & Return
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ 
  label, 
  value, 
  action, 
  isActive = false 
}: { 
  label: string; 
  value: string; 
  action: string; 
  isActive?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 gap-3">
      <span className="text-[#051F20] font-bold text-sm">{label}</span>
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="font-mono text-xs font-bold text-[#235347]">{value}</span>
        <button className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-colors border ${
          isActive 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-white text-slate-700 hover:text-slate-900 border-slate-200"
        }`}>
          {action}
        </button>
      </div>
    </div>
  );
}
