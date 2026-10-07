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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
          <ListChecks className="w-3.5 h-3.5 text-teal-400" />
          Individualized Clinical Protocol
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Personalized Care Plan</h1>
        <p className="text-slate-300 mt-1.5 text-sm sm:text-base">
          Dynamic pediatric interventions tailored to ASD-001's sensory tolerance, motor readiness, and behavioral baseline.
        </p>
      </div>

      {/* Today's Recommendation Box */}
      <div className="relative rounded-2xl liquid-glass border border-teal-500/30 p-6 sm:p-7 overflow-hidden shadow-[0_0_30px_rgba(20,184,166,0.15)]">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-400" /> 
              Today's Priority Routine
            </div>
            <h3 className="font-extrabold text-white text-lg sm:text-xl">
              Posterior Tooth Desensitization & Visual Routine
            </h3>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Focus on <strong className="text-teal-300 font-bold">posterior molar coverage</strong> using Leo's familiar visual sequence card deck. 
              Avoid introducing a new toothpaste brand today due to taste sensitivity elevation logged over the past 48 hours.
            </p>
          </div>
          
          <Link
            href="/learning"
            className="flex-shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
          >
            Start Routine Guide <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Oral Hygiene Intervention */}
        <div className="liquid-glass-card rounded-2xl border border-white/15 overflow-hidden flex flex-col justify-between">
          <div className="p-6 sm:p-7 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                Oral Hygiene Intervention
              </h2>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Adaptive
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-teal-300 text-[11px] font-bold uppercase tracking-wider block mb-1">Target Focus</span>
                <p className="text-white font-bold text-sm sm:text-base">{carePlan.oral_intervention.target}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-teal-300 text-[11px] font-bold uppercase tracking-wider block mb-1">Clinical Rationale</span>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">{carePlan.oral_intervention.reason}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-teal-300 text-[11px] font-bold uppercase tracking-wider block mb-1">Actionable Protocol</span>
                <p className="text-slate-100 font-medium text-xs sm:text-sm leading-relaxed">{carePlan.oral_intervention.steps}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white/[0.02] border-t border-white/10 flex flex-wrap gap-3">
            <Link
              href="/learning"
              className="px-4 py-2.5 rounded-xl liquid-glass-pill hover:bg-white/10 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-2 border border-white/15 transition-all"
            >
              <Play className="w-3.5 h-3.5 text-teal-400" /> Watch Visual Sequence
            </Link>
            <Link
              href="/monitoring"
              className="px-4 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 font-bold text-xs flex items-center gap-2 transition-all"
            >
              Log Routine Results
            </Link>
          </div>
        </div>

        {/* Dietary Intervention */}
        <div className="liquid-glass-card rounded-2xl border border-white/15 overflow-hidden flex flex-col justify-between">
          <div className="p-6 sm:p-7 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Dietary & Sensory Intervention
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Personalized
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-emerald-400 text-[11px] font-bold uppercase tracking-wider block mb-1">Target Focus</span>
                <p className="text-white font-bold text-sm sm:text-base">{carePlan.dietary_intervention.target}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-emerald-400 text-[11px] font-bold uppercase tracking-wider block mb-1">Sensory Adaptation</span>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">{carePlan.dietary_intervention.suggestion}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-emerald-400 text-[11px] font-bold uppercase tracking-wider block mb-1">Texture Preference</span>
                <p className="text-slate-100 font-medium text-xs sm:text-sm capitalize leading-relaxed">
                  Texture: {mockChild.preferred_texture} • Reinforcement: {mockChild.reinforcement_type}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white/[0.02] border-t border-white/10 flex flex-wrap gap-3">
            <Link
              href="/assistant"
              className="px-4 py-2.5 rounded-xl liquid-glass-pill hover:bg-white/10 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-2 border border-white/15 transition-all"
            >
              Ask ASD Bot for Snack Ideas
            </Link>
            <Link
              href="/learning"
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center gap-2 transition-all"
            >
              Healthy Eating Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
