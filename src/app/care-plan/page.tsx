import { mockLogs, mockChild } from "@/lib/mockData";
import { calculateAssessment } from "@/lib/scoring";
import { generateCarePlan } from "@/lib/carePlan";
import { Play, Sparkles, CheckCircle2, ListChecks, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CarePlanPage() {
  const assessment = calculateAssessment(mockLogs);
  const carePlan = generateCarePlan(assessment, mockChild.preferred_texture);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 mb-2">
          <ListChecks className="w-3.5 h-3.5 text-teal-600" />
          Individualized Clinical Protocol
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Personalized Care Plan</h1>
        <p className="text-slate-600 mt-1.5 text-sm sm:text-base">
          Dynamic pediatric interventions tailored to ASD-001&apos;s sensory tolerance, motor readiness, and behavioral baseline.
        </p>
      </div>

      {/* Today's Recommendation Box */}
      <div className="relative rounded-2xl bg-white border border-teal-200/90 p-6 sm:p-7 overflow-hidden shadow-xs">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-teal-50 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-600" /> 
              Today&apos;s Priority Routine
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              Posterior Tooth Desensitization & Visual Routine
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Focus on <strong className="text-teal-700 font-bold">posterior molar coverage</strong> using Leo&apos;s familiar visual sequence card deck. 
              Avoid introducing a new toothpaste brand today due to taste sensitivity elevation logged over the past 48 hours.
            </p>
          </div>
          
          <Link
            href="/learning"
            className="flex-shrink-0 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-105"
          >
            Start Routine Guide <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Oral Hygiene Intervention */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-6 sm:p-7 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                Oral Hygiene Intervention
              </h2>
              <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Adaptive
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-teal-700 text-[11px] font-bold uppercase tracking-wider block mb-1">Target Focus</span>
                <p className="text-slate-900 font-bold text-sm sm:text-base">{carePlan.oral_intervention.target}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-teal-700 text-[11px] font-bold uppercase tracking-wider block mb-1">Clinical Rationale</span>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{carePlan.oral_intervention.reason}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-teal-700 text-[11px] font-bold uppercase tracking-wider block mb-1">Actionable Protocol</span>
                <p className="text-slate-800 font-medium text-xs sm:text-sm leading-relaxed">{carePlan.oral_intervention.steps}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3">
            <Link
              href="/learning"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-2 border border-slate-200 transition-all shadow-2xs"
            >
              <Play className="w-3.5 h-3.5 text-teal-600" /> Watch Visual Sequence
            </Link>
            <Link
              href="/monitoring"
              className="px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-bold text-xs flex items-center gap-2 transition-all"
            >
              Log Routine Results
            </Link>
          </div>
        </div>

        {/* Dietary Intervention */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-6 sm:p-7 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Dietary & Sensory Intervention
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Personalized
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-emerald-700 text-[11px] font-bold uppercase tracking-wider block mb-1">Target Focus</span>
                <p className="text-slate-900 font-bold text-sm sm:text-base">{carePlan.dietary_intervention.target}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-emerald-700 text-[11px] font-bold uppercase tracking-wider block mb-1">Sensory Adaptation</span>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{carePlan.dietary_intervention.suggestion}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-emerald-700 text-[11px] font-bold uppercase tracking-wider block mb-1">Texture Preference</span>
                <p className="text-slate-800 font-medium text-xs sm:text-sm capitalize leading-relaxed">
                  Texture: {mockChild.preferred_texture} • Reinforcement: {mockChild.reinforcement_type}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3">
            <Link
              href="/assistant"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-2 border border-slate-200 transition-all shadow-2xs"
            >
              Ask ASD Bot for Snack Ideas
            </Link>
            <Link
              href="/learning"
              className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-2 transition-all"
            >
              Healthy Eating Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
