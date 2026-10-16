"use client";

import { mockAssessments } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart as ChartIcon, TrendingUp, Target } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black text-[#051F20] bg-[#DAF1DE] border border-[#8EB69B] mb-2">
          <ChartIcon className="w-3.5 h-3.5 text-[#235347]" />
          Longitudinal Clinical Trajectory
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#051F20] tracking-tight">Progress Trends</h1>
        <p className="text-[#0B2B26] mt-1.5 text-sm sm:text-base font-medium">
          Continuous tracking of oral hygiene compliance, dietary modifications, and independence gains over 8 weeks.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Oral Hygiene" 
          value="+32%" 
          subtitle="Significant Plaque Drop" 
          tagColor="text-[#051F20] bg-[#DAF1DE] border-[#8EB69B]" 
        />
        <SummaryCard 
          title="Dietary Risk" 
          value="-24%" 
          subtitle="Sugar Exposure Curbed" 
          tagColor="text-[#051F20] bg-[#DAF1DE] border-[#8EB69B]" 
        />
        <SummaryCard 
          title="Independence" 
          value="+28%" 
          subtitle="Less Physical Prompting" 
          tagColor="text-[#051F20] bg-[#DAF1DE] border-[#8EB69B]" 
        />
        <SummaryCard 
          title="Sensory Calm" 
          value="+20%" 
          subtitle="Desensitization Progress" 
          tagColor="text-[#051F20] bg-[#DAF1DE] border-[#8EB69B]" 
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-[#D5E8DA] shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D5E8DA]">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#051F20] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#235347]" />
              8-Week Longitudinal Score Trajectory
            </h2>
            <p className="text-xs text-[#163832] font-semibold mt-1">Oral Hygiene Score (%) logged across study interval</p>
          </div>
          <span className="text-xs font-mono font-black text-[#051F20] bg-[#DAF1DE] px-2.5 py-1 rounded-md border border-[#8EB69B]">
            Target &gt; 80%
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockAssessments}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D5E8DA" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#163832', fontSize: 12, fontWeight: 600 }} dy={10} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#D5E8DA',
                  borderRadius: '12px', 
                  color: '#051F20',
                  boxShadow: '0 10px 25px -5px rgba(5, 31, 32, 0.1)',
                  fontWeight: 700
                }}
                formatter={(value: any) => [`${value}%`, 'Score']}
              />
              <Line 
                type="monotone" 
                dataKey="oral_hygiene_score" 
                stroke="#235347" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#235347', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 8, fill: '#051F20', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white rounded-2xl border border-[#D5E8DA] shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D5E8DA]">
          <h2 className="text-lg sm:text-xl font-black text-[#051F20] flex items-center gap-2">
            <Target className="w-5 h-5 text-[#235347]" />
            Behavioral Milestones
          </h2>
          <span className="text-xs text-[#163832] font-mono font-bold">2 of 3 Met</span>
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
    <div className="bg-white rounded-2xl border border-[#D5E8DA] shadow-xs p-5 flex flex-col justify-between">
      <div>
        <h3 className="text-xs font-black text-[#051F20] tracking-wider uppercase mb-2">{title}</h3>
        <div className="text-3xl sm:text-4xl font-black text-[#051F20] font-mono">{value}</div>
      </div>
      <div className={`mt-3 text-xs font-bold px-2.5 py-1 rounded-md border inline-block w-fit ${tagColor}`}>
        {subtitle}
      </div>
    </div>
  );
}

function GoalCard({ title, status, isCompleted, tagColor = "teal" }: { title: string; status: string; isCompleted: boolean; tagColor?: string }) {
  return (
    <div className="p-5 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] flex flex-col justify-between">
      <h4 className="font-extrabold text-[#051F20] text-sm mb-4">{title}</h4>
      <div className="self-start">
        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
          isCompleted 
            ? "bg-[#DAF1DE] text-[#051F20] border-[#8EB69B]" 
            : tagColor === "amber"
            ? "bg-amber-50 text-amber-900 border-amber-300"
            : "bg-[#DAF1DE] text-[#051F20] border-[#8EB69B]"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}
