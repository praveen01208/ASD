"use client";

import { useState } from "react";
import {
  Play,
  PlaySquare,
  ShieldCheck,
  Clock,
  ExternalLink,
  BookOpen,
  Smile,
  Stethoscope,
  Brain,
} from "lucide-react";

type Category = "brushing" | "dentist" | "sensory" | "nutrition";

interface VideoItem {
  id: string;
  title: string;
  creator: string;
  subtitle: string;
  duration: string;
  category: Category;
  description: string;
  clinicalRationale: string;
  accent: string;
}

const videos: VideoItem[] = [
  // ── Brushing & Social Stories ──────────────────────────────────────────────
  {
    id: "R9Z58y9yO3U",
    title: "Teeth Brushing Social Story with Visual Timer",
    creator: "Soulution Animation",
    subtitle: "Animated ASD-Specific Social Story with Built-in Timer",
    duration: "3:12",
    category: "brushing",
    description:
      "Follows Achi, an autistic child, through every brushing step with an on-screen countdown timer. Purpose-built for children with ASD to reduce anxiety and enforce routine predictability.",
    clinicalRationale:
      "Visual timers eliminate the ambiguity of 'how much longer?' — the leading trigger for mid-routine meltdowns in ASD oral care.",
    accent: "from-teal-600/40 to-cyan-600/40",
  },
  {
    id: "1d5T_1Ua2Xw",
    title: "Teaching Children with Autism How to Brush Teeth",
    creator: "Early Autism Project Malaysia",
    subtitle: "ABA-Based 25-Step Routine for Independence",
    duration: "5:48",
    category: "brushing",
    description:
      "Breaks the entire brushing routine into 25 discrete, manageable steps using Applied Behavior Analysis (ABA) principles. Designed to build lasting independent oral care habits.",
    clinicalRationale:
      "Task chaining with micro-step reinforcement is the gold-standard ABA strategy for self-care routine acquisition in autistic children.",
    accent: "from-indigo-600/40 to-purple-600/40",
  },
  {
    id: "sO2g0T6wWnE",
    title: "Toothbrushing Tips That Actually Work for Kids with Autism",
    creator: "Dr. Mary Barbera – Autism Mom & BCBA",
    subtitle: "4-Step Sensory Desensitization Approach",
    duration: "6:20",
    category: "brushing",
    description:
      "Dr. Mary Barbera (Board Certified Behavior Analyst and autism parent) walks through evidence-based strategies: brush choice, toothpaste desensitization, positioning, and reinforcement schedules.",
    clinicalRationale:
      "Addresses oral tactile hypersensitivity through graduated exposure — the most clinically validated approach for resolving sensory-based brushing refusal.",
    accent: "from-emerald-600/40 to-teal-600/40",
  },
  {
    id: "F71r0P_5m4k",
    title: "Why Should I Brush My Teeth? (Symbol-Supported)",
    creator: "Stories with Symbols",
    subtitle: "Widgit Symbol AAC-Friendly Explainer",
    duration: "2:55",
    category: "brushing",
    description:
      "Uses on-screen Widgit communication symbols alongside narration, making it accessible to children who are non-verbal or use AAC devices. Explains the why behind brushing and includes a dentist visit walkthrough.",
    clinicalRationale:
      "Symbol-augmented content bridges understanding for children with limited expressive language, improving compliance when verbal instruction alone fails.",
    accent: "from-amber-600/40 to-orange-600/40",
  },

  // ── Dentist Prep ──────────────────────────────────────────────────────────
  {
    id: "BOqK8oKKm8k",
    title: "Going to the Dentist – Social Story for Kids with Autism",
    creator: "Pathfinders for Autism",
    subtitle: "Pre-Visit Desensitization Narrative",
    duration: "4:10",
    category: "dentist",
    description:
      "A calming, step-by-step social story narrating the complete dental visit: arriving at the clinic, meeting the dentist, the chair, the tools (mirror, explorer, suction), and returning home safely.",
    clinicalRationale:
      "Pre-visit familiarization through video reduces anticipatory anxiety and lowers fight-or-flight response intensity during actual pediatric clinical examination.",
    accent: "from-cyan-600/40 to-blue-600/40",
  },
  {
    id: "kKLmjAkBbHs",
    title: "Let's Go to the Dentist! (AAC-Modeled)",
    creator: "Mighty Knightly",
    subtitle: "AAC Device Modeling for Non-Verbal Children",
    duration: "3:45",
    category: "dentist",
    description:
      "Models the dentist appointment using an AAC communication device, showing how a non-verbal child can express feelings (scared, okay, done) during the visit using their device.",
    clinicalRationale:
      "AAC modeling normalizes the experience and gives non-verbal children a communication framework to use during clinical appointments, dramatically improving compliance.",
    accent: "from-violet-600/40 to-indigo-600/40",
  },

  // ── Sensory & Nutrition ───────────────────────────────────────────────────
  {
    id: "4DUHuUGEFZg",
    title: "Sensory Issues & Oral Care in Autism Explained",
    creator: "Autism Speaks",
    subtitle: "Clinical Overview for Caregivers & Parents",
    duration: "7:30",
    category: "sensory",
    description:
      "Autism Speaks clinical advisors explain the neurological basis of oral sensory hypersensitivity in ASD, how it disrupts brushing and dental visits, and the evidence-based interventions that work.",
    clinicalRationale:
      "Caregiver understanding of the sensory neurological substrate directly improves patience, strategy implementation quality, and treatment compliance outcomes.",
    accent: "from-rose-600/40 to-pink-600/40",
  },
  {
    id: "nFHEHdroqX4",
    title: "Healthy Teeth, Healthy Body – Nutrition for Kids",
    creator: "SciShow Kids",
    subtitle: "Visual Science: Sugar, Plaque & Tooth Enamel",
    duration: "4:15",
    category: "nutrition",
    description:
      "Engaging animated explanation of what happens when sugar contacts tooth enamel, how bacteria form plaque, and which foods (fibrous vegetables, dairy, water) actively protect teeth.",
    clinicalRationale:
      "Logical 'why it matters' framing is especially effective for high-functioning neurodivergent children who require causal understanding before accepting behavioral changes.",
    accent: "from-green-600/40 to-emerald-600/40",
  },
];

