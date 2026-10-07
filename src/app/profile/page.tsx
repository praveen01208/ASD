"use client";

import { mockChild } from "@/lib/mockData";
import { User, ShieldCheck, Heart, Sparkles, Brain, Edit3 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
          <User className="w-3.5 h-3.5 text-teal-400" />
          Baseline Participant Registry
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Child Profile</h1>
        <p className="text-slate-300 mt-1.5 text-sm sm:text-base">
          Individualized baseline traits, sensory vulnerabilities, and adaptive behavioral profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Identity Card */}
        <div className="liquid-glass-card rounded-2xl border border-white/15 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 text-3xl font-extrabold shadow-lg shadow-teal-500/20">
                {mockChild.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white">{mockChild.participant_code}</h2>
                  <span className="text-xs font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    {mockChild.name}
                  </span>
                </div>
                <p className="text-slate-200 mt-1 text-sm font-semibold">
                  Age {mockChild.age} years • {mockChild.gender}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active In Study Routine
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Diagnosis Level</span>
                <span className="text-white font-bold">{mockChild.support_level}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Oral Profile Baseline</span>
                <span className="text-teal-300 font-bold">Moderate Caries Risk</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/10">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
            <button className="px-4 py-2 rounded-xl liquid-glass-pill hover:bg-white/10 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 transition-all">
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Communication & Support */}
        <div className="liquid-glass-card rounded-2xl border border-white/15 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 pb-4 border-b border-white/10 flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            Communication & Behavioral Support
          </h2>
          
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
              <span className="text-xs text-slate-400 block font-semibold mb-1">Communication Modality</span>
              <span className="text-sm font-bold text-white capitalize">{mockChild.communication_level} (Visual cards + gestures)</span>
            </div>
            
            <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
              <span className="text-xs text-slate-400 block font-semibold mb-1">Support Tier</span>
              <span className="text-sm font-bold text-teal-300 capitalize">{mockChild.support_level}</span>
            </div>
            
            <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
              <span className="text-xs text-slate-400 block font-semibold mb-1">Fine Motor Skills</span>
              <span className="text-sm font-bold text-slate-200 capitalize">{mockChild.motor_difficulty}</span>
            </div>
          </div>
        </div>

        {/* Sensory Profile */}
        <div className="liquid-glass-card rounded-2xl border border-white/15 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            Sensory Sensitivity Matrix
          </h2>
          
          <div className="space-y-4">
            <SensoryRow label="Taste Sensitivity" level={mockChild.sensory_profile.taste} />
            <SensoryRow label="Touch / Oral Texture" level={mockChild.sensory_profile.touch} />
            <SensoryRow label="Sound (Brush Motor)" level={mockChild.sensory_profile.sound} />
            <SensoryRow label="Visual Sequencing" level={mockChild.sensory_profile.visual} />
          </div>
        </div>

        {/* Food & Preferences */}
        <div className="liquid-glass-card rounded-2xl border border-white/15 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 pb-4 border-b border-white/10 flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-400" />
            Reinforcement & Food Preferences
          </h2>
          
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
              <span className="text-xs text-slate-400 block font-semibold mb-1">Food Selectivity</span>
              <span className="text-sm font-bold text-amber-300 capitalize">{mockChild.food_selectivity}</span>
            </div>
            
            <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
              <span className="text-xs text-slate-400 block font-semibold mb-1">Preferred Texture</span>
              <span className="text-sm font-bold text-white capitalize">{mockChild.preferred_texture}</span>
            </div>
            
            <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
              <span className="text-xs text-slate-400 block font-semibold mb-1">Primary Reinforcer</span>
              <span className="text-sm font-bold text-emerald-400 capitalize">{mockChild.reinforcement_type} / 5-min tablet reward</span>
            </div>
            
            <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
              <span className="text-xs text-slate-400 block font-semibold mb-1">Assigned Toothbrush Hardware</span>
              <span className="text-sm font-bold text-cyan-300 capitalize">{mockChild.toothbrush_type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Note */}
      <div className="liquid-glass-card rounded-2xl border border-white/15 p-6 sm:p-8">
        <h2 className="text-sm font-bold text-teal-300 mb-4 uppercase tracking-wider">
          Profile Traits Dynamically Used by ASD Bot
        </h2>
        <div className="flex flex-wrap gap-2.5">
          <AIChip label="Sensory Sensitivity" />
          <AIChip label="Food Selectivity" />
          <AIChip label="Visual Step Readiness" />
          <AIChip label="Fine Motor Control" />
          <AIChip label="Positive Reinforcement Timing" />
        </div>
      </div>
    </div>
  );
}

function SensoryRow({ label, level }: { label: string; level: string }) {
  const getBadgeStyle = (l: string) => {
    switch(l.toLowerCase()) {
      case 'high': 
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'moderate': 
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'low': 
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default: 
        return 'bg-slate-700/50 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl liquid-glass border border-white/5">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <span className={`px-4 py-1 rounded-full text-xs font-mono font-bold capitalize border ${getBadgeStyle(level)}`}>
        {level}
      </span>
    </div>
  );
}

function AIChip({ label }: { label: string }) {
  return (
    <span className="px-3.5 py-1.5 rounded-xl liquid-glass border border-white/10 text-xs font-semibold text-slate-200 hover:border-teal-400/30 transition-all">
      {label}
    </span>
  );
}
