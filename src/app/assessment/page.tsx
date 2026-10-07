import { mockLogs } from "@/lib/mockData";
import { calculateAssessment } from "@/lib/scoring";
import { ArrowRight, Sparkles, Activity, ShieldCheck, Database } from "lucide-react";
import Link from "next/link";

export default function AssessmentPage() {
  const assessment = calculateAssessment(mockLogs);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            Clinical Multimodal Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">AI Assessment</h1>
          <p className="text-slate-300 mt-1.5 text-sm sm:text-base">
            Longitudinal synthesis of oral habits, dietary patterns, sensory tolerance, and brushing fidelity.
          </p>
        </div>

        <Link
          href="/care-plan"
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
        >
          View Care Plan <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Indicators */}
        <div className="liquid-glass-card rounded-2xl p-6 sm:p-7 border border-white/15">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              Current AI Indicators
            </h2>
            <span className="text-xs font-mono font-semibold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
              Score: Live
            </span>
          </div>
          
          <div className="space-y-5">
            <IndicatorRow label="Oral hygiene" score={assessment.oral_hygiene_score} barColor="from-teal-400 to-cyan-400" />
            <IndicatorRow label="Dietary risk" score={assessment.dietary_risk_score} barColor="from-amber-400 to-orange-400" />
            <IndicatorRow label="Sensory difficulty" score={assessment.sensory_difficulty_score} barColor="from-indigo-400 to-purple-400" />
            <IndicatorRow label="Independence" score={assessment.independence_score} barColor="from-emerald-400 to-teal-400" />
          </div>
        </div>

        {/* Priorities */}
        <div className="liquid-glass-card rounded-2xl p-6 sm:p-7 border border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                AI-Identified Priorities
              </h2>
              <span className="text-xs font-semibold text-slate-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                ASD-001
              </span>
            </div>
            
            <div className="space-y-4">
              {assessment.priorities.map((priority, index) => (
                <div key={index} className="flex items-start gap-3.5 p-3.5 rounded-xl liquid-glass border border-white/10 hover:border-teal-400/30 transition-all">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-md shadow-teal-500/20">
                    {index + 1}
                  </div>
                  <div className="pt-0.5 font-semibold text-slate-200 text-sm leading-snug">
                    {priority}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 italic">
            Automated ranking prioritized according to caries risk and caregiver tolerance benchmarks.
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-400" />
            Data Contributing to Current Assessment
          </h3>
          <span className="text-xs text-slate-400 font-mono">4 Streams Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DataSourceCard 
            title="Oral Hygiene" 
            desc="7 daily variables logged" 
            badgeColor="bg-teal-400" 
            update="Updated today" 
          />
          <DataSourceCard 
            title="Dietary Diary" 
            desc="8 diary entries logged" 
            badgeColor="bg-amber-400" 
            update="Updated today" 
          />
          <DataSourceCard 
            title="Behavioral Logs" 
            desc="6 sensory indicators" 
            badgeColor="bg-indigo-400" 
            update="Updated today" 
          />
          <DataSourceCard 
            title="Vision Metric" 
            desc="Brushing coverage model" 
            badgeColor="bg-emerald-400" 
            update="Updated yesterday" 
          />
        </div>
      </div>
    </div>
  );
}

function IndicatorRow({ label, score, barColor }: { label: string, score: number, barColor: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
        <span className="text-slate-200">{label}</span>
        <span className="text-white font-mono font-bold">{score}%</span>
      </div>
      <div className="h-3 w-full bg-slate-900/80 rounded-full overflow-hidden border border-white/10 p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} shadow-sm transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function DataSourceCard({ title, desc, badgeColor, update }: { title: string, desc: string, badgeColor: string, update: string }) {
  return (
    <div className="liquid-glass-card rounded-xl p-5 border border-white/10 hover:border-teal-400/30 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`w-2.5 h-2.5 rounded-full ${badgeColor} shadow-sm`} />
          <h4 className="font-bold text-white text-sm">{title}</h4>
        </div>
        <p className="text-xs text-slate-300 font-medium">{desc}</p>
      </div>
      <p className="text-[11px] text-teal-400 font-mono mt-4 pt-2 border-t border-white/5">{update}</p>
    </div>
  );
}
