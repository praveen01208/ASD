"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  User, 
  Baby, 
  Smile, 
  Utensils, 
  Stethoscope, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Award,
  ChevronRight,
  Info,
  Phone,
  MessageCircle
} from "lucide-react";

interface FormData {
  guardianName: string;
  relationship: string;
  phone: string;
  preferredContact: string;

  childName: string;
  childAge: string;
  dateOfBirth: string;
  asdLevel: string;
  sensorySensitivities: string[];

  // Brushing Habits (Q1-Q5)
  brushFrequency: string;
  brushDuration: string;
  toothbrushType: string;
  toothbrushOther: string;
  toothpaste: string;
  brushesAllSurfaces: string;

  // Dietary Habits (Q6-Q10)
  sugaryFoodFrequency: string;
  healthyFoodFrequency: string;
  preferredFood: string;
  keepsFoodInMouth: string;
  frequentlyAsksForFood: string;

  // Medical & Dental History (Q11-Q15)
  regularMedication: string;
  medicationDetails: string;
  gumBleeding: string;
  toothSpotsOrCavities: string;
  badBreath: string;
  lastDentalVisit: string;

  // Behavioral & Sensory-Motor Skills (Q16-Q20)
  newSituationResponse: string;
  allowsCaregiverBrushing: string;
  difficultyOpeningMouth: string;
  toothbrushSensoryDislike: string;
  cooperationMethod: string;
  cooperationOther: string;
}

const initialFormData: FormData = {
  guardianName: "",
  relationship: "Mother",
  phone: "",
  preferredContact: "email",

  childName: "",
  childAge: "6",
  dateOfBirth: "2020-04-15",
  asdLevel: "Level 1 (Mild support needed)",
  sensorySensitivities: ["Toothpaste foam / strong mint flavour", "Bristle vibrations"],

  brushFrequency: "once_daily",
  brushDuration: "less_than_1_min",
  toothbrushType: "manual",
  toothbrushOther: "",
  toothpaste: "Mild strawberry non-foaming",
  brushesAllSurfaces: "no",

  sugaryFoodFrequency: "1_to_2_daily",
  healthyFoodFrequency: "3_to_4_weekly",
  preferredFood: "sweet",
  keepsFoodInMouth: "sometimes",
  frequentlyAsksForFood: "yes",

  regularMedication: "no",
  medicationDetails: "",
  gumBleeding: "yes",
  toothSpotsOrCavities: "no",
  badBreath: "no",
  lastDentalVisit: "6_to_12_months",

  newSituationResponse: "needs_reassurance",
  allowsCaregiverBrushing: "yes",
  difficultyOpeningMouth: "no",
  toothbrushSensoryDislike: "yes",
  cooperationMethod: "pictures_video",
  cooperationOther: "",
};

