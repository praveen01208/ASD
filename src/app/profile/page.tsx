"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Brain, 
  Edit3, 
  Smile, 
  Utensils, 
  Stethoscope, 
  HeartHandshake, 
  Baby,
  Phone,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { getActiveAccount, ChildAccount } from "@/lib/userStore";

export default function ProfilePage() {
  const [activeAccount, setActiveAccount] = useState<ChildAccount | null>(null);

  useEffect(() => {
    setActiveAccount(getActiveAccount());
    const handleAccChange = () => {
      setActiveAccount(getActiveAccount());
    };
    window.addEventListener("asd_account_changed", handleAccChange);
    return () => window.removeEventListener("asd_account_changed", handleAccChange);
  }, []);

  const child = activeAccount;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
            <User className="w-3.5 h-3.5 text-teal-400" />
            Active Participant Profile & 5-Domain Registry
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Child Profile ({child?.name || "Leo"})
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs sm:text-sm">
            Stored clinical baseline details, sensory tolerances, dietary patterns, and behavioral motivators.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Baseline Intake Stored
          </span>
        </div>
      </div>

      {child && (
        <div className="space-y-6">
          {/* Identity & Caregiver Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity Card */}
            <div className="liquid-glass-card rounded-3xl border border-white/15 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-teal-500/20">
                    {child.name.substring(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-white">{child.name}</h2>
                      <span className="text-xs font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                        {child.code}
                      </span>
                    </div>
                    <p className="text-slate-200 mt-0.5 text-xs font-medium">
                      Age {child.age} • {child.gender} • DOB: {child.dob}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active Longitudinal Telemetry
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">ASD Classification</span>
                    <span className="text-white font-bold">{child.asdLevel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Communication Level</span>
                    <span className="text-teal-300 font-bold">{child.communicationLevel}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Calibrated Baseline
                </span>
                <span className="text-slate-400 font-mono text-[11px]">ID: {child.id}</span>
              </div>
            </div>

            {/* Caregiver & Communication Support */}
            <div className="liquid-glass-card rounded-3xl border border-white/15 p-6 sm:p-7 space-y-4">
              <h3 className="text-base font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
                <Baby className="w-5 h-5 text-cyan-400" />
                Caregiver & Contact Information
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl liquid-glass border border-white/10 flex justify-between items-center">
                  <span className="text-slate-400">Primary Caregiver:</span>
                  <span className="text-white font-bold">{child.caregiverName} ({child.relationship})</span>
                </div>
                <div className="p-3 rounded-xl liquid-glass border border-white/10 flex justify-between items-center">
                  <span className="text-slate-400">Contact Number:</span>
                  <span className="text-white font-mono font-bold">{child.caregiverPhone}</span>
                </div>
                <div className="p-3 rounded-xl liquid-glass border border-white/10 flex justify-between items-center">
                  <span className="text-slate-400">Communication Protocol:</span>
                  <span className="text-teal-300 font-bold">{child.demographics?.communicationStyle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Domains Detailed Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domain 2: Brushing Habits */}
            <div className="liquid-glass-card rounded-3xl border border-teal-500/30 p-6 space-y-3 text-xs">
              <h3 className="text-sm font-black text-teal-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
                <Smile className="w-4 h-4" /> 2. Brushing Habits & Formulation
              </h3>
              <div className="space-y-2 text-slate-300">
                <div><span className="text-slate-400">Frequency:</span> <span className="text-white font-semibold">{child.brushingHabits?.frequency}</span></div>
                <div><span className="text-slate-400">Duration:</span> <span className="text-white font-semibold">{child.brushingHabits?.duration}</span></div>
                <div><span className="text-slate-400">Toothbrush:</span> <span className="text-white font-semibold">{child.brushingHabits?.toothbrushType}</span></div>
                <div><span className="text-slate-400">Toothpaste:</span> <span className="text-white font-semibold">{child.brushingHabits?.toothpaste}</span></div>
                <div><span className="text-slate-400">Assistance:</span> <span className="text-white font-semibold">{child.brushingHabits?.assistanceNeeded}</span></div>
                <div><span className="text-slate-400">Tolerance:</span> <span className="text-teal-300 font-semibold">{child.brushingHabits?.toleranceLevel}</span></div>
              </div>
            </div>

            {/* Domain 3: Dietary Habits */}
            <div className="liquid-glass-card rounded-3xl border border-amber-500/30 p-6 space-y-3 text-xs">
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
                <Utensils className="w-4 h-4" /> 3. Dietary Habits & Enamel Defense
              </h3>
              <div className="space-y-2 text-slate-300">
                <div><span className="text-slate-400">Sugar Exposure:</span> <span className="text-amber-300 font-semibold">{child.dietaryHabits?.sugaryFoodFrequency}</span></div>
                <div><span className="text-slate-400">Healthy Fruits/Vegetables:</span> <span className="text-emerald-300 font-semibold">{child.dietaryHabits?.healthyFoodFrequency}</span></div>
                <div><span className="text-slate-400">Cheek Pooling (Holding Food):</span> <span className="text-white font-semibold">{child.dietaryHabits?.foodHoldingInMouth}</span></div>
                <div><span className="text-slate-400">Night Feeding / Bed Bottle:</span> <span className="text-white font-semibold">{child.dietaryHabits?.nightFeedingOrBottle}</span></div>
                <div><span className="text-slate-400">Hydration / Water:</span> <span className="text-white font-semibold">{child.dietaryHabits?.waterIntake}</span></div>
              </div>
            </div>

            {/* Domain 4: Dental & Medical History */}
            <div className="liquid-glass-card rounded-3xl border border-indigo-500/30 p-6 space-y-3 text-xs">
              <h3 className="text-sm font-black text-indigo-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
                <Stethoscope className="w-4 h-4" /> 4. Dental & Medical History
              </h3>
              <div className="space-y-2 text-slate-300">
                <div><span className="text-slate-400">Last Dental Visit:</span> <span className="text-white font-semibold">{child.dentalMedicalHistory?.lastDentalVisit}</span></div>
                <div><span className="text-slate-400">Past Dental Experience:</span> <span className="text-white font-semibold">{child.dentalMedicalHistory?.pastDentalExperience}</span></div>
                <div><span className="text-slate-400">Active Pain / Cavities:</span> <span className="text-white font-semibold">{child.dentalMedicalHistory?.activeCavitiesOrPain}</span></div>
                <div><span className="text-slate-400">Gum Bleeding:</span> <span className="text-white font-semibold">{child.dentalMedicalHistory?.gumBleeding}</span></div>
                <div><span className="text-slate-400">Medications:</span> <span className="text-white font-semibold">{child.dentalMedicalHistory?.regularMedications}</span></div>
              </div>
            </div>

            {/* Domain 5: Child Behaviour & Sensory Profile */}
            <div className="liquid-glass-card rounded-3xl border border-emerald-500/30 p-6 space-y-3 text-xs">
              <h3 className="text-sm font-black text-emerald-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
                <HeartHandshake className="w-4 h-4" /> 5. Child Behaviour & Sensory Triggers
              </h3>
              <div className="space-y-2 text-slate-300">
                <div><span className="text-slate-400">Mouth Opening:</span> <span className="text-white font-semibold">{child.childBehaviour?.mouthOpeningCooperation}</span></div>
                <div>
                  <span className="text-slate-400 block mb-1">Sensory Triggers:</span>
                  <div className="flex flex-wrap gap-1">
                    {child.childBehaviour?.sensoryAversionTriggers?.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 mt-2">Effective Motivators:</span>
                  <div className="flex flex-wrap gap-1">
                    {child.childBehaviour?.effectiveMotivators?.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
