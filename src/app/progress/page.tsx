"use client";

import { mockAssessments } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart as ChartIcon, CheckCircle2, TrendingUp, Target } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
          <ChartIcon className="w-3.5 h-3.5 text-teal-400" />
          Longitudinal Clinical Trajectory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Progress Trends</h1>
        <p className="text-slate-300 mt-1.5 text-sm sm:text-base">
          Continuous tracking of oral hygiene compliance, dietary modifications, and independence gains over 8 weeks.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Oral Hygiene" 
          value="+32%" 
          subtitle="Significant Plaque Drop" 
          tagColor="text-teal-300 bg-teal-500/10 border-teal-500/20" 
        />
        <SummaryCard 
          title="Dietary Risk" 
          value="-24%" 
          subtitle="Sugar Exposure Curbed" 
          tagColor="text-emerald-300 bg-emerald-500/10 border-emerald-500/20" 
        />
        <SummaryCard 
          title="Independence" 
          value="+28%" 
          subtitle="Less Physical Prompting" 
          tagColor="text-cyan-300 bg-cyan-500/10 border-cyan-500/20" 
        />
        <SummaryCard 
          title="Sensory Calm" 
          value="+20%" 
          subtitle="Desensitization Progress" 
          tagColor="text-purple-300 bg-purple-500/10 border-purple-500/20" 
        />
      </div>

      {/* Chart */}
      <div className="liquid-glass-card rounded-2xl border border-white/15 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              8-Week Longitudinal Score Trajectory
            </h2>
            <p className="text-xs text-slate-300 mt-1">Oral Hygiene Score (%) logged across study interval</p>
          </div>
          <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
            Target &gt; 80%
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockAssessments}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(3, 7, 18, 0.9)', 
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px', 
                  backdropFilter: 'blur(16px)',
                  color: '#fff',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                }}
                formatter={(value: any) => [`${value}%`, 'Score']}
              />
              <Line 
                type="monotone" 
                dataKey="oral_hygiene_score" 
                stroke="#14b8a6" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#14b8a6', strokeWidth: 2, stroke: '#030712' }}
                activeDot={{ r: 8, fill: '#2dd4bf', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals */}
      <div className="liquid-glass-card rounded-2xl border border-white/15 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Behavioral Milestones
          </h2>
          <span className="text-xs text-slate-300 font-mono">2 of 3 Met</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GoalCard title="Increase Brushing to 90s" status="Achieved" isCompleted={true} />
          <GoalCard title="Improve Posterior Molar Reach" status="In Progress (72%)" isCompleted={false} tagColor="teal" />
          <GoalCard title="Reduce Sugary Bedtime Snacks" status="In Progress (1/day)" isCompleted={false} tagColor="amber" />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, tagColor }: { title: string; value: string; subtitle: string; tagColor: string }) {
  return (
    <div className="liquid-glass-card rounded-2xl border border-white/15 p-5 flex flex-col justify-between">
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">{title}</h3>
        <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{value}</div>
      </div>
      <div className={`mt-3 text-xs font-semibold px-2.5 py-1 rounded-md border inline-block w-fit ${tagColor}`}>
        {subtitle}
      </div>
    </div>
  );
}

function GoalCard({ title, status, isCompleted, tagColor = "teal" }: { title: string; status: string; isCompleted: boolean; tagColor?: string }) {
  return (
    <div className="p-5 rounded-xl liquid-glass border border-white/10 flex flex-col justify-between">
      <h4 className="font-bold text-white text-sm mb-4">{title}</h4>
      <div className="self-start">
        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
          isCompleted 
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
            : tagColor === "amber"
            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
            : "bg-teal-500/20 text-teal-300 border-teal-500/30"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}
