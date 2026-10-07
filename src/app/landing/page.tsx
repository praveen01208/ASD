"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Smile, 
  Video, 
  Apple, 
  MessageSquareHeart, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  HeartHandshake, 
  Calendar, 
  Play, 
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Stethoscope,
  Award,
  Zap,
  Menu,
  X
} from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const doctorName = "Dr. Nivrutti Reddy";
  const doctorPhone = "+91 77580 22942";
  const doctorWhatsapp = "https://wa.me/917758022942?text=" + encodeURIComponent(
    "Hello Dr. Nivrutti Reddy, I am inquiring through the ASD Oral Care AI platform regarding pediatric dental care and sensory guidance."
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-slate-100 overflow-x-hidden selection:bg-teal-500 selection:text-white">
      {/* =========================================================================
          BACKGROUND VIDEO - VISIBLE & VIVID UNDER LIQUID GLASS OVERLAYS
          ========================================================================= */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70 scale-100 filter brightness-95 contrast-105"
          src="/bg.mp4"
        />
        {/* Subtle translucent tint that keeps video clearly visible while preserving contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-[#030712]/35 to-[#030712]/85 backdrop-blur-[2px]" />
        
        {/* Glowing liquid ambient spheres */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/20 rounded-full blur-[110px] animate-pulse-glow" />
        <div className="absolute top-2/3 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[130px] animate-pulse-glow" />
      </div>

      {/* =========================================================================
          FLOATING WHATSAPP BUTTON (ALWAYS ACCESSIBLE ON SCROLL)
          ========================================================================= */}
      <aside aria-label="Emergency Doctor Contact" className="fixed bottom-6 right-6 z-50">
        <a
          href={doctorWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-5 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-[0_10px_35px_rgba(16,185,129,0.55),0_0_20px_rgba(16,185,129,0.35)] transition-all hover:scale-105 border border-emerald-300/40 text-xs sm:text-sm"
        >
          <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 fill-slate-950 text-slate-950" />
          </div>
          <span>WhatsApp Dr. Nivrutti Reddy</span>
          <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
        </a>
      </aside>

      {/* =========================================================================
          LIQUID GLASS NAVBAR
          ========================================================================= */}
      <nav aria-label="Main Navigation" className="sticky top-0 z-40 w-full px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto liquid-glass rounded-2xl sm:rounded-full px-5 py-3 flex items-center justify-between border border-white/20 shadow-2xl">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                ASD Oral Care AI
              </div>
              <div className="text-[10px] text-teal-300 font-bold tracking-widest uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                Supervised by {doctorName}
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-200">
            <a href="#about" className="px-3.5 py-1.5 rounded-full hover:text-teal-300 hover:bg-white/5 transition-all">Clinical Approach</a>
            <a href="#features" className="px-3.5 py-1.5 rounded-full hover:text-teal-300 hover:bg-white/5 transition-all">Sensory Features</a>
            <a href="#doctor" className="px-3.5 py-1.5 rounded-full text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 transition-all font-bold flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5" /> Doctor Hotline
            </a>
          </div>

          {/* Actions & Clerk Auth */}
          <div className="flex items-center gap-3">
            <a
              href={doctorWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-300/30" />
              <span>+91 77580 22942</span>
            </a>

            <Show when="signed-in">
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 text-xs font-extrabold shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5"
              >
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <UserButton />
            </Show>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-teal-500/30 transition-all">
                  Get Started
                </button>
              </SignUpButton>
            </Show>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-slate-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 liquid-glass rounded-2xl border border-white/20 flex flex-col gap-3 text-xs font-bold">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-200">Clinical Approach</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-200">Sensory Features</a>
            <a href="#doctor" onClick={() => setMobileMenuOpen(false)} className="py-2 text-emerald-400">Dr. Nivrutti Reddy Contact</a>
            <a
              href={doctorWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp: +91 77580 22942
            </a>
          </div>
        )}
      </nav>

      {/* =========================================================================
          HERO SECTION - BOLD LIQUID GLASS AESTHETICS
          ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-24 text-center">
        {/* Glowing badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-pill border border-teal-400/40 text-xs font-extrabold text-teal-300 mb-6 shadow-[0_0_20px_rgba(20,184,166,0.25)]">
          <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
          <span>Clinical Pediatric ASD Dentistry & AI Guidance</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Sensory-Calibrated <br />
          <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent text-glow-teal">
            Liquid-Glass Oral Care
          </span>{" "}
          for Autism Spectrum
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-md">
          Personalized desensitization protocols, visual brushing schedules, plaque nutrition defense, and immediate clinical supervision by Dr. Nivrutti Reddy.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 font-black text-sm shadow-[0_0_40px_rgba(45,212,191,0.5)] transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Enter Caregiver Platform
          </Link>

          <a
            href={doctorWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl liquid-glass hover:bg-emerald-500/20 text-emerald-300 font-extrabold text-sm flex items-center justify-center gap-2.5 border border-emerald-400/30 transition-all hover:scale-105 shadow-xl"
          >
            <MessageCircle className="w-5 h-5 fill-emerald-300/30" />
            Consult Dr. Reddy (+91 77580 22942)
          </a>
        </div>

        {/* =========================================================================
            FEATURED HERO TELEMETRY CARD (LIQUID GLASS REFRACTION)
            ========================================================================= */}
        <div className="mt-14 max-w-3xl mx-auto liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/20 text-left shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-white">Leo (ASD-001) Telemetry</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Live Synced
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">Mild Touch & Vibration Sensory Profile</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 border border-teal-400/40 text-center">
                <div className="text-xl font-black text-teal-300">78%</div>
                <div className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">Oral Score</div>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-center">
                <div className="text-xl font-black text-emerald-300">5-Day</div>
                <div className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">Streak</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/15">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-teal-300 mb-1">Toothbrush Match</div>
              <div className="text-xs text-white font-bold">3-Sided Soft Manual</div>
              <div className="text-[11px] text-slate-200 mt-1">Eliminates high-pitch vibration trigger</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/15">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 mb-1">Toothpaste Type</div>
              <div className="text-xs text-white font-bold">Non-Foaming Strawberry</div>
              <div className="text-[11px] text-slate-200 mt-1">Prevents strong gag reflex reaction</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/15">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 mb-1">Doctor Support</div>
              <div className="text-xs text-white font-bold">Dr. Nivrutti Reddy</div>
              <div className="text-[11px] text-slate-200 mt-1">Direct WhatsApp verification enabled</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DOCTOR NIVRUTTI REDDY CLINICAL HIGHLIGHT SECTION
          ========================================================================= */}
      <section id="doctor" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 py-16">
        <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 border border-emerald-500/40 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/40 mb-4">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Supervising Pediatric Dental Specialist</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Supervised by <br />
                <span className="text-emerald-400 text-glow-emerald">{doctorName}</span>
              </h2>

              <p className="text-slate-200 text-sm mt-3 leading-relaxed">
                Specialized in pediatric and neurodivergent oral health management. Parents have immediate access to personalized guidance, video desensitization validation, and clinical advice via WhatsApp.
              </p>

              <div className="mt-6 space-y-2.5 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Evidence-based guidance for oral motor resistance</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Direct WhatsApp contact: <strong className="text-white font-mono">{doctorPhone}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Customized diet strategies to prevent rapid enamel erosion</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={doctorWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  Direct WhatsApp Chat
                </a>

                <a
                  href={`tel:${doctorPhone.replace(/\s+/g, '')}`}
                  className="px-5 py-3.5 rounded-xl liquid-glass-pill hover:bg-white/10 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  Call {doctorPhone}
                </a>
              </div>
            </div>

            {/* Doctor Profile Liquid Glass Box */}
            <div className="liquid-glass rounded-2xl p-6 sm:p-8 border border-white/15 flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500/30 to-teal-400/30 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Stethoscope className="w-12 h-12" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{doctorName}</h3>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">Pediatric Special Needs Dental Specialist</p>
                <p className="text-xs text-slate-300 mt-1">Available for caregiver queries & clinical consultation</p>
              </div>

              <div className="w-full p-4 rounded-xl bg-slate-950/60 border border-white/10 text-left space-y-1">
                <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">Direct Hotline</div>
                <div className="text-sm font-mono font-bold text-white">{doctorPhone}</div>
                <div className="text-[11px] text-slate-400">Click below or use the floating button anytime.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SENSORY FEATURES BENTO GRID
          ========================================================================= */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
            Engineered For Neurodivergent Children
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
            Liquid Glass Experience & Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="liquid-glass-card rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">One-Time Initial Onboarding</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                20 targeted questions completed once during first login to capture child sensory triggers, brushing duration, and food pooling habits.
              </p>
            </div>
            <div className="mt-6 text-xs font-bold text-teal-400 flex items-center gap-1">
              One-Time Clinical Setup <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass-card rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 mb-2 border border-indigo-500/30">
                ASD Bot Intelligent Engine
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ASD Care Bot</h3>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal">
                Empathetic chat assistant with deep pediatric oral context for handling brushing resistance, sensory overstimulation, and unflavored toothpaste options.
              </p>
            </div>
            <Link href="/assistant" className="mt-6 text-xs font-bold text-indigo-300 hover:text-indigo-200 flex items-center gap-1 transition-colors">
              Chat with ASD Bot <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="liquid-glass-card rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-5">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Visual Routines & Desensitization</h3>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal">
                Step-by-step visual timers, social stories, and quadrant brushing guides designed specifically for children with ASD.
              </p>
            </div>
            <Link href="/learning" className="mt-6 text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors">
              Open Visual Library <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="relative z-10 border-t border-white/10 max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          © 2026 ASD Oral Care AI Platform • Supervised by {doctorName} ({doctorPhone})
        </div>
        <div className="flex items-center gap-5 font-semibold">
          <Link href="/" className="hover:text-white transition-colors">Platform</Link>
          <a href={doctorWhatsapp} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
            WhatsApp Dr. Reddy <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
