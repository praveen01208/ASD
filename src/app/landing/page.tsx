"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Activity,
  ShieldCheck,
  Smile,
  Video,
  MessageSquareHeart,
  Phone,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Play,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Stethoscope,
  Award,
  Menu,
  X,
  Star,
} from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const doctorName = "Dr. Nivrutti Reddy";
  const doctorPhone = "+91 77580 22942";
  const doctorWhatsapp =
    "https://wa.me/917758022942?text=" +
    encodeURIComponent(
      "Hello Dr. Nivrutti Reddy, I am inquiring through the ASD Oral Care AI platform regarding pediatric dental care and sensory guidance."
    );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-slate-100 overflow-x-hidden selection:bg-teal-500 selection:text-white">

      {/* ── BACKGROUND VIDEO ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35 }}
          src="/bg.mp4"
        />
        {/* Strong overlay so text is always readable on any device */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/80 via-[#030712]/60 to-[#030712]/95" />
        {/* Ambient glow orbs */}
        <div className="absolute top-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-teal-500/15 rounded-full blur-[100px] sm:blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-500/10 rounded-full blur-[100px] sm:blur-[160px]" />
      </div>

      {/* ── FLOATING WHATSAPP ─────────────────────────────────────────────── */}
      <a
        href={doctorWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Dr. Nivrutti Reddy on WhatsApp"
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-[0_8px_30px_rgba(16,185,129,0.5)] transition-all hover:scale-105 border border-emerald-300/40 text-xs"
      >
        <MessageCircle className="w-4 h-4 fill-slate-950/30 flex-shrink-0" />
        <span className="hidden sm:inline">WhatsApp Dr. Reddy</span>
        <span className="sm:hidden">Dr. Reddy</span>
      </a>

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between border border-white/15 shadow-2xl">
          {/* Brand */}
          <Link href="/landing" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm sm:text-base tracking-tight text-white truncate">
                ASD Oral Care AI
              </div>
              <div className="text-[9px] sm:text-[10px] text-teal-300 font-bold tracking-wider uppercase hidden xs:flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
                Dr. Nivrutti Reddy
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-200">
            <a href="#features" className="px-3 py-1.5 rounded-full hover:text-teal-300 hover:bg-white/5 transition-all">
              Features
            </a>
            <a href="#doctor" className="px-3 py-1.5 rounded-full text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 transition-all font-bold flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5" /> Doctor
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={doctorWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              +91 77580 22942
            </a>

            <Show when="signed-in">
              <Link
                href="/"
                className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 text-xs font-extrabold shadow-md transition-all flex items-center gap-1"
              >
                Dashboard <ArrowRight className="w-3 h-3" />
              </Link>
              <UserButton />
            </Show>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-all hidden sm:block">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-teal-500/30 transition-all whitespace-nowrap">
                  Get Started
                </button>
              </SignUpButton>
            </Show>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 text-slate-200 hover:text-white flex-shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-0 p-4 liquid-glass rounded-2xl border border-white/20 flex flex-col gap-2 text-xs font-bold">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 text-slate-200 rounded-xl hover:bg-white/5">
              Features
            </a>
            <a href="#doctor" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 text-emerald-400 rounded-xl hover:bg-emerald-500/10">
              Dr. Nivrutti Reddy
            </a>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="py-2.5 px-3 text-left text-slate-200 rounded-xl hover:bg-white/5 w-full">
                  Sign In
                </button>
              </SignInButton>
            </Show>
            <a
              href={doctorWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp: +91 77580 22942
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-teal-400/30 text-[11px] sm:text-xs font-extrabold text-teal-300 mb-5 sm:mb-6">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Clinical Pediatric ASD Dentistry · AI-Powered
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] max-w-3xl mx-auto">
          Oral Care Designed for{" "}
          <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            Children with Autism
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          Sensory-calibrated brushing routines, visual social stories, and direct clinical supervision by Dr. Nivrutti Reddy.
        </p>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 font-black text-sm shadow-[0_0_35px_rgba(45,212,191,0.45)] transition-all hover:scale-105 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Start Free — Get Access
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 font-black text-sm shadow-[0_0_35px_rgba(45,212,191,0.45)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </Show>
          <a
            href={doctorWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl liquid-glass hover:bg-emerald-500/15 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 border border-emerald-400/30 transition-all hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-300/20" />
            Consult Dr. Reddy
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> ABA-based protocols</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Sensory-first design</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Clinically supervised</span>
        </div>
      </section>

      {/* ── STATS ROW ────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { value: "20+", label: "Sensory Variables Tracked" },
            { value: "6", label: "Learning Video Modules" },
            { value: "1", label: "Supervising Specialist" },
            { value: "24/7", label: "AI Care Bot Available" },
          ].map((s) => (
            <div key={s.label} className="liquid-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 text-center">
              <div className="text-2xl sm:text-3xl font-black text-teal-300">{s.value}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-1 font-medium leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400">
            Built For Neurodivergent Children
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mt-2 leading-tight">
            Everything a Caregiver Needs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              color: "teal",
              title: "One-Time Onboarding",
              desc: "20 targeted questions asked only on first login — capturing sensory triggers, brushing habits, and food preferences.",
              tag: "One-Time Setup",
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              color: "indigo",
              title: "ASD Care Bot",
              desc: "AI assistant with deep pediatric oral context — helps with brushing resistance, sensory overstimulation, and toothpaste options.",
              tag: "AI-Powered",
              link: "/assistant",
              linkLabel: "Chat with ASD Bot",
            },
            {
              icon: <Video className="w-6 h-6" />,
              color: "cyan",
              title: "Visual Learning Library",
              desc: "Curated ABA-backed videos covering social stories, dentist prep, sensory desensitization, and nutrition.",
              tag: "8 Videos",
              link: "/learning",
              linkLabel: "Open Library",
            },
            {
              icon: <Activity className="w-6 h-6" />,
              color: "violet",
              title: "Daily Hygiene Monitoring",
              desc: "Track brushing streaks, symptom logs, and oral health scores in one dashboard.",
              tag: "Real-time",
            },
            {
              icon: <HeartHandshake className="w-6 h-6" />,
              color: "emerald",
              title: "Personalised Care Plans",
              desc: "AI-generated care protocols adapted to your child's specific sensory profile and treatment history.",
              tag: "Adaptive",
            },
            {
              icon: <MessageSquareHeart className="w-6 h-6" />,
              color: "rose",
              title: "Direct Doctor Access",
              desc: "Instant WhatsApp access to Dr. Nivrutti Reddy for clinical queries, second opinions, and urgent guidance.",
              tag: "Dr. Reddy",
              link: doctorWhatsapp,
              linkLabel: "Chat on WhatsApp",
              external: true,
            },
          ].map((f) => (
            <div
              key={f.title}
              className="liquid-glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className={`w-11 h-11 rounded-2xl bg-${f.color}-500/20 border border-${f.color}-400/40 flex items-center justify-center text-${f.color}-300 mb-4`}>
                  {f.icon}
                </div>
                <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-${f.color}-500/20 text-${f.color}-300 mb-2 border border-${f.color}-500/30`}>
                  {f.tag}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
              </div>
              {f.link && (
                <div className="mt-5 pt-4 border-t border-white/10">
                  {f.external ? (
                    <a
                      href={f.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-bold text-${f.color}-300 hover:text-${f.color}-200 flex items-center gap-1 transition-colors`}
                    >
                      {f.linkLabel} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={f.link}
                      className={`text-xs font-bold text-${f.color}-300 hover:text-${f.color}-200 flex items-center gap-1 transition-colors`}
                    >
                      {f.linkLabel} <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── DOCTOR SECTION ───────────────────────────────────────────────── */}
      <section id="doctor" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-16">
        <div className="liquid-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/40 mb-4">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Supervising Pediatric Dental Specialist
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Supervised by{" "}
                <span className="text-emerald-400">Dr. Nivrutti Reddy</span>
              </h2>

              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Specialized in pediatric and neurodivergent oral health. Parents have direct WhatsApp access for personalized guidance and clinical advice.
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                {[
                  "Evidence-based guidance for oral motor resistance",
                  `Direct WhatsApp: ${doctorPhone}`,
                  "Customized diet strategies for enamel protection",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a
                  href={doctorWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950/30" />
                  WhatsApp Dr. Reddy
                </a>
                <a
                  href={`tel:${doctorPhone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl liquid-glass hover:bg-white/10 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  Call {doctorPhone}
                </a>
              </div>
            </div>

            {/* Doctor Card */}
            <div className="liquid-glass rounded-2xl p-6 border border-white/15 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-500/30 to-teal-400/30 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                <Stethoscope className="w-9 h-9 sm:w-12 sm:h-12" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">{doctorName}</h3>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">Pediatric Special Needs Dental Specialist</p>
                <p className="text-xs text-slate-400 mt-1">Available for caregiver queries & clinical consultation</p>
              </div>
              <div className="w-full p-4 rounded-xl bg-slate-950/60 border border-white/10 text-left">
                <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">Direct Hotline</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">{doctorPhone}</div>
                <div className="text-[11px] text-slate-400 mt-1">Use WhatsApp button below or the floating button anytime.</div>
              </div>
              <a
                href={doctorWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950/30" />
                Open WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/10 px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-left">
            © 2026 ASD Oral Care AI Platform · Supervised by {doctorName} ({doctorPhone})
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-semibold">
            <Show when="signed-in">
              <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="hover:text-white transition-colors">Sign In</button>
              </SignInButton>
            </Show>
            <a
              href={doctorWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              WhatsApp Dr. Reddy <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
