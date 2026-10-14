"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@/context/AuthContext";
import {
  Sparkles,
  Baby,
  Smile,
  Utensils,
  Stethoscope,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award,
  ChevronRight,
  Check,
} from "lucide-react";
import { saveUserProfile, ChildAccount } from "@/lib/userStore";

// ─── Types ─────────────────────────────────────────────────────────────────

interface FormData {
  // Domain 0 — Demographics
  childName: string;
  childAge: string;
  dateOfBirth: string;
  gender: string;
  caregiverName: string;
  relationship: string;
  contactPhone: string;
  asdLevel: string;
  communicationLevel: string;

  // Domain 1 — Brushing Habits (Q1–Q9)
  q1_brushFrequency: string;
  q2_brushDuration: string;
  q3_toothbrushType: string;
  q3_toothbrushOther: string;
  q4_toothpaste: string;
  q5_surfacesCovered: string;
  q6_assistance: string;
  q7_brushingDifficulties: string[];
  q8_helpStrategy: string;
  q9_brushingChanges: string;

  // Domain 2 — Dietary Habits (Q10–Q14)
  q10_sugaryDrinks: string;
  q11_sugarySnacks: string;
  q12_mealFrequency: string;
  q13_foodHolding: string;
  q14_nightFeeding: string;

  // Domain 3 — Medical & Dental History (Q15–Q17)
  q15_lastDentalVisit: string;
  q15_neverVisited: boolean;
  q16_dentalProblems: string[];
  q16_dentalOther: string;
  q17_medicalConditions: string[];
  q17_medicalOther: string;

  // Domain 4 — Behavioral & Sensory-Motor Skills (Q18–Q20)
  q18_oralHygieneAttitude: string;
  q19_motorSkills: string;
  q20_sensoryTriggers: string[];
  q20_sensoryOther: string;
}

const INITIAL_FORM: FormData = {
  childName: "",
  childAge: "6",
  dateOfBirth: "",
  gender: "Male",
  caregiverName: "",
  relationship: "Mother",
  contactPhone: "",
  asdLevel: "Level 1 (Mild support needed)",
  communicationLevel: "Verbal with Visual Cues",

  q1_brushFrequency: "",
  q2_brushDuration: "",
  q3_toothbrushType: "",
  q3_toothbrushOther: "",
  q4_toothpaste: "",
  q5_surfacesCovered: "",
  q6_assistance: "",
  q7_brushingDifficulties: [],
  q8_helpStrategy: "",
  q9_brushingChanges: "",

  q10_sugaryDrinks: "",
  q11_sugarySnacks: "",
  q12_mealFrequency: "",
  q13_foodHolding: "",
  q14_nightFeeding: "",

  q15_lastDentalVisit: "",
  q15_neverVisited: false,
  q16_dentalProblems: [],
  q16_dentalOther: "",
  q17_medicalConditions: [],
  q17_medicalOther: "",

  q18_oralHygieneAttitude: "",
  q19_motorSkills: "",
  q20_sensoryTriggers: [],
  q20_sensoryOther: "",
};

// ─── Helper Components ───────────────────────────────────────────────────────

