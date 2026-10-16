"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Phone, 
  AlertTriangle, 
  HeartHandshake, 
  Headphones,
  Stethoscope,
  Smile
} from "lucide-react";

export default function HelplinePage() {
  const helplineCallingNumber = "9284046972";
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>("toothache");

  const emergencies = [
    {
      id: "toothache",
      title: "Sudden Tooth Pain or Swelling",
      urgency: "Immediate Attention",
      actionSteps: [
        "Inspect the area gently with a small penlight. Check for food packing between teeth.",
        "Rinse mouth with lukewarm water or salt water (if child tolerates taste). Do not use ice directly on tooth.",
        "Offer pediatric age-appropriate analgesics (e.g. Paracetamol) as advised by your pediatrician.",
        "Call the helpline immediately for triage and urgent clinic scheduling.",
      ],
    },
    {
      id: "meltdown",
      title: "Severe Sensory Meltdown During Brushing",
      urgency: "Calm & De-escalate",
      actionSteps: [
        "Stop brushing immediately. Do not physically restrain or force the brush.",
        "Dim bathroom lights, eliminate echoing noises, and provide child's favorite sensory object/deep pressure.",
        "Use a wet soft gauze square or silicone finger brush with plain water instead of toothpaste.",
        "Resume desensitization at the next routine using the step-by-step visual story video.",
      ],
    },
    {
      id: "trauma",
      title: "Dental Trauma / Broken Tooth / Fall",
      urgency: "Emergency",
      actionSteps: [
        "If a tooth is knocked out (permanent tooth), hold it by the crown (never touch root) and place in cold milk or saline.",
        "Apply gentle pressure with clean gauze if there is gum bleeding.",
        "Call our emergency helpline immediately: 9284046972.",
      ],
    },
    {
      id: "pooling",
      title: "Severe Food Pocketing / Refusal to Swallow",
      urgency: "Care Guidance",
      actionSteps: [
        "Do not dig fingers into child's cheeks as this triggers sensory bite reflexes.",
        "Encourage sipping water through a straw to naturally dislodge food boluses.",
        "Consult our ASD Therapist for oral-motor swallowing exercises.",
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D5E8DA] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAF1DE] border border-[#8EB69B] text-[#051F20] text-xs font-bold mb-3 shadow-2xs">
              <Headphones className="w-3.5 h-3.5 text-[#235347]" />
              24/7 Caregiver Helpline & Support
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#051F20] tracking-tight">
              ASD Oral Care Helpline
            </h1>
            <p className="text-[#0B2B26]/70 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Immediate voice assistance for parents and caregivers facing sensory dental distress, severe brushing resistance, or acute oral health queries.
            </p>
            <div className="mt-3 text-xs text-[#0B2B26]/70 font-medium">
              Supervised by <span className="text-[#051F20] font-bold">Dr. Nivrutti Reddy</span> & Care Team
            </div>
          </div>

          {/* Big Calling Card */}
          <div className="w-full md:w-auto p-5 rounded-2xl bg-[#DAF1DE]/40 border border-[#8EB69B] flex flex-col items-center text-center shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#235347]">
              Direct Helpline Calling
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-[#051F20] mt-1">
              +91 {helplineCallingNumber}
            </div>
            <p className="text-[11px] text-[#0B2B26]/70 mt-1 mb-3">
              Tap below to call directly from your device
            </p>
            <a
              href={`tel:${helplineCallingNumber}`}
              className="w-full py-3 px-6 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              Call {helplineCallingNumber}
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Quick Triage Guides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#051F20] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Emergency Triage & Calming Protocols
            </h2>
            <p className="text-xs text-[#0B2B26]/70 mt-0.5">
              Select an issue below for immediate step-by-step calming procedures
            </p>
          </div>
          <Link
            href="/consultants"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#235347] hover:text-[#163832]"
          >
            <Stethoscope className="w-3.5 h-3.5" /> View Specialized Consultants
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Emergency List */}
          <div className="md:col-span-5 space-y-2.5">
            {emergencies.map((em) => (
              <button
                key={em.id}
                onClick={() => setSelectedEmergency(em.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedEmergency === em.id
                    ? "bg-[#DAF1DE]/60 border-[#8EB69B] text-[#051F20] shadow-xs"
                    : "bg-white border-[#D5E8DA] hover:border-[#8EB69B] text-[#0B2B26]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#051F20]">{em.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B]">
                    {em.urgency}
                  </span>
                </div>
                <p className="text-[11px] text-[#0B2B26]/70">
                  Tap to view clinical protocol & steps
                </p>
              </button>
            ))}
          </div>

          {/* Protocol Details */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-[#D5E8DA] shadow-xs">
            {(() => {
              const active = emergencies.find((e) => e.id === selectedEmergency) || emergencies[0];
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D5E8DA]/60">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#235347]">
                        Immediate Action Guide
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#051F20] mt-0.5">
                        {active.title}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#DAF1DE] text-[#051F20] text-xs font-bold border border-[#8EB69B]">
                      {active.urgency}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {active.actionSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA]">
                        <div className="w-6 h-6 rounded-lg bg-[#235347] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-[#0B2B26] leading-relaxed font-medium">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#D5E8DA]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-[#0B2B26]/70">Still uncertain or child in severe distress?</span>
                    <a
                      href={`tel:${helplineCallingNumber}`}
                      className="px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Helpline Now
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Helpful Care Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] shadow-xs transition-all">
          <HeartHandshake className="w-6 h-6 text-[#235347] mb-2" />
          <h4 className="font-bold text-sm text-[#051F20]">Sensory De-escalation</h4>
          <p className="text-xs text-[#0B2B26]/70 mt-1 leading-relaxed">
            Always stop before a meltdown peaks. Introduce gentle pressure on the jaw or cheek to stimulate calming proprioception.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] shadow-xs transition-all">
          <Smile className="w-6 h-6 text-[#235347] mb-2" />
          <h4 className="font-bold text-sm text-[#051F20]">Visual Stories</h4>
          <p className="text-xs text-[#0B2B26]/70 mt-1 leading-relaxed">
            Watch our cheerful step-by-step videos together in our Visual Learning section to establish trust before hygiene sessions.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] shadow-xs transition-all">
          <Stethoscope className="w-6 h-6 text-[#235347] mb-2" />
          <h4 className="font-bold text-sm text-[#051F20]">Specialist Consultation</h4>
          <p className="text-xs text-[#0B2B26]/70 mt-1 leading-relaxed">
            Looking for structured ASD Therapy or Pediatric Dental consultations? Connect directly with our specialists.
          </p>
          <Link href="/consultants" className="text-xs font-bold text-[#235347] hover:underline mt-2 inline-block">
            View Consultants →
          </Link>
        </div>
      </div>
    </div>
  );
}
