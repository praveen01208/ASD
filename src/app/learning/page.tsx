"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Heart,
  Smile,
  ShieldCheck,
  Award,
  Apple,
  Candy,
  Flame,
  Volume2,
  VolumeX,
  ChevronRight,
  CheckCircle2,
  Sun,
  Star,
  Activity,
  Maximize2,
  Download,
  Film,
  Check,
  Zap,
  Info
} from "lucide-react";

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<"brushing" | "diet" | "blessing">("brushing");
  const [activeBlessingVideo, setActiveBlessingVideo] = useState<"cleanliness" | "magic">("cleanliness");

  // Video Refs
  const brushingVideoRef = useRef<HTMLVideoElement>(null);
  const dietVideoRef = useRef<HTMLVideoElement>(null);
  const blessingVideoRef = useRef<HTMLVideoElement>(null);

  // Playback states
  const [isBrushingPlaying, setIsBrushingPlaying] = useState(false);
  const [isDietPlaying, setIsDietPlaying] = useState(false);
  const [isBlessingPlaying, setIsBlessingPlaying] = useState(false);

  // Mute states
  const [isBrushingMuted, setIsBrushingMuted] = useState(false);
  const [isDietMuted, setIsDietMuted] = useState(false);
  const [isBlessingMuted, setIsBlessingMuted] = useState(false);

  const togglePlay = (ref: React.RefObject<HTMLVideoElement | null>, stateSetter: (val: boolean) => void, currentState: boolean) => {
    if (!ref.current) return;
    if (currentState) {
      ref.current.pause();
      stateSetter(false);
    } else {
      ref.current.play();
      stateSetter(true);
    }
  };

  const restartVideo = (ref: React.RefObject<HTMLVideoElement | null>, stateSetter: (val: boolean) => void) => {
    if (!ref.current) return;
    ref.current.currentTime = 0;
    ref.current.play();
    stateSetter(true);
  };

  const toggleMute = (ref: React.RefObject<HTMLVideoElement | null>, stateSetter: (val: boolean) => void, currentState: boolean) => {
    if (!ref.current) return;
    ref.current.muted = !currentState;
    stateSetter(!currentState);
  };

  const toggleFullscreen = (ref: React.RefObject<HTMLVideoElement | null>) => {
    if (!ref.current) return;
    if (ref.current.requestFullscreen) {
      ref.current.requestFullscreen();
    }
  };

  const brushSteps = [
    {
      step: 1,
      title: "Step 1: Soft Brush & Gentle Paste",
      time: "0:15",
      description: "Apply a small pea-sized dot of mild paste on soft bristles with a joyful smile.",
    },
    {
      step: 2,
      title: "Step 2: Gentle Circles on Front Teeth",
      time: "0:45",
      description: "Brush front smiling surfaces using round, gentle circular motions.",
    },
    {
      step: 3,
      title: "Step 3: Chewing Surfaces (Choo-Choo Train!)",
      time: "1:15",
      description: "Move back and forth like a train across top and bottom chewing molars.",
    },
    {
      step: 4,
      title: "Step 4: Inside Surfaces & Tongue Cleaning",
      time: "1:45",
      description: "Tilt the brush to reach inside surfaces and gently sweep the tongue.",
    },
    {
      step: 5,
      title: "Step 5: Swirl Water & Celebrate Clean Smile",
      time: "2:10",
      description: "Swirl fresh water, spit into the sink, and celebrate sparkling diamond teeth!",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Page Header with Soothing Clinical Setup Image */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D5E8DA] shadow-xs overflow-hidden relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAF1DE] border border-[#8EB69B] text-[#051F20] text-xs font-extrabold mb-2 shadow-2xs">
              <Film className="w-3.5 h-3.5 text-[#235347]" />
              On-Site Stored Video Modules • No External Links
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#051F20] tracking-tight">
              Visual Learning & Motivational Videos
            </h1>
            <p className="text-[#0B2B26] text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
              Real high-definition video modules stored locally. Designed to engage children with ASD through joyful visual modeling, clear dietary cause-and-effect (shiny teeth vs. sugar bugs), and encouraging moral stories.
            </p>
          </div>

          <div className="md:col-span-4">
            <div className="rounded-2xl overflow-hidden border border-[#D5E8DA] shadow-sm aspect-video relative group">
              <img
                src="/images/modern_soothing_dental_clinic.jpg"
                alt="Soothing pediatric dental clinic setup"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051F20]/75 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] text-[#DAF1DE] font-medium">
                  Soothing dental clinic environment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Category Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTab("brushing")}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
            activeTab === "brushing"
              ? "bg-[#DAF1DE] border-[#8EB69B] shadow-xs text-[#051F20] font-bold"
              : "bg-white border-[#D5E8DA] hover:border-[#8EB69B] text-slate-700 shadow-2xs"
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#DAF1DE] border border-[#8EB69B] text-[#235347] flex items-center justify-center font-black text-xl">
            🪥
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm text-[#051F20]">1. Step-by-Step Brushing</div>
            <p className="text-[11px] text-[#163832] font-semibold">Child showing brushing steps with joy</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("diet")}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
            activeTab === "diet"
              ? "bg-amber-50/90 border-amber-300 shadow-xs text-amber-950 font-bold"
              : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs"
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl">
            🍎
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm text-[#051F20]">2. Diet Motivation: Shiny vs Bugs</div>
            <p className="text-[11px] text-[#163832] font-semibold">Healthy shiny teeth vs bacteria feast</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("blessing")}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
            activeTab === "blessing"
              ? "bg-indigo-50/90 border-indigo-300 shadow-xs text-indigo-950 font-bold"
              : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs"
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl">
            🌟
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm text-[#051F20]">3. God Blesses Joyful Brushers</div>
            <p className="text-[11px] text-[#163832] font-semibold">Cleanliness is Godliness moral story</p>
          </div>
        </button>
      </div>


      {/* ──────────────────────────────────────────────────────────────────────
          VIDEO 1: STEP-BY-STEP BRUSHING (STORED MP4)
          ────────────────────────────────────────────────────────────────────── */}
      {activeTab === "brushing" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Video Player */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 aspect-video group">
                  <video
                    ref={brushingVideoRef}
                    src="/videos/brushing_steps.mp4"
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                    onPlay={() => setIsBrushingPlaying(true)}
                    onPause={() => setIsBrushingPlaying(false)}
                  />

                  {/* Overlay Play Button if not playing */}
                  {!isBrushingPlaying && (
                    <div
                      onClick={() => togglePlay(brushingVideoRef, setIsBrushingPlaying, isBrushingPlaying)}
                      className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all hover:bg-slate-950/20"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#235347] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Controls Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#DAF1DE]/30 border border-[#D5E8DA] text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlay(brushingVideoRef, setIsBrushingPlaying, isBrushingPlaying)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                      {isBrushingPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                      <span>{isBrushingPlaying ? "Pause" : "Play"}</span>
                    </button>

                    <button
                      onClick={() => restartVideo(brushingVideoRef, setIsBrushingPlaying)}
                      className="p-1.5 rounded-xl bg-[#DAF1DE]/60 hover:bg-[#DAF1DE] text-[#051F20] transition-colors cursor-pointer"
                      title="Restart Video"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleMute(brushingVideoRef, setIsBrushingMuted, isBrushingMuted)}
                      className="p-1.5 rounded-xl bg-[#DAF1DE]/60 hover:bg-[#DAF1DE] text-[#051F20] transition-colors cursor-pointer"
                      title={isBrushingMuted ? "Unmute" : "Mute"}
                    >
                      {isBrushingMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-[#235347]" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#163832] font-semibold font-mono">On-Site MP4</span>
                    <button
                      onClick={() => toggleFullscreen(brushingVideoRef)}
                      className="p-1.5 rounded-xl bg-[#DAF1DE]/60 hover:bg-[#DAF1DE] text-[#051F20] transition-colors cursor-pointer"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D5E8DA] space-y-1">
                  <h3 className="font-extrabold text-base text-[#051F20]">
                    Step-by-Step Brushing: Child Showing Steps with Joy
                  </h3>
                  <p className="text-xs text-[#0B2B26] leading-relaxed font-medium">
                    This video demonstrates the full, joyful routine from start to finish. Children learn best by visual modeling—watching another child brush happily normalizes the sensory sensations and builds enthusiasm.
                  </p>
                </div>
              </div>

              {/* Right Side Step Markers */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#051F20] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#235347]" />
                    Video Step Milestones
                  </h4>
                  <span className="text-[11px] text-[#235347] font-bold">Follow Along</span>
                </div>

                <div className="space-y-2.5">
                  {brushSteps.map((s) => (
                    <div
                      key={s.step}
                      className="p-3.5 rounded-2xl bg-white border border-[#D5E8DA] hover:border-[#8EB69B] transition-all flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#DAF1DE] border border-[#8EB69B] text-[#051F20] flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                        {s.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-[#051F20]">{s.title}</h5>
                          <span className="text-[10px] text-[#051F20] font-mono font-bold bg-[#DAF1DE] px-1.5 py-0.5 rounded border border-[#8EB69B]">
                            {s.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#0B2B26] mt-0.5 leading-relaxed font-medium">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          VIDEO 2: DIET MOTIVATION (SHINY TEETH VS SUGAR BUGS)
          ────────────────────────────────────────────────────────────────────── */}
      {activeTab === "diet" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Video Player */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 aspect-video group">
                  <video
                    ref={dietVideoRef}
                    src="/videos/diet_motivation.mp4"
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                    onPlay={() => setIsDietPlaying(true)}
                    onPause={() => setIsDietPlaying(false)}
                  />

                  {/* Overlay Play Button if not playing */}
                  {!isDietPlaying && (
                    <div
                      onClick={() => togglePlay(dietVideoRef, setIsDietPlaying, isDietPlaying)}
                      className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all hover:bg-slate-950/20"
                    >
                      <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Controls Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlay(dietVideoRef, setIsDietPlaying, isDietPlaying)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      {isDietPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                      <span>{isDietPlaying ? "Pause" : "Play"}</span>
                    </button>

                    <button
                      onClick={() => restartVideo(dietVideoRef, setIsDietPlaying)}
                      className="p-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors"
                      title="Restart Video"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleMute(dietVideoRef, setIsDietMuted, isDietMuted)}
                      className="p-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors"
                      title={isDietMuted ? "Unmute" : "Mute"}
                    >
                      {isDietMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#163832] font-semibold font-mono">Dr. Binocs Show</span>
                    <button
                      onClick={() => toggleFullscreen(dietVideoRef)}
                      className="p-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <h3 className="font-extrabold text-base text-[#051F20]">
                    Diet Motivation: Shiny Teeth vs. Sugar Bugs (How Cavities Form)
                  </h3>
                  <p className="text-xs text-[#0B2B26] leading-relaxed font-medium">
                    Watch Dr. Binocs explain what happens when we eat healthy foods vs. sugary snacks: bacteria feast on chocolates and sodas, releasing acids that turn teeth black and eat away enamel, until brushing saves the day!
                  </p>
                </div>
              </div>

              {/* Right Side Diet Breakdown */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl p-5 bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                    <Apple className="w-4 h-4 text-emerald-600" /> 1. Healthy Food = Shiny Teeth!
                  </div>
                  <ul className="text-xs text-[#0B2B26] space-y-2 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>Crunchy Fruits (Apples, Carrots):</strong> Naturally scrub and polish tooth surfaces.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>Milk & Calcium:</strong> Strengthens enamel so bacteria cannot break in.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>Cool Fresh Water:</strong> Washes away acids immediately after meals.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl p-5 bg-rose-50/70 border border-rose-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-extrabold text-xs uppercase tracking-wider">
                    <Candy className="w-4 h-4 text-rose-600" /> 2. Sugar Bugs Feast (What Causes Black Teeth)
                  </div>
                  <ul className="text-xs text-[#0B2B26] space-y-2 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                      <span><strong>Chocolates & Sticky Toffees:</strong> Stick deep inside tooth grooves.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                      <span><strong>Bacteria Feasting:</strong> Bacteria love sugar! They enjoy the meal and start eating the teeth.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                      <span><strong>Enamel Breakdown:</strong> Teeth turn black or develop painful holes without brushing.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          VIDEO 3: MOTIVATIONAL (GOD BLESSES JOYFUL BRUSHERS)
          ────────────────────────────────────────────────────────────────────── */}
      {activeTab === "blessing" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
            {/* Story Picker Sub-Tabs */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold text-[#051F20]">Choose Motivational Story:</span>
              <button
                onClick={() => {
                  setActiveBlessingVideo("cleanliness");
                  setIsBlessingPlaying(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeBlessingVideo === "cleanliness"
                    ? "bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                Story 1: Cleanliness is Godliness
              </button>
              <button
                onClick={() => {
                  setActiveBlessingVideo("magic");
                  setIsBlessingPlaying(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeBlessingVideo === "magic"
                    ? "bg-indigo-100 text-indigo-950 border border-indigo-300 shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                Story 2: The Magic Toothbrush Adventure
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Video Player */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 aspect-video group">
                  <video
                    key={activeBlessingVideo}
                    ref={blessingVideoRef}
                    src={
                      activeBlessingVideo === "cleanliness"
                        ? "/videos/god_blessings_cleanliness.mp4"
                        : "/videos/magic_toothbrush.mp4"
                    }
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                    onPlay={() => setIsBlessingPlaying(true)}
                    onPause={() => setIsBlessingPlaying(false)}
                  />

                  {/* Overlay Play Button if not playing */}
                  {!isBlessingPlaying && (
                    <div
                      onClick={() => togglePlay(blessingVideoRef, setIsBlessingPlaying, isBlessingPlaying)}
                      className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all hover:bg-slate-950/20"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Controls Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlay(blessingVideoRef, setIsBlessingPlaying, isBlessingPlaying)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      {isBlessingPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                      <span>{isBlessingPlaying ? "Pause" : "Play"}</span>
                    </button>

                    <button
                      onClick={() => restartVideo(blessingVideoRef, setIsBlessingPlaying)}
                      className="p-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors"
                      title="Restart Video"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleMute(blessingVideoRef, setIsBlessingMuted, isBlessingMuted)}
                      className="p-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors"
                      title={isBlessingMuted ? "Unmute" : "Mute"}
                    >
                      {isBlessingMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-indigo-700" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#163832] font-semibold font-mono">
                      {activeBlessingVideo === "cleanliness" ? "Ted & Zoe Moral Story" : "Bedtime Tale"}
                    </span>
                    <button
                      onClick={() => toggleFullscreen(blessingVideoRef)}
                      className="p-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <h3 className="font-extrabold text-base text-[#051F20]">
                    {activeBlessingVideo === "cleanliness"
                      ? "Cleanliness Is Godliness: Moral Story for Children"
                      : "The Magic Toothbrush Adventure: Bedtime Motivation"}
                  </h3>
                  <p className="text-xs text-[#0B2B26] leading-relaxed font-medium">
                    Inspiring animated story teaching children that taking care of their teeth and maintaining body cleanliness is a divine virtue that brings blessings, vibrant health, and peaceful sleep.
                  </p>
                </div>
              </div>

              {/* Right Side Moral Affirmation Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 to-indigo-50/60 text-center space-y-4 shadow-xs">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-400 p-0.5 shadow-md flex items-center justify-center text-3xl">
                    🌟
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
                      Divine Blessing & Encouragement
                    </span>
                    <h4 className="text-xl font-extrabold text-[#051F20]">
                      “Clean Smiles Bring Big Blessings”
                    </h4>
                    <p className="text-xs text-[#0B2B26] mt-2 leading-relaxed font-medium">
                      Every time you pick up your brush and care for your teeth morning and night, you are honoring the body given to you. God blesses the little champions who keep their smiles pure, strong, and bright!
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-amber-200/70 italic font-serif text-[#051F20] text-xs font-medium shadow-2xs">
                    “Cleanliness is next to godliness. A clean heart and a clean smile bring peace, glowing health, and joyful dreams.”
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
