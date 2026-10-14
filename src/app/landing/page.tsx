"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Activity,
  ShieldCheck,
  Smile,
  Video,
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
  Brain,
  Users,
  Headphones,
  Apple
} from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@/components/AuthComponents";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const consultantWhatsAppNumber = "7758022942";
  const helplineCallingNumber = "9284046972";

  const consultantWhatsAppUrl =
    `https://wa.me/91${consultantWhatsAppNumber}?text=` +
    encodeURIComponent(
      "Hello, I am reaching out through the ASD Oral Care platform to consult your specialized clinical panel."
    );

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-slate-100 overflow-x-hidden selection:bg-teal-500 selection:text-white">
      {/* ── OPTIMIZED BACKGROUND AMBIENT ─────────────────────────────────────── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="hidden sm:block absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ opacity: 0.22, transform: "translateZ(0)" }}
          src="/bg.mp4"
        />
        {/* Strong overlay for maximum contrast & zero mobile lag */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/90 via-[#030712]/75 to-[#030712]/98" />
        {/* Ambient glow orbs */}
        <div className="absolute top-0 left-0 w-[260px] sm:w-[450px] h-[260px] sm:h-[450px] bg-teal-500/10 rounded-full blur-[80px] sm:blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[260px] sm:w-[450px] h-[260px] sm:h-[450px] bg-indigo-500/10 rounded-full blur-[80px] sm:blur-[160px]" />
      </div>

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between border border-white/15 shadow-2xl">
          {/* Brand with ASD Logo */}
          <Link href="/landing" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-teal-400/40 flex items-center justify-center p-1 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src="/asd-logo.png"
                alt="ASD Oral Care Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm sm:text-base tracking-tight text-white truncate">
                ASD Oral Care AI
              </div>
              <div className="text-[9px] sm:text-[10px] text-teal-300 font-bold tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
                Pediatric Autism Oral Health
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-200">
            <a href="#features" className="px-3 py-1.5 rounded-full hover:text-teal-300 hover:bg-white/5 transition-all">
              Features
            </a>
            <a href="#stories" className="px-3 py-1.5 rounded-full hover:text-teal-300 hover:bg-white/5 transition-all">
              Visual Learning
            </a>
            <Link href="/helpline" className="px-3 py-1.5 rounded-full text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-all font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Helpline: {helplineCallingNumber}
            </Link>
            <a href="#consultants" className="px-3 py-1.5 rounded-full text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 transition-all font-bold flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5" /> Consultants
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/helpline"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all"
            >
              <Phone className="w-3 h-3" />
              Call: {helplineCallingNumber}
            </Link>

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
          <div className="md:hidden mt-2 p-4 liquid-glass rounded-2xl border border-white/20 flex flex-col gap-2 text-xs font-bold animate-in fade-in">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 text-slate-200 rounded-xl hover:bg-white/5">
              Features
            </a>
            <a href="#stories" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 text-slate-200 rounded-xl hover:bg-white/5">
              Visual Learning & Videos
            </a>
            <Link href="/helpline" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 text-rose-300 rounded-xl hover:bg-rose-500/10 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Helpline: {helplineCallingNumber}
            </Link>
            <a href="#consultants" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 text-emerald-400 rounded-xl hover:bg-emerald-500/10 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" /> Specialized Consultants
            </a>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="py-2.5 px-3 text-left text-slate-200 rounded-xl hover:bg-white/5 w-full">
                  Sign In / Register
                </button>
              </SignInButton>
            </Show>
          </div>
        )}
      </nav>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-14 sm:pb-20 text-center">
        {/* Core Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-teal-400/40 text-xs sm:text-sm font-extrabold text-teal-300 mb-6 shadow-lg shadow-teal-500/10">
          <Sparkles className="w-4 h-4 text-teal-400" />
          “Small steps, consistent routines, healthier smiles.”
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] max-w-4xl mx-auto text-white">
          A Simple, Predictable Digital Space for{" "}
          <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            Parents & Caregivers of Children with ASD
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Sensory-calibrated brushing desensitization, weekly AI assessments, interactive diet stories, and direct helpline support to make daily oral hygiene joyful and stress-free.
        </p>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 font-black text-sm shadow-[0_0_35px_rgba(45,212,191,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Free Account & Start
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Link
              href="/"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 font-black text-sm shadow-[0_0_35px_rgba(45,212,191,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Go to Child Dashboard
            </Link>
          </Show>

          <Link
            href="/helpline"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl liquid-glass hover:bg-rose-500/15 text-rose-300 font-bold text-sm flex items-center justify-center gap-2 border border-rose-400/30 transition-all hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            24/7 Helpline ({helplineCallingNumber})
          </Link>
        </div>

        {/* Clinical trust pill badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> 5-Domain Clinical Intake</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Weekly AI Progress Tracker</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Admin & Multi-Account Access</span>
        </div>
      </section>

      {/* ── 5 CLINICAL INTAKE DOMAINS SECTION ────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <div className="text-center mb-10">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400">
            Comprehensive Assessment
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
            5 Key Domains Answered Post-Registration
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl mx-auto">
            All submitted baseline information is securely stored to calibrate sensory desensitization routines and weekly AI progress.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            {
              step: "1",
              title: "Demographic Details",
              desc: "Child's name, age, communication level, primary caregiver & sensory sensitivities.",
              accent: "teal",
            },
            {
              step: "2",
              title: "Brushing Habits",
              desc: "Daily frequency, duration, toothbrush type, paste preference & assistance level.",
              accent: "cyan",
            },
            {
              step: "3",
              title: "Dietary Habits",
              desc: "Sugary food frequency, fruits, food holding in cheeks & night feeding/bottle.",
              accent: "amber",
            },
            {
              step: "4",
              title: "Dental & Medical",
              desc: "Past visits, cavities, tooth pain, bleeding gums, allergies & medications.",
              accent: "indigo",
            },
            {
              step: "5",
              title: "Child Behaviour",
              desc: "Mouth opening tolerance, meltdown triggers, routine adherence & motivators.",
              accent: "emerald",
            },
          ].map((d) => (
            <div
              key={d.title}
              className="liquid-glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 font-black text-xs flex items-center justify-center mb-3">
                  {d.step}
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{d.title}</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATCHY VISUAL STORIES & VIDEOS SECTION ──────────────────────── */}
      <section id="stories" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-10 border border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400">
                Stored On-Site • No Broken Links
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Catchy Interactive Visual Stories & Videos
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Fun, motivating animations that explain healthy enamel vs sugar bugs and teach joyful step-by-step routines.
              </p>
            </div>

            <Link
              href="/learning"
              className="px-5 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 whitespace-nowrap transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Play Interactive Stories
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="liquid-glass rounded-2xl p-5 border border-white/15">
              <div className="text-2xl mb-2">🪥✨</div>
              <h3 className="font-bold text-sm text-white">Step-by-Step Brushing</h3>
              <p className="text-xs text-slate-300 mt-1">
                A cheerful child demonstrates joyful brushing steps with 2-minute visual sequencing and star rewards.
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/15">
              <div className="text-2xl mb-2">🍎👾</div>
              <h3 className="font-bold text-sm text-white">Diet Motivation: Sparkle vs Sugar Bugs</h3>
              <p className="text-xs text-slate-300 mt-1">
                Healthy crunchy foods make teeth diamond shiny; sugary chocolates invite sugar bugs until you brush them away!
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/15">
              <div className="text-2xl mb-2">🌟🙏</div>
              <h3 className="font-bold text-sm text-white">The Blessing of Bright Smiles</h3>
              <p className="text-xs text-slate-300 mt-1">
                Heartwarming affirmations explaining how caring for teeth brings divine blessings, good health, and proud families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSULTANTS PANEL SECTION ───────────────────────────────────── */}
      <section id="consultants" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-14">
        <div className="text-center mb-10">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
            Multidisciplinary Clinical Care
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Specialized ASD Consultant Panel
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl mx-auto">
            Direct clinical WhatsApp access is exclusively dedicated to consulting our 3 specialized practitioners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. ASD Therapist */}
          <div className="liquid-glass-card rounded-3xl p-6 border border-teal-500/30 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                Behavior & Sensory
              </span>
              <h3 className="text-lg font-black text-white mt-2">ASD Therapist</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Oral-motor tactile desensitization, sensory trigger reduction, visual schedule conditioning, and behavioral positive reinforcement.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <a
                href={`https://wa.me/91${consultantWhatsAppNumber}?text=${encodeURIComponent(
                  "Hello, I would like to consult the ASD Therapist regarding sensory desensitization routines."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-500/20"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                WhatsApp ASD Therapist
              </a>
            </div>
          </div>

          {/* 2. Pediatric Dentist */}
          <div className="liquid-glass-card rounded-3xl p-6 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Special Needs Clinical Care
              </span>
              <h3 className="text-lg font-black text-white mt-2">Pediatric Dentist</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Clinical caries assessment, non-foaming fluoride protocols, gentle sensory-adapted mock checkups, and enamel remineralization.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <a
                href={`https://wa.me/91${consultantWhatsAppNumber}?text=${encodeURIComponent(
                  "Hello, I would like to consult the Pediatric Dentist regarding clinical exams and enamel care."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                WhatsApp Pediatric Dentist
              </a>
            </div>
          </div>

          {/* 3. Public Health Dentist */}
          <div className="liquid-glass-card rounded-3xl p-6 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold mb-4">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Prevention & Nutrition
              </span>
              <h3 className="text-lg font-black text-white mt-2">Public Health Dentist</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Preventive oral health guidelines, dietary sugar reduction strategies, caregiver coaching, and evidence-based home protocols.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <a
                href={`https://wa.me/91${consultantWhatsAppNumber}?text=${encodeURIComponent(
                  "Hello, I would like to consult the Public Health Dentist regarding preventive oral care guidelines."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                WhatsApp Public Health Dentist
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/10 px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <img src="/asd-logo.png" alt="ASD Logo" className="w-6 h-6 object-contain" />
            <span>© 2026 ASD Oral Care AI Platform • Helpline: {helplineCallingNumber}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-semibold">
            <Link href="/helpline" className="text-rose-300 hover:underline">24/7 Helpline</Link>
            <Link href="/consultants" className="text-emerald-300 hover:underline">Consultants Panel</Link>
            <Link href="/admin" className="text-amber-300 hover:underline">Admin Portal</Link>
            <Show when="signed-in">
              <Link href="/" className="hover:text-white">Dashboard</Link>
            </Show>
          </div>
        </div>
      </footer>
    </div>
  );
}
