"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@/context/AuthContext";
import {
  ShieldCheck,
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
  Apple,
  FileText,
  Activity,
  User,
  Sparkle
} from "lucide-react";
import { saveUserProfile, hasUserCompletedOnboarding, ChildAccount } from "@/lib/userStore";

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
    <div className="pb-3 border-b border-[#D5E8DA]/60 mb-4 sm:mb-5">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5 bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] shadow-2xs">
        Domain {domain} of {total}
      </span>
      <h2 className="text-lg sm:text-xl font-black text-[#051F20] tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-[#0B2B26]/70 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function RadioGroup({
  label,
  qNum,
  options,
  value,
  onChange,
  other,
  otherValue,
  onOtherChange,
}: {
  label: string;
  qNum?: string;
  name?: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  other?: boolean;
  otherValue?: string;
  onOtherChange?: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-[#051F20] leading-relaxed">
        {qNum && <span className="text-[#235347] font-bold mr-1">{qNum}.</span>}
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
              className={`w-full text-left flex items-center gap-3 p-3 rounded-xl text-xs transition-all ${
                selected
                  ? "bg-[#DAF1DE] border border-[#8EB69B] text-[#051F20] font-bold shadow-2xs"
                  : "bg-[#F4FAF6] border border-[#D5E8DA] text-[#0B2B26] hover:border-[#8EB69B] hover:text-[#051F20]"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selected ? "border-[#235347] bg-[#235347]" : "border-[#8EB69B]/60 bg-white"
                }`}
              >
                {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className="leading-snug">{opt}</span>
            </button>
          );
        })}
        {other && (
          <div className="flex items-center gap-2 mt-1.5">
            <button
              type="button"
              onClick={() => onChange("Other")}
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                value === "Other" ? "border-[#235347] bg-[#235347]" : "border-[#8EB69B]/60 bg-white"
              }`}
            >
              {value === "Other" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
            <input
              type="text"
              placeholder="Other (please specify)"
              value={otherValue || ""}
              onChange={(e) => { onChange("Other"); onOtherChange?.(e.target.value); }}
              className="flex-1 bg-white border border-[#D5E8DA] rounded-xl px-3 py-2.5 text-xs text-[#051F20] placeholder-[#0B2B26]/40 focus:outline-none focus:border-[#8EB69B] transition-all"
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
      <label className="block text-xs font-bold text-[#051F20] leading-relaxed">
        {qNum && <span className="text-[#235347] font-bold mr-1">{qNum}.</span>}
        {label}
        <span className="ml-1.5 text-[10px] font-normal text-[#0B2B26]/60">(Select all that apply)</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const checked = values.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`text-left flex items-center gap-2.5 p-3 rounded-xl text-xs transition-all ${
                checked
                  ? "bg-[#DAF1DE] border border-[#8EB69B] text-[#051F20] font-bold shadow-2xs"
                  : "bg-[#F4FAF6] border border-[#D5E8DA] text-[#0B2B26] hover:border-[#8EB69B] hover:text-[#051F20]"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  checked ? "border-[#235347] bg-[#235347]" : "border-[#8EB69B]/60 bg-white"
                }`}
              >
                {checked && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
              </span>
              <span className="leading-snug">{opt}</span>
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
          className="w-full bg-white border border-[#D5E8DA] rounded-xl px-3.5 py-2.5 text-xs text-[#051F20] placeholder-[#0B2B26]/40 mt-1 focus:outline-none focus:border-[#8EB69B] transition-all"
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
      <label className="block text-xs font-bold text-[#051F20]">
        {qNum && <span className="text-[#235347] font-bold mr-1">{qNum}.</span>}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-[#D5E8DA] rounded-xl px-3.5 py-2.5 text-xs text-[#051F20] placeholder-[#0B2B26]/40 focus:outline-none focus:border-[#8EB69B] transition-all"
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
      <label className="block text-xs font-bold text-[#051F20]">
        {qNum && <span className="text-[#235347] font-bold mr-1">{qNum}.</span>}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-[#D5E8DA] rounded-xl px-3.5 py-2.5 text-xs text-[#051F20] focus:outline-none focus:border-[#8EB69B] transition-all"
      >
        <option value="">— Select Option —</option>
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

  // Ensure unauthenticated users are redirected to landing, and 20 questionnaires asked ONLY ONCE
  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isSignedIn) {
      // Must first register or sign in before onboarding
      router.replace("/landing");
      return;
    }

    if (typeof window !== "undefined") {
      const isCompleted =
        hasUserCompletedOnboarding(user?.id) ||
        localStorage.getItem("asd_onboarding_completed") === "true" ||
        (user?.id && localStorage.getItem(`asd_onboarding_completed_${user.id}`) === "true") ||
        (user?.id && localStorage.getItem(`asd_onboarded_${user.id}`) === "true") ||
        (user?.id && !!localStorage.getItem(`asd_profile_${user.id}`)) ||
        !!localStorage.getItem("asd_current_user_profile");

      if (isCompleted) {
        // User has already completed intake. Redirect directly to dashboard.
        router.replace("/");
      }
    }
  }, [isAuthLoaded, isSignedIn, user?.id, router]);

  const set = (field: keyof FormData, value: string | string[] | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const steps = [
    { id: 1, title: "Welcome", icon: ShieldCheck },
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
      if (currentUserId) {
        localStorage.setItem(`asd_onboarding_completed_${currentUserId}`, "true");
        localStorage.setItem(`asd_onboarded_${currentUserId}`, "true");
        localStorage.setItem(`asd_profile_${currentUserId}`, JSON.stringify(newAccount));
      }
      localStorage.setItem("asd_current_user_profile", JSON.stringify(newAccount));
    }

    // Save profile to server DB (data/profiles.json & Supabase) and localStorage
    await saveUserProfile(currentUserId, currentUserEmail, newAccount);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/");
    }, 400);
  };

  const goNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep((s) => Math.min(steps.length, s + 1));
  };

  const goPrev = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 pb-24 px-3 sm:px-4 pt-4 sm:pt-6">
      {/* ── Top Header Card (Mobile-First Responsive) ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#D5E8DA] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#DAF1DE] border border-[#8EB69B]/40 p-1.5 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] inline-block mb-0.5 shadow-2xs">
                Clinical Baseline Intake
              </span>
              <h1 className="text-base sm:text-lg font-black text-[#051F20] tracking-tight leading-snug">
                Child Oral Health Questionnaire
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D5E8DA]/60">
            <span className="text-xs font-mono text-[#235347] font-bold">
              Step {currentStep} of {steps.length}
            </span>
            <div className="w-24 sm:w-28 h-2 rounded-full overflow-hidden bg-[#F4FAF6] border border-[#D5E8DA]">
              <div
                className="h-full rounded-full transition-all duration-300 bg-[#235347]"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Step Tabs (Mobile-Friendly Horizontal Scroller) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {steps.map((s) => {
          const Icon = s.icon;
          const isCurrent = currentStep === s.id;
          const isDone = currentStep > s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentStep(s.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                isCurrent
                  ? "bg-[#235347] text-white font-bold shadow-xs"
                  : isDone
                  ? "bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] font-bold"
                  : "bg-white text-[#0B2B26]/60 border border-[#D5E8DA] hover:text-[#051F20] hover:border-[#8EB69B]"
              }`}
            >
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-[#235347]" /> : <Icon className="w-3.5 h-3.5" />}
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* ── Main Form Content Card ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#D5E8DA] shadow-xs space-y-6">

        {/* ── STEP 1: WELCOME ── */}
        {currentStep === 1 && (
          <div className="space-y-6 text-center max-w-lg mx-auto py-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#DAF1DE] border border-[#8EB69B] flex items-center justify-center text-[#235347] shadow-2xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#051F20] tracking-tight">
                “Small steps, consistent routines, healthier smiles.”
              </h2>
              <p className="text-xs sm:text-sm text-[#0B2B26]/80 mt-2.5 leading-relaxed">
                This questionnaire covers <strong className="text-[#051F20]">4 clinical domains</strong> to calibrate your child&apos;s personalized oral care routine. Your answers feed directly into <strong className="text-[#235347] font-bold">Argus</strong>, your clinical AI guide.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs">
              {[
                { title: "1. Brushing Habits", desc: "9 targeted frequency & duration questions" },
                { title: "2. Dietary Habits", desc: "5 key nutrition & snacking questions" },
                { title: "3. Medical & Dental", desc: "3 dental history & comfort questions" },
                { title: "4. Behaviour & Sensory", desc: "3 sensory trigger & motivator questions" },
              ].map((card) => (
                <div
                  key={card.title}
                  className="p-3.5 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] hover:border-[#8EB69B] transition-all"
                >
                  <div className="font-bold text-[#051F20]">{card.title}</div>
                  <div className="text-[#0B2B26]/70 text-[11px] mt-0.5">{card.desc}</div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#235347] hover:bg-[#163832] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all hover:scale-105"
            >
              <span>Begin Assessment</span>
              <ArrowRight className="w-4 h-4" />
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

            <StyledInput
              qNum="4"
              label="Which toothpaste does your child use for toothbrushing?"
              placeholder="e.g. Mild fruit, non-foaming, or fluoridated paste"
              value={formData.q4_toothpaste}
              onChange={(v) => set("q4_toothpaste", v)}
            />

            <RadioGroup
              qNum="5" label="Does your child brush all surfaces of their teeth (front, back, and chewing surfaces)?"
              name="q5" value={formData.q5_surfacesCovered}
              onChange={(v) => set("q5_surfacesCovered", v)}
              options={["Yes, all surfaces", "Front teeth only", "Chewing surfaces only", "No / Unsure"]}
            />

            <RadioGroup
              qNum="6" label="Does your child require assistance while brushing?"
              name="q6" value={formData.q6_assistance}
              onChange={(v) => set("q6_assistance", v)}
              options={[
                "Fully independent (brushes on own without help)",
                "Partially independent (brushes with verbal reminders / guidance)",
                "Completely dependent (parent/caregiver brushes for them)",
              ]}
            />

            <CheckboxGroup
              qNum="7" label="Do you face any difficulties while brushing your child's teeth?"
              options={[
                "Refuses to open mouth",
                "Sensory issues (dislikes paste taste, texture, or vibration)",
                "Lack of cooperation / crying / resistance",
                "Difficulty in reaching back teeth",
                "None — child cooperates well",
              ]}
              values={formData.q7_brushingDifficulties}
              onChange={(vals) => set("q7_brushingDifficulties", vals)}
            />

            <RadioGroup
              qNum="8" label="Have you tried any strategies or aids to help your child brush?"
              name="q8" value={formData.q8_helpStrategy}
              onChange={(v) => set("q8_helpStrategy", v)}
              options={[
                "Yes, visual timers / charts / songs",
                "Yes, sensory-friendly brushes / unflavored paste",
                "Yes, positive reinforcement / rewards",
                "No, haven't tried any specific aids yet",
              ]}
            />

            <RadioGroup
              qNum="9" label="How does your child react to changes in their toothbrushing routine?"
              name="q9" value={formData.q9_brushingChanges}
              onChange={(v) => set("q9_brushingChanges", v)}
              options={[
                "Adapts easily with minimal explanation",
                "Needs time and visual preparation",
                "Strongly resists / experiences meltdowns with routine change",
              ]}
            />
          </div>
        )}

        {/* ── STEP 4: DIETARY HABITS (Q10–Q14) ── */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <SectionHeader domain={2} total={4} title="Dietary Habits" subtitle="Questions 10–14 on sugar intake and eating habits" />

            <RadioGroup
              qNum="10" label="How often does your child consume sugary drinks (juices, sodas, flavoured milk)?"
              name="q10" value={formData.q10_sugaryDrinks}
              onChange={(v) => set("q10_sugaryDrinks", v)}
              options={["Rarely / Never", "1–2 times a week", "Daily", "Multiple times a day"]}
            />

            <RadioGroup
              qNum="11" label="How often does your child consume sweet or sticky snacks (chocolates, candies, biscuits)?"
              name="q11" value={formData.q11_sugarySnacks}
              onChange={(v) => set("q11_sugarySnacks", v)}
              options={["Rarely / Never", "1–2 times a week", "Daily", "Multiple times a day"]}
            />

            <RadioGroup
              qNum="12" label="How often does your child eat meals and snacks throughout the day?"
              name="q12" value={formData.q12_mealFrequency}
              onChange={(v) => set("q12_mealFrequency", v)}
              options={[
                "3 structured meals, minimal snacking",
                "3 meals + 2 structured healthy snacks",
                "Frequent grazing / snacking throughout the day",
              ]}
            />

            <RadioGroup
              qNum="13" label="Does your child keep food or sweet liquids in their mouth for a long time (pouching/holding)?"
              name="q13" value={formData.q13_foodHolding}
              onChange={(v) => set("q13_foodHolding", v)}
              options={["Never", "Occasionally", "Frequently (holds food in cheeks)"]}
            />

            <RadioGroup
              qNum="14" label="Does your child drink milk or sugary liquids from a bottle/sippy cup at bedtime or through the night?"
              name="q14" value={formData.q14_nightFeeding}
              onChange={(v) => set("q14_nightFeeding", v)}
              options={["No, plain water only or none", "Yes, bottle/sippy cup in bed", "Yes, breastfeeding to sleep"]}
            />
          </div>
        )}

        {/* ── STEP 5: MEDICAL & DENTAL HISTORY (Q15–Q17) ── */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <SectionHeader domain={3} total={4} title="Medical & Dental History" subtitle="Questions 15–17 on past dental visits and health factors" />

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#051F20]">
                <span className="text-[#235347] font-bold mr-1">15.</span>
                When was your child&apos;s last dental visit?
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => set("q15_neverVisited", !formData.q15_neverVisited)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-xl text-xs transition-all ${
                    formData.q15_neverVisited
                      ? "bg-[#DAF1DE] border border-[#8EB69B] text-[#051F20] font-bold shadow-2xs"
                      : "bg-[#F4FAF6] border border-[#D5E8DA] text-[#0B2B26] hover:border-[#8EB69B] hover:text-[#051F20]"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-md border-2 flex-shrink-0 flex items-center justify-center ${
                      formData.q15_neverVisited ? "border-[#235347] bg-[#235347]" : "border-[#8EB69B]/60 bg-white"
                    }`}
                  >
                    {formData.q15_neverVisited && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </span>
                  <span>Never visited a dentist</span>
                </button>

                {!formData.q15_neverVisited && (
                  <StyledSelect
                    label="Last Dental Visit Timing"
                    value={formData.q15_lastDentalVisit}
                    onChange={(v) => set("q15_lastDentalVisit", v)}
                    options={["Within the last 6 months", "6–12 months ago", "More than 1 year ago"]}
                  />
                )}
              </div>
            </div>

            <CheckboxGroup
              qNum="16" label="Has your child had any of the following dental problems?"
              options={[
                "Toothache or pain",
                "Cavities / Tooth decay",
                "Bleeding gums",
                "Dental trauma / Broken tooth",
                "None known",
              ]}
              values={formData.q16_dentalProblems}
              onChange={(vals) => set("q16_dentalProblems", vals)}
              other
              otherValue={formData.q16_dentalOther}
              onOtherChange={(v) => set("q16_dentalOther", v)}
            />

            <CheckboxGroup
              qNum="17" label="Does your child have any other medical conditions or regular medications?"
              options={[
                "Seizure disorder / Epilepsy",
                "Gastroesophageal reflux (GERD)",
                "Heart condition",
                "Sensory Processing Disorder (SPD)",
                "Sweetened syrup medications taken daily",
                "None",
              ]}
              values={formData.q17_medicalConditions}
              onChange={(vals) => set("q17_medicalConditions", vals)}
              other
              otherValue={formData.q17_medicalOther}
              onOtherChange={(v) => set("q17_medicalOther", v)}
            />
          </div>
        )}

        {/* ── STEP 6: BEHAVIOUR & SENSORY (Q18–Q20) ── */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <SectionHeader domain={4} total={4} title="Behaviour & Sensory Skills" subtitle="Questions 18–20 on sensory triggers and cooperation" />

            <RadioGroup
              qNum="18" label="How would you describe your child's general attitude towards oral hygiene?"
              name="q18" value={formData.q18_oralHygieneAttitude}
              onChange={(v) => set("q18_oralHygieneAttitude", v)}
              options={[
                "Cooperative and calm",
                "Mild resistance / needs distraction",
                "Strong refusal / crying / extreme distress",
              ]}
            />

            <RadioGroup
              qNum="19" label="How are your child's fine motor skills for holding and moving a toothbrush?"
              name="q19" value={formData.q19_motorSkills}
              onChange={(v) => set("q19_motorSkills", v)}
              options={[
                "Good — can grip and brush independently",
                "Developing — needs hand-over-hand guidance",
                "Limited — cannot grasp or coordinate brush movements",
              ]}
            />

            <CheckboxGroup
              qNum="20" label="What sensory triggers cause discomfort for your child during toothbrushing?"
              options={[
                "Taste of toothpaste (especially mint)",
                "Texture / foaming of toothpaste",
                "Bristle texture (too hard / prickly)",
                "Vibration (if using electric brush)",
                "Bright bathroom lighting",
                "Sound of running water / brushing noise",
                "None — no sensory distress",
              ]}
              values={formData.q20_sensoryTriggers}
              onChange={(vals) => set("q20_sensoryTriggers", vals)}
              other
              otherValue={formData.q20_sensoryOther}
              onOtherChange={(v) => set("q20_sensoryOther", v)}
            />
          </div>
        )}

        {/* ── STEP 7: REVIEW & COMPLETE ── */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <SectionHeader domain={4} total={4} title="Review & Confirm Clinical Baseline" subtitle="Please verify your responses before saving to the database" />

            <div className="space-y-3">
              {[
                {
                  label: "Child Demographics",
                  value: `${formData.childName || "Child"}, Age ${formData.childAge} (${formData.gender}) • Caregiver: ${formData.caregiverName || "Caregiver"} (${formData.relationship})`,
                },
                {
                  label: "ASD Level & Communication",
                  value: `${formData.asdLevel} • ${formData.communicationLevel}`,
                },
                {
                  label: "Brushing Protocol",
                  value: `${formData.q1_brushFrequency || "Not answered"} • ${formData.q2_brushDuration || "Duration not set"} • Brush: ${formData.q3_toothbrushType || "Standard"} • ${formData.q6_assistance || "Assistance not set"}`,
                },
                {
                  label: "Dietary Risk Factors",
                  value: `Sugar Drinks: ${formData.q10_sugaryDrinks || "None"} • Sweets: ${formData.q11_sugarySnacks || "None"} • Night Bottle: ${formData.q14_nightFeeding || "None"}`,
                },
                {
                  label: "Sensory Triggers Identified",
                  value: formData.q20_sensoryTriggers.length > 0 ? formData.q20_sensoryTriggers.join(", ") : "None reported",
                },
              ].map((item) => (
                <div key={item.label} className="p-3.5 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] text-xs">
                  <span className="font-bold text-[#235347] block mb-0.5">{item.label}</span>
                  <span className="text-[#051F20]">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#DAF1DE] border border-[#8EB69B] text-center space-y-1 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-[#235347] mx-auto" />
              <div className="font-bold text-sm text-[#051F20]">Argus AI Personalized Routine Ready</div>
              <p className="text-xs text-[#0B2B26]/80 max-w-sm mx-auto">
                Submitting stores your baseline in the clinical database and configures Argus AI specifically for your child. Never prompted again.
              </p>
            </div>
          </div>
        )}

        {/* ── Responsive Navigation Footer Buttons ── */}
        <div className="pt-5 border-t border-[#D5E8DA]/60 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={goPrev}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-[#F4FAF6] hover:bg-[#DAF1DE]/40 text-[#051F20] border border-[#D5E8DA] transition-all min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
            </button>
          ) : <div className="hidden sm:block" />}

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={goNext}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#235347] hover:bg-[#163832] text-white flex items-center justify-center gap-2 shadow-xs transition-all min-h-[44px] hover:scale-105"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#235347] hover:bg-[#163832] text-white flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 min-h-[44px] hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Saving Clinical Baseline…</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Save Profile & Open Dashboard</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