const STEPS = [
  { id: 1, title: "Welcome", icon: Sparkles, desc: "Overview" },
  { id: 2, title: "Caregiver", icon: User, desc: "Details" },
  { id: 3, title: "Child", icon: Baby, desc: "Profile" },
  { id: 4, title: "Brushing", icon: Smile, desc: "Q1-5" },
  { id: 5, title: "Diet", icon: Utensils, desc: "Q6-10" },
  { id: 6, title: "Medical", icon: Stethoscope, desc: "Q11-15" },
  { id: 7, title: "Sensory", icon: HeartHandshake, desc: "Q16-20" },
  { id: 8, title: "Review", icon: ShieldCheck, desc: "Analysis" },
  { id: 9, title: "Complete", icon: Award, desc: "Plan" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("asd_onboarding_draft");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const updateFormData = (fields: Partial<FormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...fields };
      localStorage.setItem("asd_onboarding_draft", JSON.stringify(next));
      return next;
    });
  };

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem("asd_onboarding_completed", "true");
      localStorage.setItem("asd_onboarding_data", JSON.stringify(formData));
      setIsSubmitting(false);
      setCurrentStep(9);
    }, 1200);
  };

  const calculateRiskEstimate = () => {
    let risk = 0;
    if (formData.brushFrequency === "never") risk += 25;
    if (formData.brushFrequency === "once_daily") risk += 10;
    if (formData.sugaryFoodFrequency === "more_than_2_daily") risk += 25;
    if (formData.sugaryFoodFrequency === "1_to_2_daily") risk += 15;
    if (formData.gumBleeding === "yes") risk += 20;
    if (formData.toothSpotsOrCavities === "yes") risk += 20;
    if (formData.toothbrushSensoryDislike === "yes") risk += 10;
    return Math.min(risk, 95);
  };

  const renderOptionButtons = (
    field: keyof FormData,
    options: Array<{ value: string; label: string }>
  ) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((opt) => {
          const isSelected = formData[field] === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateFormData({ [field]: opt.value } as any)}
              className={`p-3.5 rounded-2xl text-xs font-semibold text-left transition-all border ${
                isSelected
                  ? "bg-teal-500/25 border-teal-400 text-teal-200 shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                  : "bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-800/60"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Top Header / Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400">
              Child Oral Health Onboarding
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {STEPS[currentStep - 1].title}
            </h1>
          </div>
          <span className="text-xs font-bold text-teal-300 glass-pill px-3.5 py-1.5 rounded-full border border-teal-500/30">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-white/10">
          <div 
            className="bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 h-full transition-all duration-300 ease-out rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="hidden md:flex justify-between mt-4">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isDone = s.id < currentStep;
            const isCurrent = s.id === currentStep;
            return (
              <button
                key={s.id}
                onClick={() => s.id <= currentStep && setCurrentStep(s.id)}
                disabled={s.id > currentStep}
                className={`flex flex-col items-center text-[11px] transition-all ${
                  isCurrent 
                    ? "text-teal-300 font-bold" 
                    : isDone 
                    ? "text-slate-400 hover:text-teal-300" 
                    : "text-slate-600 cursor-not-allowed"
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-all ${
                    isCurrent
                      ? "bg-teal-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(45,212,191,0.4)]"
                      : isDone
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                      : "bg-slate-900/60 text-slate-600 border border-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-10 mb-8 relative">
        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <div className="space-y-6 text-center max-w-xl mx-auto py-6">
            <div className="w-16 h-16 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(45,212,191,0.2)]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Baseline Pediatric ASD Assessment
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              20 clinical markers to tailor visual brushing desensitization, plaque reduction strategies, and sensory-friendly oral routines for your child.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                <div className="font-bold text-white text-xs mb-1">⏱️ 5 Minutes</div>
                <div className="text-[11px] text-slate-200">Quick 20-question baseline</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                <div className="font-bold text-teal-300 text-xs mb-1">🤖 ASD Bot</div>
                <div className="text-[11px] text-slate-200">Personalized sensory plan</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                <div className="font-bold text-emerald-300 text-xs mb-1">🔒 Supervised</div>
                <div className="text-[11px] text-slate-200">Dr. Nivrutti Reddy guidance</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Guardian Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-400" /> Caregiver / Guardian Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => updateFormData({ guardianName: e.target.value })}
                  placeholder="e.g., Sarah Johnson"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Relationship to Child</label>
                <select
                  value={formData.relationship}
                  onChange={(e) => updateFormData({ relationship: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm bg-slate-900"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                  <option value="Special Educator">Special Educator / Therapist</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData({ phone: e.target.value })}
                  placeholder="e.g., +91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Contact Method</label>
                <select
                  value={formData.preferredContact}
                  onChange={(e) => updateFormData({ preferredContact: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm bg-slate-900"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="sms">SMS Text</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Child Info */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Baby className="w-4 h-4 text-teal-400" /> Child Profile & ASD Baseline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Child Identifier / Name</label>
                <input
                  type="text"
                  value={formData.childName}
                  onChange={(e) => updateFormData({ childName: e.target.value })}
                  placeholder="e.g., Leo or ASD-001"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">ASD Profile Support Level</label>
                <select
                  value={formData.asdLevel}
                  onChange={(e) => updateFormData({ asdLevel: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm bg-slate-900"
                >
                  <option value="Level 1 (Mild support needed)">Level 1 (Mild support needed)</option>
                  <option value="Level 2 (Substantial support needed)">Level 2 (Substantial support needed)</option>
                  <option value="Level 3 (Very substantial support needed)">Level 3 (Very substantial support needed)</option>
                  <option value="Under clinical evaluation">Under clinical evaluation</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Brushing Habits (Q1-Q5) */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Smile className="w-4 h-4 text-teal-400" /> Section 1: Brushing Habits (Q1 - Q5)
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">1. How frequently does your child brush teeth?</label>
              {renderOptionButtons("brushFrequency", [
                { value: "never", label: "Rarely / Never" },
                { value: "once_daily", label: "Once daily" },
                { value: "twice_daily", label: "Twice or more daily" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">2. Duration of brushing routine?</label>
              {renderOptionButtons("brushDuration", [
                { value: "less_than_1_min", label: "< 1 minute" },
                { value: "1_to_2_min", label: "1 to 2 minutes" },
                { value: "3_min", label: "2 to 3+ minutes" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">3. Type of toothbrush used?</label>
              {renderOptionButtons("toothbrushType", [
                { value: "manual", label: "Manual Soft Bristle" },
                { value: "electric", label: "Electric / Sonic" },
                { value: "other", label: "3-Sided / Finger Brush" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">4. Toothpaste formula / flavor used:</label>
              <input
                type="text"
                value={formData.toothpaste}
                onChange={(e) => updateFormData({ toothpaste: e.target.value })}
                placeholder="e.g., Non-foaming unflavored / mild strawberry fluoride"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">5. Covers all tooth surfaces (front, back, biting)?</label>
              {renderOptionButtons("brushesAllSurfaces", [
                { value: "yes", label: "Yes, thoroughly" },
                { value: "no", label: "No, misses back areas" },
                { value: "not_sure", label: "Not sure / Needs help" },
              ])}
            </div>
          </div>
        )}

        {/* Step 5: Dietary Habits (Q6-Q10) */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-400" /> Section 2: Dietary Habits & Nutrition (Q6 - Q10)
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">6. Frequency of sugary foods or sweetened drinks?</label>
              {renderOptionButtons("sugaryFoodFrequency", [
                { value: "never", label: "Rarely / Never" },
                { value: "1_to_2_daily", label: "1-2 times daily" },
                { value: "more_than_2_daily", label: "> 2 times daily" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">7. Frequency of fibrous fruits & crunchy vegetables?</label>
              {renderOptionButtons("healthyFoodFrequency", [
                { value: "daily", label: "Daily" },
                { value: "3_to_4_weekly", label: "3-4 times/week" },
                { value: "1_to_2_weekly", label: "1-2 times/week or rarely" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">8. Primary preferred food texture?</label>
              {renderOptionButtons("preferredFood", [
                { value: "sweet", label: "Sweet / Sticky / Carb snacks" },
                { value: "home_cooked", label: "Home-cooked mixed meals" },
                { value: "fruits", label: "Fruits & raw textures" },
                { value: "vegetables", label: "Pureed / Soft textures only" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">9. Does child pouch or hold food in mouth for long periods?</label>
              {renderOptionButtons("keepsFoodInMouth", [
                { value: "never", label: "Never" },
                { value: "sometimes", label: "Sometimes" },
                { value: "often", label: "Often (Prolonged pooling)" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">10. Frequent snacking/grazing between set meals?</label>
              {renderOptionButtons("frequentlyAsksForFood", [
                { value: "yes", label: "Yes, frequent snacking" },
                { value: "no", label: "No, scheduled meals" },
              ])}
            </div>
          </div>
        )}

        {/* Step 6: Medical & Dental History (Q11-Q15) */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-indigo-400" /> Section 3: Medical & Dental History (Q11 - Q15)
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">11. Taking regular medications (syrups, tablets)?</label>
              {renderOptionButtons("regularMedication", [
                { value: "no", label: "No regular medications" },
                { value: "yes", label: "Yes (syrups / daily meds)" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">12. Observed gum redness, swelling, or bleeding?</label>
              {renderOptionButtons("gumBleeding", [
                { value: "yes", label: "Yes, gums bleed/red" },
                { value: "no", label: "No, gums healthy pink" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">13. Visible brown spots or cavity holes?</label>
              {renderOptionButtons("toothSpotsOrCavities", [
                { value: "yes", label: "Yes, spots visible" },
                { value: "no", label: "No spots visible" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">14. Persistent bad breath noticeable?</label>
              {renderOptionButtons("badBreath", [
                { value: "yes", label: "Yes, often noticeable" },
                { value: "no", label: "No / Normal" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">15. Last professional dental clinic visit?</label>
              {renderOptionButtons("lastDentalVisit", [
                { value: "1_to_2_months", label: "Within 6 months" },
                { value: "6_to_12_months", label: "6 - 12 months ago" },
                { value: "never", label: "Over 1 year / Never" },
              ])}
            </div>
          </div>
        )}

        {/* Step 7: Behavioral & Sensory Skills (Q16-Q20) */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-purple-400" /> Section 4: Behavioral & Sensory-Motor (Q16 - Q20)
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">16. Response to new sensory situations?</label>
              {renderOptionButtons("newSituationResponse", [
                { value: "adapts_easily", label: "Adapts easily" },
                { value: "needs_reassurance", label: "Needs gentle reassurance" },
                { value: "requires_support", label: "High distress / Special support" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">17. Allows caregiver to help brush teeth?</label>
              {renderOptionButtons("allowsCaregiverBrushing", [
                { value: "yes", label: "Yes, allows caregiver" },
                { value: "no", label: "No, strongly resists" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">18. Difficulty keeping mouth open?</label>
              {renderOptionButtons("difficultyOpeningMouth", [
                { value: "yes", label: "Yes, closes mouth/bites" },
                { value: "no", label: "No, opens willingly" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">19. Sensory aversion to vibration, bristles, or taste?</label>
              {renderOptionButtons("toothbrushSensoryDislike", [
                { value: "yes", label: "Yes, notable aversion" },
                { value: "no", label: "No significant aversion" },
              ])}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">20. Top method for encouraging cooperation?</label>
              {renderOptionButtons("cooperationMethod", [
                { value: "pictures_video", label: "Visual Schedule & Social Stories" },
                { value: "verbal", label: "Verbal Praise & Timers" },
                { value: "demonstration", label: "Modeling / Brushing Together" },
                { value: "other", label: "Token Rewards" },
              ])}
            </div>
          </div>
        )}

        {/* Step 8: Review & AI Provisional Insights */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" /> Review Assessment & AI Risk Analysis
            </h3>

            <div className="bg-gradient-to-r from-teal-900/60 via-slate-900/80 to-indigo-900/60 rounded-3xl p-6 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
                  AI Assessment Generated
                </span>
                <h4 className="text-xl font-bold text-white mt-1">
                  Baseline Profile for {formData.childName || "Leo (ASD-001)"}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Calculated from 20 clinical markers across dental, sensory, dietary, and behavioral metrics.
                </p>
              </div>
              <div className="bg-teal-500/20 rounded-2xl px-6 py-4 text-center border border-teal-500/30 min-w-[140px]">
                <div className="text-3xl font-black text-teal-300">{calculateRiskEstimate()}%</div>
                <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Estimated Need Index</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1.5">
                <div className="font-bold text-teal-400 flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Caregiver & Child
                </div>
                <p className="text-slate-300"><span className="text-slate-500">Caregiver:</span> {formData.guardianName || "Sarah Johnson"} ({formData.relationship})</p>
                <p className="text-slate-300"><span className="text-slate-500">Child:</span> {formData.childName || "ASD-001"} (DOB: {formData.dateOfBirth})</p>
                <p className="text-slate-300"><span className="text-slate-500">ASD Profile:</span> {formData.asdLevel}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1.5">
                <div className="font-bold text-teal-400 flex items-center gap-1.5">
                  <Smile className="w-4 h-4" /> Brushing Routine
                </div>
                <p className="text-slate-300"><span className="text-slate-500">Frequency:</span> {formData.brushFrequency.replace("_", " ")}</p>
                <p className="text-slate-300"><span className="text-slate-500">Brush Type:</span> {formData.toothbrushType} ({formData.brushDuration})</p>
                <p className="text-slate-300"><span className="text-slate-500">Coverage:</span> {formData.brushesAllSurfaces === "yes" ? "Thorough" : "Misses back areas"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Complete & Generated Plan */}
        {currentStep === 9 && (
          <div className="space-y-6 text-center py-6 max-w-xl mx-auto">
            <div className="w-20 h-20 bg-teal-500/20 text-teal-400 rounded-3xl border border-teal-500/40 flex items-center justify-center mx-auto mb-2 shadow-[0_0_30px_rgba(45,212,191,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Baseline Assessment Saved!
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              Your 20-question baseline has been synced with ASD Bot and Dr. Nivrutti Reddy&apos;s supervision matrix. Your tailored care plan is now ready.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
              <Link
                href="/care-plan"
                className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                Open AI Care Plan <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="px-6 py-3.5 glass-pill hover:bg-white/10 text-white text-xs font-bold rounded-2xl transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        {currentStep < 9 && (
          <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                currentStep === 1
                  ? "text-slate-600 cursor-not-allowed"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {currentStep === 8 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Saving & Generating Plan...</>
                ) : (
                  <>
                    Confirm & Save Assessment <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-teal-500/20 transition-all"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