function SectionHeader({ domain, total, title, subtitle }: { domain: number; total: number; title: string; subtitle?: string }) {
  return (
    <div className="pb-4 border-b border-white/10 mb-5">
      <span
        className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2"
        style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", color: "#2dd4bf" }}
      >
        Domain {domain} of {total}
      </span>
      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function RadioGroup({
  label,
  qNum,
  name,
  options,
  value,
  onChange,
  other,
  otherValue,
  onOtherChange,
}: {
  label: string;
  qNum?: string;
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  other?: boolean;
  otherValue?: string;
  onOtherChange?: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-200 leading-relaxed">
        {qNum && <span className="text-teal-400 mr-1">{qNum}.</span>}
        {label}
      </label>
      <div className="space-y-1.5">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all"
              style={{
                background: selected ? "rgba(20,184,166,0.18)" : "rgba(255,255,255,0.04)",
                border: selected ? "1px solid rgba(20,184,166,0.5)" : "1px solid rgba(255,255,255,0.1)",
                color: selected ? "#f0fdfa" : "#94a3b8",
              }}
            >
              <span
                className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                style={{
                  borderColor: selected ? "#14b8a6" : "rgba(255,255,255,0.2)",
                  background: selected ? "#14b8a6" : "transparent",
                }}
              >
                {selected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
              </span>
              {opt}
            </button>
          );
        })}
        {other && (
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => onChange("Other")}
              className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
              style={{
                borderColor: value === "Other" ? "#14b8a6" : "rgba(255,255,255,0.2)",
                background: value === "Other" ? "#14b8a6" : "transparent",
              }}
            >
              {value === "Other" && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
            </button>
            <input
              type="text"
              placeholder="Other (please specify)"
              value={otherValue || ""}
              onChange={(e) => { onChange("Other"); onOtherChange?.(e.target.value); }}
              className="flex-1 liquid-glass-input rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CheckboxGroup({
  label,
  qNum,
  options,
  values,
  onChange,
  other,
  otherValue,
  onOtherChange,
}: {
  label: string;
  qNum?: string;
  options: string[];
  values: string[];
  onChange: (vals: string[]) => void;
  other?: boolean;
  otherValue?: string;
  onOtherChange?: (v: string) => void;
}) {
  const toggle = (opt: string) => {
    onChange(values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-200 leading-relaxed">
        {qNum && <span className="text-teal-400 mr-1">{qNum}.</span>}
        {label}
        <span className="ml-1.5 text-[10px] font-normal text-slate-500">(Select all that apply)</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {options.map((opt) => {
          const checked = values.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className="text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all"
              style={{
                background: checked ? "rgba(20,184,166,0.18)" : "rgba(255,255,255,0.04)",
                border: checked ? "1px solid rgba(20,184,166,0.5)" : "1px solid rgba(255,255,255,0.1)",
                color: checked ? "#f0fdfa" : "#94a3b8",
              }}
            >
              <span
                className="w-4 h-4 rounded-md border-2 flex-shrink-0 flex items-center justify-center"
                style={{
                  borderColor: checked ? "#14b8a6" : "rgba(255,255,255,0.2)",
                  background: checked ? "#14b8a6" : "transparent",
                }}
              >
                {checked && <Check className="w-2.5 h-2.5 text-slate-950" />}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {other && (
        <input
          type="text"
          placeholder="Other (please specify)"
          value={otherValue || ""}
          onChange={(e) => onOtherChange?.(e.target.value)}
          className="w-full liquid-glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 mt-1"
        />
      )}
    </div>
  );
}

function StyledInput({
  label,
  qNum,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  qNum?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-200">
        {qNum && <span className="text-teal-400 mr-1">{qNum}.</span>}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full liquid-glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
      />
    </div>
  );
}

function StyledSelect({
  label,
  qNum,
  value,
  onChange,
  options,
}: {
  label: string;
  qNum?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-200">
        {qNum && <span className="text-teal-400 mr-1">{qNum}.</span>}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full liquid-glass-input rounded-xl px-3.5 py-2.5 text-xs text-white"
      >
        <option value="">— Select —</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  const set = (field: keyof FormData, value: string | string[] | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const steps = [
    { id: 1, title: "Welcome", icon: Sparkles },
    { id: 2, title: "Demographics", icon: Baby },
    { id: 3, title: "Brushing", icon: Smile },
    { id: 4, title: "Diet", icon: Utensils },
    { id: 5, title: "Medical", icon: Stethoscope },
    { id: 6, title: "Behaviour", icon: HeartHandshake },
    { id: 7, title: "Review", icon: Award },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const childId = "child-" + Date.now();
    const childCode = "ASD-" + Math.floor(100 + Math.random() * 900);

    const allSensoryTriggers = [
      ...formData.q20_sensoryTriggers,
      ...(formData.q20_sensoryOther ? [formData.q20_sensoryOther] : []),
    ];

    const newAccount: ChildAccount = {
      id: childId,
      code: childCode,
      name: formData.childName.trim() || (user?.user_metadata?.name ? `${user.user_metadata.name}'s Child` : "Child"),
      age: parseInt(formData.childAge) || 6,
      gender: formData.gender,
      dob: formData.dateOfBirth,
      caregiverName: formData.caregiverName.trim() || user?.user_metadata?.full_name || user?.user_metadata?.name || "Caregiver",
      caregiverPhone: formData.contactPhone.trim() || "",
      relationship: formData.relationship,
      asdLevel: formData.asdLevel,
      communicationLevel: formData.communicationLevel,
      sensorySensitivities: allSensoryTriggers,

      demographics: {
        childName: formData.childName.trim() || (user?.user_metadata?.name ? `${user.user_metadata.name}'s Child` : "Child"),
        age: parseInt(formData.childAge) || 6,
        dob: formData.dateOfBirth,
        gender: formData.gender,
        caregiverName: formData.caregiverName.trim() || user?.user_metadata?.full_name || user?.user_metadata?.name || "Caregiver",
        relationship: formData.relationship,
        contactPhone: formData.contactPhone.trim() || "",
        communicationStyle: formData.communicationLevel,
        sensoryTriggers: allSensoryTriggers,
      },

      brushingHabits: {
        frequency: formData.q1_brushFrequency,
        duration: formData.q2_brushDuration,
        toothbrushType: formData.q3_toothbrushType === "Other" ? formData.q3_toothbrushOther : formData.q3_toothbrushType,
        toothpaste: formData.q4_toothpaste,
        surfacesCovered: formData.q5_surfacesCovered,
        assistanceNeeded: formData.q6_assistance,
        toleranceLevel: formData.q9_brushingChanges,
        difficulties: formData.q7_brushingDifficulties,
        helpStrategy: formData.q8_helpStrategy,
      },

      dietaryHabits: {
        sugaryFoodFrequency: formData.q11_sugarySnacks,
        healthyFoodFrequency: formData.q12_mealFrequency,
        foodHoldingInMouth: formData.q13_foodHolding,
        snackingFrequency: formData.q12_mealFrequency,
        nightFeedingOrBottle: formData.q14_nightFeeding,
        waterIntake: "Not specified",
        sugaryDrinks: formData.q10_sugaryDrinks,
      },

      dentalMedicalHistory: {
        lastDentalVisit: formData.q15_neverVisited ? "Never" : formData.q15_lastDentalVisit,
        pastDentalExperience: formData.q16_dentalProblems.join(", "),
        activeCavitiesOrPain: formData.q16_dentalProblems.includes("Toothache or pain") ? "Yes" : "No",
        gumBleeding: formData.q16_dentalProblems.includes("Bleeding gums") ? "Yes" : "No",
        regularMedications: formData.q17_medicalConditions.join(", "),
        medicalDiagnoses: [formData.asdLevel, ...formData.q17_medicalConditions],
        neverVisitedDentist: formData.q15_neverVisited,
        dentalProblems: formData.q16_dentalProblems,
        dentalOther: formData.q16_dentalOther,
        medicalConditions: formData.q17_medicalConditions,
        medicalOther: formData.q17_medicalOther,
      },

      childBehaviour: {
        mouthOpeningCooperation: formData.q18_oralHygieneAttitude,
        sensoryAversionTriggers: allSensoryTriggers,
        routineReaction: formData.q18_oralHygieneAttitude,
        effectiveMotivators: [],
        meltdownTriggers: formData.q20_sensoryTriggers.join(", "),
        motorSkills: formData.q19_motorSkills,
        oralHygieneAttitude: formData.q18_oralHygieneAttitude,
      },

      rawQuestionnaire: {
        ...formData,
        allSensoryTriggers,
      },

      weeklyAssessments: [
        {
          week: 1,
          date: "Baseline — Week 1",
          oralHygieneScore: 75,
          dietaryRiskScore: 40,
          sensoryComfortScore: 70,
          routineStreakDays: 1,
          statusSummary: `Baseline recorded for ${formData.childName || "child"}. AI routine calibration complete across all 4 clinical domains.`,
          motivationBadge: {
            title: "Journey Champion",
            icon: "🌱",
            description: "Completed the Child Oral Health Assessment Questionnaire!",
          },
          aiRecommendations: [
            "Use non-foaming toothpaste to address texture sensitivity.",
            "Introduce a visual step-by-step brushing video before the evening routine.",
            "Schedule post-meal water swirling to reduce food pooling risk.",
          ],
        },
      ],
    };

    const currentUserId = user?.id || (typeof window !== "undefined" ? localStorage.getItem("asd_current_user_id") || "user-" + Date.now() : "user-default");
    const currentUserEmail = user?.email || (typeof window !== "undefined" ? localStorage.getItem("asd_current_user_email") || "" : "");

    if (typeof window !== "undefined") {
      localStorage.setItem("asd_current_user_id", currentUserId);
      localStorage.setItem("asd_active_child_id", newAccount.id);
      localStorage.setItem("asd_onboarding_completed", "true");
      localStorage.setItem("asd_profile_" + currentUserId, JSON.stringify(newAccount));
      localStorage.setItem("asd_current_user_profile", JSON.stringify(newAccount));
    }

    // Save profile to server DB (data/profiles.json & Supabase) and localStorage
    await saveUserProfile(currentUserId, currentUserEmail, newAccount);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/");
    }, 400);
  };

  const goNext = () => setCurrentStep((s) => Math.min(steps.length, s + 1));
  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1));

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-20 px-4 sm:px-0 pt-6">
      {/* ── Top Header Card ── */}
      <div
        className="rounded-3xl p-5 sm:p-7 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(15,118,110,0.3) 0%, rgba(8,20,40,0.95) 60%, rgba(30,27,75,0.4) 100%)",
          border: "1px solid rgba(20,184,166,0.35)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(20,184,166,0.1)",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-2xl p-1.5 flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(15,25,50,0.9)", border: "1px solid rgba(20,184,166,0.4)", boxShadow: "0 0 20px rgba(20,184,166,0.2)" }}
            >
              <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span
                className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", color: "#2dd4bf" }}
              >
                Child Oral Health Assessment
              </span>
              <h1 className="text-lg sm:text-xl font-black text-white mt-1 tracking-tight">
                Child Oral Health Assessment Questionnaire
              </h1>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-xs font-mono text-teal-300 font-bold block">
              Step {currentStep}/{steps.length}
            </span>
            <div className="w-24 h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(currentStep / steps.length) * 100}%`,
                  background: "linear-gradient(90deg, #14b8a6, #06b6d4)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Step Tabs ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {steps.map((s) => {
          const Icon = s.icon;
          const isCurrent = currentStep === s.id;
          const isDone = currentStep > s.id;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id)}
              className="px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
              style={
                isCurrent
                  ? { background: "linear-gradient(135deg, #14b8a6, #06b6d4)", color: "#0f172a" }
                  : isDone
                  ? { background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.35)", color: "#2dd4bf" }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b" }
              }
            >
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              {s.title}
            </button>
          );
        })}
      </div>

      {/* ── Form Card ── */}
      <div
        className="rounded-3xl p-6 sm:p-8"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
          backdropFilter: "blur(24px)",
        }}
      >

        {/* ── STEP 1: WELCOME ── */}
        {currentStep === 1 && (
          <div className="space-y-7 text-center max-w-lg mx-auto py-4">
            <div
              className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.25), rgba(6,182,212,0.15))", border: "1px solid rgba(20,184,166,0.4)", boxShadow: "0 0 40px rgba(20,184,166,0.2)" }}
            >
              <Sparkles className="w-9 h-9 text-teal-300" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                "Small steps, consistent routines, healthier smiles."
              </h2>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                This questionnaire covers <strong className="text-white">4 clinical domains</strong> to calibrate your child's personalised oral care routine. Your answers feed directly into <strong className="text-teal-300">Argus</strong>, your AI oral health guide.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left text-xs">
              {[
                { icon: "🪥", title: "Brushing Habits", desc: "9 targeted questions" },
                { icon: "🍎", title: "Dietary Habits", desc: "5 key questions" },
                { icon: "🦷", title: "Medical & Dental", desc: "3 history questions" },
                { icon: "🧠", title: "Behaviour & Sensory", desc: "3 sensory questions" },
              ].map((card) => (
                <div
                  key={card.title}
                  className="p-3.5 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="text-lg mb-1">{card.icon}</div>
                  <div className="font-bold text-white">{card.title}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">{card.desc}</div>
                </div>
              ))}
            </div>

            <button
              onClick={goNext}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-slate-950 transition-all hover:scale-105 shadow-lg"
              style={{ background: "linear-gradient(135deg, #14b8a6, #06b6d4)", boxShadow: "0 8px 30px rgba(20,184,166,0.4)" }}
            >
              Begin Assessment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP 2: DEMOGRAPHICS ── */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <SectionHeader domain={0} total={4} title="Demographic Details" subtitle="Basic information about the child and caregiver" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StyledInput label="Child's Full Name *" value={formData.childName} onChange={(v) => set("childName", v)} placeholder="e.g. Arjun Sharma" />
              <StyledInput label="Child's Age *" value={formData.childAge} onChange={(v) => set("childAge", v)} type="number" placeholder="6" />
              <StyledInput label="Date of Birth" value={formData.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} type="date" />
              <StyledSelect
                label="Gender"
                value={formData.gender}
                onChange={(v) => set("gender", v)}
                options={["Male", "Female", "Other / Prefer not to say"]}
              />
              <StyledInput label="Primary Caregiver Name *" value={formData.caregiverName} onChange={(v) => set("caregiverName", v)} placeholder="e.g. Priya Sharma" />
              <StyledSelect
                label="Relationship to Child"
                value={formData.relationship}
                onChange={(v) => set("relationship", v)}
                options={["Mother", "Father", "Guardian", "Therapist / Care Worker", "Other"]}
              />
              <StyledInput label="Contact Phone Number" value={formData.contactPhone} onChange={(v) => set("contactPhone", v)} type="tel" placeholder="e.g. 9876543210" />
              <StyledSelect
                label="ASD Support Level"
                value={formData.asdLevel}
                onChange={(v) => set("asdLevel", v)}
                options={["Level 1 (Mild support needed)", "Level 2 (Substantial support needed)", "Level 3 (Very substantial support needed)"]}
              />
              <div className="sm:col-span-2">
                <StyledSelect
                  label="Child's Communication Style"
                  value={formData.communicationLevel}
                  onChange={(v) => set("communicationLevel", v)}
                  options={[
                    "Verbal with Visual Cues",
                    "Fluent Verbal",
                    "Non-verbal (Uses PECS & Picture Cards)",
                    "Non-verbal (Gestures & Vocalizations)",
                    "Augmentative & Alternative Communication (AAC)",
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: BRUSHING HABITS (Q1–Q9) ── */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <SectionHeader domain={1} total={4} title="Brushing Habits" subtitle="Questions 1–9 about your child's daily brushing routine" />

            <RadioGroup
              qNum="1" label="How often does your child brush their teeth each day (with or without parent assistance)?"
              name="q1" value={formData.q1_brushFrequency}
              onChange={(v) => set("q1_brushFrequency", v)}
              options={["Never", "Once daily", "Twice daily"]}
            />

            <RadioGroup
              qNum="2" label="How long does your child typically brush their teeth?"
              name="q2" value={formData.q2_brushDuration}
              onChange={(v) => set("q2_brushDuration", v)}
              options={["Less than 1 minute", "1–2 minutes", "3 minutes"]}
            />

            <RadioGroup
              qNum="3" label="What type of toothbrush does your child use?"
              name="q3" value={formData.q3_toothbrushType}
              onChange={(v) => set("q3_toothbrushType", v)}
              options={["Manual toothbrush", "Electric toothbrush"]}
              other
              otherValue={formData.q3_toothbrushOther}
              onOtherChange={(v) => set("q3_toothbrushOther", v)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                <span className="text-teal-400 mr-1">4.</span>
                Which toothpaste does your child use for toothbrushing?
              </label>
              <input
                type="text"
                placeholder="Please specify toothpaste brand/type used"
                value={formData.q4_toothpaste}
                onChange={(e) => set("q4_toothpaste", e.target.value)}
                className="w-full liquid-glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <RadioGroup
              qNum="5" label="Does your child brush all surfaces of their teeth (front, back, and chewing surfaces)?"
              name="q5" value={formData.q5_surfacesCovered}
              onChange={(v) => set("q5_surfacesCovered", v)}
              options={["Yes, all surfaces", "Only front teeth", "Partially — needs assistance for back teeth"]}
            />

            <RadioGroup
              qNum="6" label="Does your child need assistance with brushing?"
              name="q6" value={formData.q6_assistance}
              onChange={(v) => set("q6_assistance", v)}
              options={["No, brushes independently", "Yes, with full assistance", "Yes, with partial assistance (hand-over-hand)"]}
            />

            <CheckboxGroup
              qNum="7" label="Does your child show any of the following difficulties during brushing?"
              values={formData.q7_brushingDifficulties}
              onChange={(v) => set("q7_brushingDifficulties", v)}
              options={[
                "Gagging or choking",
                "Biting the toothbrush",
                "Crying or screaming",
                "Running away or refusing",
                "Physical resistance",
                "No difficulties",
              ]}
            />

            <RadioGroup
              qNum="8" label="What helps your child cooperate with brushing?"
              name="q8" value={formData.q8_helpStrategy}
              onChange={(v) => set("q8_helpStrategy", v)}
              options={[
                "Visual schedules or social stories",
                "Music or songs (e.g., brushing timer songs)",
                "Reward systems (stickers, praise, tokens)",
                "Distraction (tablet/TV while brushing)",
                "Nothing works consistently",
              ]}
            />

            <RadioGroup
              qNum="9" label="Has there been any recent change in your child's brushing behaviour or routine?"
              name="q9" value={formData.q9_brushingChanges}
              onChange={(v) => set("q9_brushingChanges", v)}
              options={["Yes, improved recently", "Yes, worsened recently", "No change", "Not sure"]}
            />
          </div>
        )}

        {/* ── STEP 4: DIETARY HABITS (Q10–Q14) ── */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <SectionHeader domain={2} total={4} title="Dietary Habits" subtitle="Questions 10–14 about nutrition and dietary patterns" />

            <RadioGroup
              qNum="10" label="How often does your child consume sugary drinks (e.g., juices, sodas, flavoured milk)?"
              name="q10" value={formData.q10_sugaryDrinks}
              onChange={(v) => set("q10_sugaryDrinks", v)}
              options={["Never", "Once a week", "2–3 times a week", "Once daily", "More than once daily"]}
            />

            <RadioGroup
              qNum="11" label="How often does your child eat sugary or sticky snacks (e.g., chocolates, biscuits, toffees)?"
              name="q11" value={formData.q11_sugarySnacks}
              onChange={(v) => set("q11_sugarySnacks", v)}
              options={["Never", "Once a week", "2–3 times a week", "Once daily", "More than once daily"]}
            />

            <RadioGroup
              qNum="12" label="How many main meals does your child typically have per day?"
              name="q12" value={formData.q12_mealFrequency}
              onChange={(v) => set("q12_mealFrequency", v)}
              options={["1 meal", "2 meals", "3 meals", "More than 3 meals"]}
            />

            <RadioGroup
              qNum="13" label="Does your child hold or 'pocket' food in their mouth for extended periods?"
              name="q13" value={formData.q13_foodHolding}
              onChange={(v) => set("q13_foodHolding", v)}
              options={["Never", "Sometimes", "Frequently", "Always"]}
            />

            <RadioGroup
              qNum="14" label="Does your child take a bottle or sippy cup to bed (with anything other than plain water)?"
              name="q14" value={formData.q14_nightFeeding}
              onChange={(v) => set("q14_nightFeeding", v)}
              options={["No", "Yes, with milk", "Yes, with juice or sweet drink", "Not applicable"]}
            />
          </div>
        )}

        {/* ── STEP 5: MEDICAL & DENTAL HISTORY (Q15–Q17) ── */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <SectionHeader domain={3} total={4} title="Medical & Dental History" subtitle="Questions 15–17 about past dental and medical background" />

            {/* Q15 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                <span className="text-teal-400 mr-1">15.</span>
                When was your child's last dental visit?
              </label>
              <div className="space-y-1.5">
                {["Less than 6 months ago", "6–12 months ago", "More than 1 year ago"].map((opt) => {
                  const selected = !formData.q15_neverVisited && formData.q15_lastDentalVisit === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { set("q15_lastDentalVisit", opt); set("q15_neverVisited", false); }}
                      className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all"
                      style={{
                        background: selected ? "rgba(20,184,166,0.18)" : "rgba(255,255,255,0.04)",
                        border: selected ? "1px solid rgba(20,184,166,0.5)" : "1px solid rgba(255,255,255,0.1)",
                        color: selected ? "#f0fdfa" : "#94a3b8",
                      }}
                    >
                      <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: selected ? "#14b8a6" : "rgba(255,255,255,0.2)", background: selected ? "#14b8a6" : "transparent" }}>
                        {selected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => { set("q15_neverVisited", true); set("q15_lastDentalVisit", ""); }}
                  className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all"
                  style={{
                    background: formData.q15_neverVisited ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                    border: formData.q15_neverVisited ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.1)",
                    color: formData.q15_neverVisited ? "#fca5a5" : "#94a3b8",
                  }}
                >
                  <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: formData.q15_neverVisited ? "#ef4444" : "rgba(255,255,255,0.2)", background: formData.q15_neverVisited ? "#ef4444" : "transparent" }}>
                    {formData.q15_neverVisited && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  My child has never visited the dentist
                </button>
              </div>
            </div>

            <CheckboxGroup
              qNum="16" label="Has your child been diagnosed with or experienced any of the following dental problems?"
              values={formData.q16_dentalProblems}
              onChange={(v) => set("q16_dentalProblems", v)}
              options={[
                "Tooth decay / cavities",
                "Toothache or pain",
                "Bleeding gums",
                "Broken or missing teeth",
                "Delayed tooth eruption",
                "None of the above",
              ]}
              other
              otherValue={formData.q16_dentalOther}
              onOtherChange={(v) => set("q16_dentalOther", v)}
            />

            <CheckboxGroup
              qNum="17" label="Does your child have any of the following medical conditions or take any regular medications?"
              values={formData.q17_medicalConditions}
              onChange={(v) => set("q17_medicalConditions", v)}
              options={[
                "Epilepsy / seizure disorder",
                "ADHD",
                "Intellectual disability",
                "Down syndrome",
                "Cerebral palsy",
                "Regular sweetened medications / syrups",
                "None of the above",
              ]}
              other
              otherValue={formData.q17_medicalOther}
              onOtherChange={(v) => set("q17_medicalOther", v)}
            />
          </div>
        )}

        {/* ── STEP 6: BEHAVIOURAL & SENSORY-MOTOR (Q18–Q20) ── */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <SectionHeader domain={4} total={4} title="Behavioral & Sensory-Motor Skills" subtitle="Questions 18–20 about cooperation, motor skills, and sensory responses" />

            <RadioGroup
              qNum="18" label="How does your child generally behave when it comes to oral hygiene practices?"
              name="q18" value={formData.q18_oralHygieneAttitude}
              onChange={(v) => set("q18_oralHygieneAttitude", v)}
              options={[
                "Cooperative — allows brushing without resistance",
                "Mildly resistant — needs coaxing but complies",
                "Moderately resistant — frequent protests or avoidance",
                "Severely resistant — extreme distress, meltdowns, or refusal",
              ]}
            />

            <RadioGroup
              qNum="19" label="How would you describe your child's hand motor skills?"
              name="q19" value={formData.q19_motorSkills}
              onChange={(v) => set("q19_motorSkills", v)}
              options={[
                "Good — can brush independently with proper technique",
                "Moderate — brushes but with limited effectiveness",
                "Poor — requires full caregiver assistance for brushing",
                "Very limited — significant difficulty with all fine motor tasks",
              ]}
            />

            <CheckboxGroup
              qNum="20" label="Does your child have any known sensory sensitivities related to oral care?"
              values={formData.q20_sensoryTriggers}
              onChange={(v) => set("q20_sensoryTriggers", v)}
              options={[
                "Sensitive to toothpaste taste or flavour",
                "Sensitive to toothpaste foaming",
                "Sensitive to toothbrush texture or pressure",
                "Sensitive to vibration (electric toothbrush)",
                "Gag reflex triggered easily",
                "Sensitive to mint or strong flavours",
                "No known sensory sensitivities",
              ]}
              other
              otherValue={formData.q20_sensoryOther}
              onOtherChange={(v) => set("q20_sensoryOther", v)}
            />
          </div>
        )}

        {/* ── STEP 7: REVIEW & SAVE ── */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-white/10">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">Review & Calibrate</span>
              <h2 className="text-xl font-black text-white mt-1">
                Profile Ready for {formData.childName || "your child"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                All 4 clinical domains will be stored and used to personalise Argus AI responses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                {
                  icon: "👶", label: "Demographics",
                  lines: [
                    `${formData.childName || "—"}, Age ${formData.childAge}`,
                    `${formData.asdLevel}`,
                    `Caregiver: ${formData.caregiverName || "—"}`,
                  ]
                },
                {
                  icon: "🪥", label: "Brushing Habits",
                  lines: [
                    `Frequency: ${formData.q1_brushFrequency || "—"}`,
                    `Duration: ${formData.q2_brushDuration || "—"}`,
                    `Toothbrush: ${formData.q3_toothbrushType || "—"}`,
                  ]
                },
                {
                  icon: "🍎", label: "Dietary Habits",
                  lines: [
                    `Sugary drinks: ${formData.q10_sugaryDrinks || "—"}`,
                    `Sugary snacks: ${formData.q11_sugarySnacks || "—"}`,
                    `Food pocketing: ${formData.q13_foodHolding || "—"}`,
                  ]
                },
                {
                  icon: "🦷", label: "Medical & Dental",
                  lines: [
                    `Last dental visit: ${formData.q15_neverVisited ? "Never" : (formData.q15_lastDentalVisit || "—")}`,
                    `Dental issues: ${formData.q16_dentalProblems.length > 0 ? formData.q16_dentalProblems[0] + (formData.q16_dentalProblems.length > 1 ? " +" + (formData.q16_dentalProblems.length - 1) + " more" : "") : "None"}`,
                  ]
                },
                {
                  icon: "🧠", label: "Behaviour & Sensory",
                  lines: [
                    `Attitude: ${formData.q18_oralHygieneAttitude ? formData.q18_oralHygieneAttitude.split("—")[0].trim() : "—"}`,
                    `Motor skills: ${formData.q19_motorSkills ? formData.q19_motorSkills.split("—")[0].trim() : "—"}`,
                    `Sensory triggers: ${formData.q20_sensoryTriggers.length} selected`,
                  ]
                },
                {
                  icon: "🤖", label: "Argus AI Calibration",
                  lines: [
                    "✅ Oral hygiene baseline ready",
                    "✅ Sensory profile mapped",
                    "✅ Weekly AI tracking active",
                  ]
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="p-4 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{card.icon}</span>
                    <span className="font-bold text-teal-300">{card.label}</span>
                  </div>
                  {card.lines.map((line, i) => (
                    <p key={i} className="text-slate-300 text-[11px] leading-relaxed truncate">{line}</p>
                  ))}
                </div>
              ))}
            </div>

            <div
              className="p-5 rounded-2xl text-center"
              style={{
                background: "linear-gradient(135deg, rgba(15,118,110,0.3), rgba(30,27,75,0.4))",
                border: "1px solid rgba(20,184,166,0.35)",
              }}
            >
              <Sparkles className="w-6 h-6 text-teal-300 mx-auto mb-2" />
              <div className="font-black text-base text-white">Argus AI — Personalised Routine Ready</div>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Saving your answers will generate your first weekly AI oral health score and unlock personalised desensitization strategies.
              </p>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={goPrev}
              className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all hover:text-white"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", color: "#94a3b8" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
          ) : <div />}

          {currentStep < steps.length ? (
            <button
              onClick={goNext}
              className="px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
              style={{ background: "linear-gradient(135deg, #14b8a6, #06b6d4)", color: "#0f172a", boxShadow: "0 6px 20px rgba(20,184,166,0.35)" }}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", color: "#0f172a", boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  Saving Profile…
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  Save Profile & Go to Dashboard →
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
