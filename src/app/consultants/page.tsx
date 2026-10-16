"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Stethoscope, 
  Brain, 
  Users, 
  MessageCircle, 
  Phone, 
  CheckCircle2
} from "lucide-react";

export default function ConsultantsPage() {
  const consultantWhatsAppNumber = "7758022942";
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("all");

  const specialists = [
    {
      id: "asd-therapist",
      role: "ASD Therapist (Behavioral & Sensory)",
      category: "therapy",
      icon: Brain,
      badge: "Sensory Desensitization",
      accent: "teal",
      description:
        "Specializes in oral-motor sensory integration, behavioral shaping, visual PECS desensitization schedules, and reducing sensory aversion to dental tools, toothpaste textures, and vibrations.",
      keyAreas: [
        "Sensory oral tactile defensiveness & gag reflex calming",
        "Visual scheduling and token reinforcement strategies",
        "Graduated step-by-step tolerance conditioning",
        "Oral-motor chewing and swallowing facilitation",
      ],
      whatsappMsg:
        "Hello, I would like to consult the ASD Therapist regarding sensory desensitization and brushing routines for my child.",
    },
    {
      id: "pediatric-dentist",
      role: "Pediatric Dentist",
      category: "clinical",
      icon: Stethoscope,
      badge: "Special Needs Clinical Care",
      accent: "cyan",
      description:
        "Specializes in clinical examination, enamel remineralization, fluoride varnish protocols, minimally invasive restorations, and gentle sensory-adapted dental checkups for neurodivergent children.",
      keyAreas: [
        "Caries risk evaluation & early enamel demineralization arrest",
        "Sensory-adapted mock dental clinic visits",
        "Customized non-foaming fluoride prescription",
        "Emergency toothache and soft-tissue injury triage",
      ],
      whatsappMsg:
        "Hello, I would like to consult the Pediatric Dentist regarding clinical oral health, cavities, and checkup preparation.",
    },
    {
      id: "public-health-dentist",
      role: "Public Health Dentist",
      category: "public-health",
      icon: Users,
      badge: "Preventive Protocols & Nutrition",
      accent: "emerald",
      description:
        "Focuses on longitudinal preventive protocols, dietary sugar reduction, community healthcare resources, caregiver educational empowerment, and population-level caries prevention guidelines.",
      keyAreas: [
        "Nutritional counseling: snacking frequency & enamel defense",
        "Evidence-based community oral health guidelines",
        "Caregiver empowerment and home routine auditing",
        "Preventive sealant and remineralization regimens",
      ],
      whatsappMsg:
        "Hello, I would like to consult the Public Health Dentist regarding preventive oral care guidelines and dietary planning.",
    },
  ];

  const filtered = selectedSpecialist === "all" 
    ? specialists 
    : specialists.filter(s => s.id === selectedSpecialist);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              Multidisciplinary Clinical Panel
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Specialized ASD Consultants
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Connect directly with specialized clinicians for personalized sensory desensitization, pediatric dental exams, and preventive dietary protocols.
            </p>
          </div>

          {/* WhatsApp Connect Box */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col items-center text-center shadow-xs w-full md:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
              Direct Clinical WhatsApp
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 mt-1">
              +91 {consultantWhatsAppNumber}
            </div>
            <a
              href={`https://wa.me/91${consultantWhatsAppNumber}?text=${encodeURIComponent(
                "Hello, I am reaching out to the ASD Oral Care clinical team regarding clinical guidance for my child."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              WhatsApp Specialist Panel
            </a>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedSpecialist("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedSpecialist === "all"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200"
          }`}
        >
          All 3 Specialists
        </button>
        {specialists.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSpecialist(s.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedSpecialist === s.id
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <s.icon className="w-3.5 h-3.5" />
            {s.role}
          </button>
        ))}
      </div>

      {/* 3 Specialists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((spec) => {
          const Icon = spec.icon;
          const directWa = `https://wa.me/91${consultantWhatsAppNumber}?text=${encodeURIComponent(spec.whatsappMsg)}`;

          return (
            <div
              key={spec.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 flex flex-col justify-between transition-all group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {spec.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {spec.role}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {spec.description}
                </p>

                <div className="mt-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                    Core Specializations:
                  </span>
                  {spec.keyAreas.map((area, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                <a
                  href={directWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  WhatsApp {spec.role.split("(")[0].trim()}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-Link to Helpline */}
      <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Need Urgent Immediate Assistance?</h4>
            <p className="text-xs text-slate-600">
              For acute emergencies or active distress, call our direct 24/7 Helpline.
            </p>
          </div>
        </div>

        <Link
          href="/helpline"
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs"
        >
          <Phone className="w-3.5 h-3.5" /> Go to 24/7 Helpline
        </Link>
      </div>
    </div>
  );
}
