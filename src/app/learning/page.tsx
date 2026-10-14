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
      {/* Page Header */}
      <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-teal-500/30 bg-gradient-to-r from-teal-950/50 via-slate-900/90 to-indigo-950/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-extrabold mb-3">
              <Film className="w-3.5 h-3.5 text-teal-400" />
              100% On-Site Catchy Video Modules (Saved Locally)
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Visual Learning & Motivational Videos
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Real high-definition video lessons stored directly on our servers. Designed to engage neurodivergent children with joy, clarity, dietary awareness, and heartwarming motivation. No external links or redirects.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> High-Definition Stored Media
            </span>
          </div>
        </div>
      </div>

      {/* Video Category Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTab("brushing")}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
            activeTab === "brushing"
              ? "bg-teal-500/20 border-teal-400/50 shadow-lg shadow-teal-500/20 text-white"
              : "liquid-glass border-white/10 hover:border-white/20 text-slate-300"
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center font-black text-xl">
            🪥
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm">1. Step-by-Step Brushing</div>
            <p className="text-[11px] text-slate-400">Child showing brushing steps with joy</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("diet")}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
            activeTab === "diet"
              ? "bg-amber-500/20 border-amber-400/50 shadow-lg shadow-amber-500/20 text-white"
              : "liquid-glass border-white/10 hover:border-white/20 text-slate-300"
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-xl">
            🍎
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm">2. Diet Motivation: Shiny vs Bugs</div>
            <p className="text-[11px] text-slate-400">Healthy shiny teeth vs bacteria feast</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("blessing")}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
            activeTab === "blessing"
              ? "bg-indigo-500/20 border-indigo-400/50 shadow-lg shadow-indigo-500/20 text-white"
              : "liquid-glass border-white/10 hover:border-white/20 text-slate-300"
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-400/20 text-indigo-300 flex items-center justify-center font-black text-xl">
            🌟
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm">3. God Blesses Joyful Brushers</div>
            <p className="text-[11px] text-slate-400">Cleanliness is Godliness moral story</p>
          </div>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          VIDEO 1: STEP-BY-STEP BRUSHING (STORED MP4)
          ────────────────────────────────────────────────────────────────────── */}
      {activeTab === "brushing" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-teal-500/40 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Video Player */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative rounded-3xl overflow-hidden border border-teal-500/40 shadow-2xl bg-slate-950 aspect-video group">
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
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all hover:bg-black/20"
                    >
                      <div className="w-16 h-16 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-teal-500/50 hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 fill-slate-950 ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Controls Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl liquid-glass border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlay(brushingVideoRef, setIsBrushingPlaying, isBrushingPlaying)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-400 text-slate-950 font-black flex items-center gap-1.5 hover:bg-teal-300 transition-all"
                    >
                      {isBrushingPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                      <span>{isBrushingPlaying ? "Pause" : "Play"}</span>
                    </button>

                    <button
                      onClick={() => restartVideo(brushingVideoRef, setIsBrushingPlaying)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                      title="Restart Video"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleMute(brushingVideoRef, setIsBrushingMuted, isBrushingMuted)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                      title={isBrushingMuted ? "Unmute" : "Mute"}
                    >
                      {isBrushingMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">On-Site MP4</span>
                    <button
                      onClick={() => toggleFullscreen(brushingVideoRef)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-1">
                  <h3 className="font-extrabold text-base text-white">
                    Step-by-Step Brushing: Child Showing Steps with Joy
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This video demonstrates the full, joyful routine from start to finish. Children learn best by visual modeling—watching another child brush happily normalizes the sensory sensations and builds enthusiasm.
                  </p>
                </div>
              </div>

              {/* Right Side Step Markers */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    Video Step Milestones
                  </h4>
                  <span className="text-[11px] text-teal-300 font-bold">Follow Along</span>
                </div>

                <div className="space-y-2.5">
                  {brushSteps.map((s) => (
                    <div
                      key={s.step}
                      className="p-3.5 rounded-2xl liquid-glass border border-white/10 hover:border-teal-400/40 transition-all flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                        {s.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-white">{s.title}</h5>
                          <span className="text-[10px] text-teal-300 font-mono font-bold bg-teal-500/20 px-1.5 py-0.5 rounded">
                            {s.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
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
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/40 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Video Player */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-slate-950 aspect-video group">
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
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all hover:bg-black/20"
                    >
                      <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/50 hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 fill-slate-950 ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Controls Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl liquid-glass border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlay(dietVideoRef, setIsDietPlaying, isDietPlaying)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 hover:bg-amber-300 transition-all"
                    >
                      {isDietPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                      <span>{isDietPlaying ? "Pause" : "Play"}</span>
                    </button>

                    <button
                      onClick={() => restartVideo(dietVideoRef, setIsDietPlaying)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                      title="Restart Video"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleMute(dietVideoRef, setIsDietMuted, isDietMuted)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                      title={isDietMuted ? "Unmute" : "Mute"}
                    >
                      {isDietMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">Dr. Binocs Show</span>
                    <button
                      onClick={() => toggleFullscreen(dietVideoRef)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-1">
                  <h3 className="font-extrabold text-base text-white">
                    Diet Motivation: Shiny Teeth vs. Sugar Bugs (How Cavities Form)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Watch Dr. Binocs explain what happens when we eat healthy foods vs. sugary snacks: bacteria feast on chocolates and sodas, releasing acids that turn teeth black and eat away enamel, until brushing saves the day!
                  </p>
                </div>
              </div>

              {/* Right Side Diet Breakdown */}
              <div className="lg:col-span-5 space-y-4">
                <div className="liquid-glass rounded-2xl p-5 border border-emerald-400/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
                    <Apple className="w-4 h-4" /> 1. Healthy Food = Shiny Teeth!
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>Crunchy Fruits (Apples, Carrots):</strong> Naturally scrub and polish tooth surfaces.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>Milk & Calcium:</strong> Strengthens enamel so bacteria cannot break in.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>Cool Fresh Water:</strong> Washes away acids immediately after meals.</span>
                    </li>
                  </ul>
                </div>

                <div className="liquid-glass rounded-2xl p-5 border border-rose-400/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-extrabold text-xs uppercase tracking-wider">
                    <Candy className="w-4 h-4" /> 2. Sugar Bugs Feast (What Causes Black Teeth)
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
                      <span><strong>Chocolates & Sticky Toffees:</strong> Stick deep inside tooth grooves.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
                      <span><strong>Bacteria Feasting:</strong> Bacteria love sugar! They enjoy the meal and start eating the teeth.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
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
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/40 relative overflow-hidden">
            {/* Story Picker Sub-Tabs */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold text-slate-300">Choose Motivational Story:</span>
              <button
                onClick={() => {
                  setActiveBlessingVideo("cleanliness");
                  setIsBlessingPlaying(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeBlessingVideo === "cleanliness"
                    ? "bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20"
                    : "liquid-glass text-slate-300 hover:text-white border border-white/10"
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
                    ? "bg-indigo-400 text-slate-950 font-black shadow-md shadow-indigo-500/20"
                    : "liquid-glass text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                Story 2: The Magic Toothbrush Adventure
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Video Player */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative rounded-3xl overflow-hidden border border-indigo-500/40 shadow-2xl bg-slate-950 aspect-video group">
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
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all hover:bg-black/20"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/50 hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 fill-slate-950 ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Controls Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl liquid-glass border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlay(blessingVideoRef, setIsBlessingPlaying, isBlessingPlaying)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 hover:bg-amber-300 transition-all"
                    >
                      {isBlessingPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                      <span>{isBlessingPlaying ? "Pause" : "Play"}</span>
                    </button>

                    <button
                      onClick={() => restartVideo(blessingVideoRef, setIsBlessingPlaying)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                      title="Restart Video"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleMute(blessingVideoRef, setIsBlessingMuted, isBlessingMuted)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                      title={isBlessingMuted ? "Unmute" : "Mute"}
                    >
                      {isBlessingMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activeBlessingVideo === "cleanliness" ? "Ted & Zoe Moral Story" : "Bedtime Tale"}
                    </span>
                    <button
                      onClick={() => toggleFullscreen(blessingVideoRef)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-1">
                  <h3 className="font-extrabold text-base text-white">
                    {activeBlessingVideo === "cleanliness"
                      ? "Cleanliness Is Godliness: Moral Story for Children"
                      : "The Magic Toothbrush Adventure: Bedtime Motivation"}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Inspiring animated story teaching children that taking care of their teeth and maintaining body cleanliness is a divine virtue that brings blessings, vibrant health, and peaceful sleep.
                  </p>
                </div>
              </div>

              {/* Right Side Moral Affirmation Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-3xl liquid-glass border border-amber-400/40 bg-gradient-to-b from-amber-950/30 to-indigo-950/30 text-center space-y-4 shadow-xl">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-400 p-0.5 shadow-lg shadow-amber-400/30 flex items-center justify-center text-3xl">
                    🌟
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-2">
                      Divine Blessing & Encouragement
                    </span>
                    <h4 className="text-xl font-black text-white">
                      “Clean Smiles Bring Big Blessings”
                    </h4>
                    <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                      Every time you pick up your brush and care for your teeth morning and night, you are honoring the body given to you. God blesses the little champions who keep their smiles pure, strong, and bright!
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-amber-400/20 italic font-serif text-amber-200 text-xs">
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