const CATEGORIES: { key: Category; label: string; icon: React.ReactNode }[] = [
  { key: "brushing", label: "Brushing & Social Stories", icon: <Smile className="w-4 h-4" /> },
  { key: "dentist", label: "Dentist Preparation", icon: <Stethoscope className="w-4 h-4" /> },
  { key: "sensory", label: "Sensory & Behaviour", icon: <Brain className="w-4 h-4" /> },
  { key: "nutrition", label: "Nutrition & Diet", icon: <BookOpen className="w-4 h-4" /> },
];

export default function VisualLearningPage() {
  const [activeTab, setActiveTab] = useState<Category>("brushing");
  const [currentVideo, setCurrentVideo] = useState<VideoItem>(videos[0]);

  const filteredVideos = videos.filter((v) => v.category === activeTab);
  const tabFirstVideo = (tab: Category) => videos.find((v) => v.category === tab) ?? videos[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-3">
          <PlaySquare className="w-3.5 h-3.5 text-teal-400" />
          Evidence-Based Video Modules · Curated for ASD Oral Care
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Visual Learning Library
        </h1>
        <p className="text-slate-300 mt-2 text-sm sm:text-base max-w-2xl">
          Clinically curated videos covering brushing routines, dentist preparation, sensory desensitization, and nutrition — each selected for effectiveness with ASD children.
        </p>
      </div>

      {/* Featured Video Theater */}
      <div className="liquid-glass-card rounded-3xl border border-teal-500/25 overflow-hidden shadow-2xl p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* YouTube Embed */}
          <div className="w-full lg:w-[58%] rounded-2xl overflow-hidden aspect-video bg-black border border-white/10 shadow-xl">
            <iframe
              key={currentVideo.id}
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${currentVideo.id}?rel=0&modestbranding=1`}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Metadata Panel */}
          <div className="w-full lg:w-[42%] flex flex-col justify-between space-y-4 min-h-full">
            {/* Category badge + creator */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                {CATEGORIES.find((c) => c.key === currentVideo.category)?.label}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                {currentVideo.duration}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-mono font-semibold text-teal-400 mb-1">
                {currentVideo.creator}
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {currentVideo.title}
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{currentVideo.subtitle}</p>
              <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed">
                {currentVideo.description}
              </p>
            </div>

            {/* Clinical Rationale Box */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-teal-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Clinical Rationale
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentVideo.clinicalRationale}
              </p>
            </div>

            {/* Footer links */}
            <div className="flex items-center justify-between pt-1">
              <a
                href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] font-mono text-slate-500">
                ASD Clinically Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => {
          const count = videos.filter((v) => v.category === cat.key).length;
          const isActive = activeTab === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => {
                setActiveTab(cat.key);
                setCurrentVideo(tabFirstVideo(cat.key));
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/20"
                  : "liquid-glass text-slate-300 hover:text-white border border-white/10 hover:border-white/20"
              }`}
            >
              {cat.icon}
              {cat.label}
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-slate-950/20 text-slate-950" : "bg-white/10 text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Video Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const isSelected = currentVideo.id === video.id;
            return (
              <div
                key={video.id}
                onClick={() => {
                  setCurrentVideo(video);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`liquid-glass-card rounded-2xl border overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-teal-400 shadow-[0_0_30px_rgba(45,212,191,0.2)] ring-1 ring-teal-400/40"
                    : "border-white/10 hover:border-teal-400/40 hover:shadow-lg"
                }`}
              >
                {/* YouTube Thumbnail */}
                <div className="h-44 w-full bg-slate-950 relative overflow-hidden border-b border-white/10">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/30 transition-all flex items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${
                        isSelected
                          ? "bg-teal-400 text-slate-950 scale-110"
                          : "bg-white/90 text-slate-950 group-hover:scale-110 group-hover:bg-teal-300"
                      }`}
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  {/* Duration badge */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-white font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-teal-300" />
                    {video.duration}
                  </div>
                  {isSelected && (
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 font-black text-[9px] uppercase tracking-widest shadow-md">
                      ▶ Now Playing
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-teal-400 block mb-1">
                      {video.creator}
                    </span>
                    <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-teal-300 transition-colors leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{video.subtitle}</p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">
                      {video.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      {CATEGORIES.find((c) => c.key === video.category)?.label}
                    </span>
                    <button className="px-3.5 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all flex items-center gap-1.5">
                      {isSelected ? (
                        <>▶ Playing</>
                      ) : (
                        <>Watch Now</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="liquid-glass-card rounded-2xl border border-white/10 p-12 text-center">
          <p className="text-slate-400 text-sm">No videos in this category yet.</p>
        </div>
      )}

      {/* 6-Step Visual Routine */}
      <div className="liquid-glass-card rounded-2xl border border-white/15 p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          6-Step Daily Brushing Routine · Visual Cue Cards
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <StepCard step="1" emoji="🪥" title="Get Brush" desc="Soft-bristle, 3-sided" />
          <StepCard step="2" emoji="🟡" title="Pea Dot" desc="Mild fluoride paste" />
          <StepCard step="3" emoji="⬆️" title="Top Teeth" desc="30 seconds, circles" />
          <StepCard step="4" emoji="⬇️" title="Bottom Teeth" desc="30 seconds, circles" />
          <StepCard step="5" emoji="💧" title="Rinse & Spit" desc="Lean over sink" />
          <StepCard step="6" emoji="⭐" title="Well Done!" desc="Reward time!" highlight />
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  emoji,
  title,
  desc,
  highlight = false,
}: {
  step: string;
  emoji: string;
  title: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl liquid-glass border text-center transition-all hover:scale-105 ${
        highlight
          ? "border-emerald-400/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
          : "border-white/10 hover:border-teal-400/30"
      }`}
    >
      <div className="text-2xl mb-2">{emoji}</div>
      <div
        className={`w-5 h-5 mx-auto rounded-full flex items-center justify-center font-mono font-extrabold text-[10px] mb-2 ${
          highlight
            ? "bg-emerald-400 text-slate-950"
            : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
        }`}
      >
        {step}
      </div>
      <div className="font-bold text-white text-xs">{title}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{desc}</div>
    </div>
  );
}
