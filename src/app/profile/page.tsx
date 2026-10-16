"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  ShieldCheck, 
  Smile, 
  Utensils, 
  Stethoscope, 
  HeartHandshake, 
  Baby,
  CheckCircle2
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-[#051F20] bg-[#DAF1DE] border border-[#8EB69B] mb-2 shadow-2xs">
            <User className="w-3.5 h-3.5 text-[#235347]" />
            Active Participant Profile & 5-Domain Registry
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#051F20] tracking-tight">
            Child Profile ({child?.name || "Leo"})
          </h1>
          <p className="text-[#0B2B26]/70 mt-1.5 text-xs sm:text-sm">
            Stored clinical baseline details, sensory tolerances, dietary patterns, and behavioral motivators.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#235347]" /> Baseline Intake Stored
          </span>
        </div>
      </div>

      {child && (
        <div className="space-y-6">
          {/* Identity & Caregiver Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity Card */}
            <div className="bg-white rounded-3xl border border-[#D5E8DA] hover:border-[#8EB69B] shadow-xs p-6 sm:p-7 flex flex-col justify-between transition-all">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#235347] flex items-center justify-center text-white text-2xl font-black shadow-xs">
                    {child.name.substring(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-[#051F20]">{child.name}</h2>
                      <span className="text-xs font-mono text-[#051F20] bg-[#DAF1DE] px-2 py-0.5 rounded border border-[#8EB69B] font-bold">
                        {child.code}
                      </span>
                    </div>
                    <p className="text-[#0B2B26]/70 mt-0.5 text-xs font-medium">
                      Age {child.age} • {child.gender} • DOB: {child.dob}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#235347] font-bold mt-1">
                      <span className="w-2 h-2 rounded-full bg-[#235347] animate-pulse" />
                      Active Longitudinal Telemetry
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#D5E8DA]/60 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#D5E8DA]/40">
                    <span className="text-[#0B2B26]/60 font-medium">ASD Classification</span>
                    <span className="text-[#051F20] font-bold">{child.asdLevel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#D5E8DA]/40">
                    <span className="text-[#0B2B26]/60 font-medium">Communication Level</span>
                    <span className="text-[#235347] font-bold">{child.communicationLevel}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#D5E8DA]/60 flex items-center justify-between text-xs">
                <span className="bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#235347]" /> Calibrated Baseline
                </span>
                <span className="text-[#0B2B26]/60 font-mono text-[11px]">ID: {child.id}</span>
              </div>
            </div>

            {/* Caregiver & Communication Support */}
            <div className="bg-white rounded-3xl border border-[#D5E8DA] hover:border-[#8EB69B] shadow-xs p-6 sm:p-7 space-y-4 transition-all">
              <h3 className="text-base font-bold text-[#051F20] pb-3 border-b border-[#D5E8DA]/60 flex items-center gap-2">
                <Baby className="w-5 h-5 text-[#235347]" />
                Caregiver & Contact Information
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] flex justify-between items-center">
                  <span className="text-[#0B2B26]/70 font-medium">Primary Caregiver:</span>
                  <span className="text-[#051F20] font-bold">{child.caregiverName} ({child.relationship})</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] flex justify-between items-center">
                  <span className="text-[#0B2B26]/70 font-medium">Contact Number:</span>
                  <span className="text-[#051F20] font-mono font-bold">{child.caregiverPhone}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] flex justify-between items-center">
                  <span className="text-[#0B2B26]/70 font-medium">Communication Protocol:</span>
                  <span className="text-[#235347] font-bold">{child.demographics?.communicationStyle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Domains Detailed Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domain 2: Brushing Habits */}
            <div className="bg-white rounded-3xl border border-[#D5E8DA] hover:border-[#8EB69B] shadow-xs p-6 space-y-3 text-xs transition-all">
              <h3 className="text-sm font-bold text-[#051F20] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#D5E8DA]/60">
                <Smile className="w-4 h-4 text-[#235347]" /> 2. Brushing Habits & Formulation
              </h3>
              <div className="space-y-2 text-[#0B2B26]">
                <div><span className="text-[#0B2B26]/60">Frequency:</span> <span className="text-[#051F20] font-bold">{child.brushingHabits?.frequency}</span></div>
                <div><span className="text-[#0B2B26]/60">Duration:</span> <span className="text-[#051F20] font-bold">{child.brushingHabits?.duration}</span></div>
                <div><span className="text-[#0B2B26]/60">Toothbrush:</span> <span className="text-[#051F20] font-bold">{child.brushingHabits?.toothbrushType}</span></div>
                <div><span className="text-[#0B2B26]/60">Toothpaste:</span> <span className="text-[#051F20] font-bold">{child.brushingHabits?.toothpaste}</span></div>
                <div><span className="text-[#0B2B26]/60">Assistance:</span> <span className="text-[#051F20] font-bold">{child.brushingHabits?.assistanceNeeded}</span></div>
                <div><span className="text-[#0B2B26]/60">Tolerance:</span> <span className="text-[#235347] font-bold">{child.brushingHabits?.toleranceLevel}</span></div>
              </div>
            </div>

            {/* Domain 3: Dietary Habits */}
            <div className="bg-white rounded-3xl border border-[#D5E8DA] hover:border-[#8EB69B] shadow-xs p-6 space-y-3 text-xs transition-all">
              <h3 className="text-sm font-bold text-[#051F20] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#D5E8DA]/60">
                <Utensils className="w-4 h-4 text-[#235347]" /> 3. Dietary Habits & Enamel Defense
              </h3>
              <div className="space-y-2 text-[#0B2B26]">
                <div><span className="text-[#0B2B26]/60">Sugar Exposure:</span> <span className="text-amber-700 font-bold">{child.dietaryHabits?.sugaryFoodFrequency}</span></div>
                <div><span className="text-[#0B2B26]/60">Healthy Fruits/Vegetables:</span> <span className="text-[#235347] font-bold">{child.dietaryHabits?.healthyFoodFrequency}</span></div>
                <div><span className="text-[#0B2B26]/60">Cheek Pooling (Holding Food):</span> <span className="text-[#051F20] font-bold">{child.dietaryHabits?.foodHoldingInMouth}</span></div>
                <div><span className="text-[#0B2B26]/60">Night Feeding / Bed Bottle:</span> <span className="text-[#051F20] font-bold">{child.dietaryHabits?.nightFeedingOrBottle}</span></div>
                <div><span className="text-[#0B2B26]/60">Hydration / Water:</span> <span className="text-[#051F20] font-bold">{child.dietaryHabits?.waterIntake}</span></div>
              </div>
            </div>

            {/* Domain 4: Dental & Medical History */}
            <div className="bg-white rounded-3xl border border-[#D5E8DA] hover:border-[#8EB69B] shadow-xs p-6 space-y-3 text-xs transition-all">
              <h3 className="text-sm font-bold text-[#051F20] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#D5E8DA]/60">
                <Stethoscope className="w-4 h-4 text-[#235347]" /> 4. Dental & Medical History
              </h3>
              <div className="space-y-2 text-[#0B2B26]">
                <div><span className="text-[#0B2B26]/60">Last Dental Visit:</span> <span className="text-[#051F20] font-bold">{child.dentalMedicalHistory?.lastDentalVisit}</span></div>
                <div><span className="text-[#0B2B26]/60">Past Dental Experience:</span> <span className="text-[#051F20] font-bold">{child.dentalMedicalHistory?.pastDentalExperience}</span></div>
                <div><span className="text-[#0B2B26]/60">Active Pain / Cavities:</span> <span className="text-[#051F20] font-bold">{child.dentalMedicalHistory?.activeCavitiesOrPain}</span></div>
                <div><span className="text-[#0B2B26]/60">Gum Bleeding:</span> <span className="text-[#051F20] font-bold">{child.dentalMedicalHistory?.gumBleeding}</span></div>
                <div><span className="text-[#0B2B26]/60">Medications:</span> <span className="text-[#051F20] font-bold">{child.dentalMedicalHistory?.regularMedications}</span></div>
              </div>
            </div>

            {/* Domain 5: Child Behaviour & Sensory Profile */}
            <div className="bg-white rounded-3xl border border-[#D5E8DA] hover:border-[#8EB69B] shadow-xs p-6 space-y-3 text-xs transition-all">
              <h3 className="text-sm font-bold text-[#051F20] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#D5E8DA]/60">
                <HeartHandshake className="w-4 h-4 text-[#235347]" /> 5. Child Behaviour & Sensory Triggers
              </h3>
              <div className="space-y-2 text-[#0B2B26]">
                <div><span className="text-[#0B2B26]/60">Mouth Opening:</span> <span className="text-[#051F20] font-bold">{child.childBehaviour?.mouthOpeningCooperation}</span></div>
                <div>
                  <span className="text-[#0B2B26]/60 block mb-1">Sensory Triggers:</span>
                  <div className="flex flex-wrap gap-1">
                    {child.childBehaviour?.sensoryAversionTriggers?.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[#0B2B26]/60 block mb-1 mt-2">Effective Motivators:</span>
                  <div className="flex flex-wrap gap-1">
                    {child.childBehaviour?.effectiveMotivators?.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] text-[10px] font-bold">
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
