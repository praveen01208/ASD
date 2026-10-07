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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
            <Settings className="w-3.5 h-3.5 text-teal-400" />
            System & Privacy Configuration
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Settings</h1>
          <p className="text-slate-300 mt-1.5 text-sm sm:text-base">
            Caregiver preferences, clinical study telemetry controls, and sensory display options.
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="self-start sm:self-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-slate-950" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Preferences
            </>
          )}
        </button>
      </div>

      {/* Notifications Card */}
      <div className="liquid-glass-card rounded-2xl border border-white/15 overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-white p-6 pb-4 border-b border-white/10 flex items-center gap-2">
          <Bell className="w-5 h-5 text-teal-400" />
          Caregiver Reminders & Notifications
        </h2>
        <div className="p-6 space-y-4">
          <SettingRow label="Daily Morning Brushing Alarm" value="Enabled (08:00 AM)" action="ON" isActive={true} />
          <SettingRow label="Evening Routine Visual Prompt" value="Enabled (07:30 PM)" action="ON" isActive={true} />
          <SettingRow label="Weekly Pediatric Progress Digest" value="Enabled (Sundays)" action="ON" isActive={true} />
        </div>
      </div>

      {/* Language & Accessibility */}
      <div className="liquid-glass-card rounded-2xl border border-white/15 overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-white p-6 pb-4 border-b border-white/10 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          Language & Sensory Display
        </h2>
        <div className="p-6 space-y-4">
          <SettingRow label="Interface Language" value="English (US)" action="CHANGE" />
          <SettingRow label="Sensory Contrast Theme" value="Liquid Glass Dark" action="DEFAULT" isActive={true} />
          <SettingRow label="Typography Legibility" value="High Contrast + Rich" action="OPTIMAL" isActive={true} />
        </div>
      </div>

      {/* Privacy & Governance */}
      <div className="liquid-glass-card rounded-2xl border border-white/15 overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-white p-6 pb-4 border-b border-white/10 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Clinical Study Governance & Privacy
        </h2>
        <div className="p-6 space-y-4">
          <SettingRow label="Computer Vision Video Storage" value="Local Processing Only" action="SECURE" isActive={true} />
          <SettingRow label="De-identified Telemetry Sharing" value="Dr. Nivrutti Reddy Only" action="RESTRICTED" isActive={true} />
          <SettingRow label="Longitudinal Research Export" value="IRB Consent Verified" action="VERIFIED" isActive={true} />
        </div>
      </div>

      {/* Account & Session Controls */}
      <div className="liquid-glass-card rounded-2xl border border-red-500/30 overflow-hidden p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-base">Account Session</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Sign out of your caregiver session and return to the main landing page.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href="/landing"
            className="px-4 py-2.5 rounded-xl liquid-glass-pill hover:bg-white/10 text-slate-200 hover:text-white font-bold text-xs border border-white/15 transition-all text-center"
          >
            Go to Landing Page
          </a>
          <button
            onClick={() => {
              window.location.href = "/landing";
            }}
            className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-rose-300 hover:text-white font-bold text-xs border border-red-500/40 transition-all shadow-sm"
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl liquid-glass border border-white/5 gap-3">
      <span className="text-slate-200 font-semibold text-sm">{label}</span>
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="font-mono text-xs font-bold text-slate-300">{value}</span>
        <button className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-colors border ${
          isActive 
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
            : "bg-white/10 text-slate-300 hover:text-white border-white/15"
        }`}>
          {action}
        </button>
      </div>
    </div>
  );
}
