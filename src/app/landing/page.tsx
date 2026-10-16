"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  Phone,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Play,
  ChevronRight,
  MessageCircle,
  Stethoscope,
  Award,
  Menu,
  X,
  Brain,
  Users,
  Calendar,
  FileText,
  Clock,
  Sparkle
} from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@/components/AuthComponents";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const consultantWhatsAppNumber = "7758022942";
  const helplineCallingNumber = "9284046972";

  return (
    <div className="relative min-h-screen w-full bg-[#F4FAF6] text-[#0B2B26] overflow-x-hidden selection:bg-[#DAF1DE] selection:text-[#051F20]">
      {/* ── BACKGROUND VIDEO ─────────────────────────────────────── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ opacity: 0.05, transform: "translateZ(0)" }}
          src="/bg.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4FAF6]/95 via-[#DAF1DE]/25 to-[#F4FAF6]/98" />
      </div>

      {/* ── TOP ANNOUNCEMENT & HELPLINE BAR ─────────────────────────────── */}
      <div className="relative z-10 bg-[#DAF1DE]/90 backdrop-blur-xs border-b border-[#8EB69B]/40 px-4 py-2 text-center text-xs text-[#0B2B26] flex items-center justify-center gap-2">
        <span className="text-[#051F20] font-bold">Dr. Nivrutti Reddy Clinical Protocol:</span>
        <span>Dedicated Pediatric Autism Oral Health System</span>
        <span className="hidden sm:inline text-slate-400">•</span>
        <a href="tel:9284046972" className="hidden sm:inline font-bold text-rose-700 hover:text-rose-800">
          24/7 Helpline: +91 9284046972
        </a>
      </div>

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 bg-white/90 backdrop-blur-md border-b border-[#D5E8DA] shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand with ASD Logo */}
          <Link href="/landing" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#DAF1DE] border border-[#8EB69B] flex items-center justify-center p-1.5 flex-shrink-0 shadow-2xs">
              <img
                src="/asd-logo.png"
                alt="ASD Oral Care Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-base tracking-tight text-[#051F20] truncate">
                ASD Oral Care AI
              </div>
              <div className="text-[10px] text-[#235347] font-bold tracking-wide uppercase">
                Pediatric Autism Oral Health
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-[#163832]">
            <a href="#intake" className="hover:text-[#235347] transition-colors">
              Intake Protocol
            </a>
            <a href="#daily-monitoring" className="hover:text-[#235347] transition-colors">
              Daily Monitoring
            </a>
            <a href="#visual-learning" className="hover:text-[#235347] transition-colors">
              Visual Learning Suite
            </a>
            <a href="#consultants" className="hover:text-[#235347] transition-colors">
              Consultants Panel
            </a>
            <Link href="/helpline" className="text-rose-700 hover:text-rose-800 font-bold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> 9284046972
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Show when="signed-in">
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#163832] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Child Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <UserButton />
            </Show>

            <Show when="signed-out">
              <SignInButton mode="redirect">
                <button className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B2B26] hover:text-[#051F20] hover:bg-[#DAF1DE]/40 transition-all hidden sm:block">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button className="px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#163832] text-white text-xs font-semibold shadow-xs transition-all whitespace-nowrap">
                  Register Caregiver Account
                </button>
              </SignUpButton>
            </Show>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#DAF1DE]/60 text-[#051F20] hover:bg-[#DAF1DE] flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-white rounded-2xl border border-[#D5E8DA] shadow-xl flex flex-col gap-2 text-xs font-medium animate-in fade-in">
            <a href="#intake" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-[#0B2B26] rounded-lg hover:bg-[#DAF1DE]/40 font-medium">
              5-Domain Clinical Intake
            </a>
            <a href="#daily-monitoring" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-[#0B2B26] rounded-lg hover:bg-[#DAF1DE]/40 font-medium">
              Daily Routine Monitoring
            </a>
            <a href="#visual-learning" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-[#0B2B26] rounded-lg hover:bg-[#DAF1DE]/40 font-medium">
              On-Site Visual Learning
            </a>
            <a href="#consultants" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-[#0B2B26] rounded-lg hover:bg-[#DAF1DE]/40 font-medium">
              Specialized Consultants
            </a>
            <Link href="/helpline" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-rose-700 rounded-lg hover:bg-rose-50 flex items-center gap-2 font-bold">
              <Phone className="w-3.5 h-3.5" /> 24/7 Helpline: {helplineCallingNumber}
            </Link>
            <Show when="signed-out">
              <SignInButton mode="redirect">
                <button className="py-2 px-3 text-left text-[#0B2B26] rounded-lg hover:bg-[#DAF1DE]/40 w-full font-medium">
                  Sign In
                </button>
              </SignInButton>
            </Show>
          </div>
        )}
      </nav>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
        {/* Core Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DAF1DE] border border-[#8EB69B] text-xs font-semibold text-[#051F20] mb-6 shadow-2xs">
          <HeartHandshake className="w-3.5 h-3.5 text-[#235347]" />
          <span>“Small steps, consistent routines, healthier smiles.”</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#051F20] leading-[1.18] max-w-4xl mx-auto">
          A Simple, Predictable Digital Space for{" "}
          <span className="text-[#235347]">
            Parents & Caregivers of Children with ASD
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-[#0B2B26] max-w-2xl mx-auto leading-relaxed font-medium">
          Sensory-calibrated brushing desensitization, daily oral telemetry, weekly clinical progress tracking, and direct consultant support designed specifically for children on the autism spectrum.
        </p>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Show when="signed-out">
            <SignUpButton mode="redirect">
              <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>Register & Complete Baseline Intake</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Go to Child Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Show>

          <Link
            href="/helpline"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#DAF1DE]/30 text-[#0B2B26] border border-[#D5E8DA] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <Phone className="w-4 h-4 text-rose-600" />
            <span>24/7 Helpline (+91 {helplineCallingNumber})</span>
          </Link>
        </div>

        {/* Clinical Trust Checkpoints */}
        <div className="mt-8 pt-6 border-t border-[#D5E8DA] flex flex-wrap items-center justify-center gap-6 text-xs text-[#163832] font-bold">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#235347]" /> Step 1: Baseline Assessment (Answered Once)
          </span>
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#235347]" /> Step 2: Daily Oral Checklist (60s Routine)
          </span>
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#235347]" /> Supervised by Dr. Nivrutti Reddy
          </span>
        </div>

        {/* Soothing Clinical Pictures Showcase */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto text-left">
          <div className="rounded-2xl overflow-hidden border border-[#D5E8DA] bg-white shadow-2xs p-2.5 space-y-2 group">
            <div className="rounded-xl overflow-hidden aspect-video relative">
              <img
                src="/images/dental_clinic_chair_care.jpg"
                alt="Gentle pediatric dentist checking child on dental chair"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051F20]/75 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs text-[#DAF1DE] font-semibold">
                  Gentle, Fear-Free Dental Chair Examinations
                </span>
              </div>
            </div>
            <p className="text-xs text-[#0B2B26] px-1 leading-relaxed font-medium">
              Dr. Reddy&apos;s desensitization protocol prepares children with ASD to sit calmly in modern dental chairs with zero panic.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#D5E8DA] bg-white shadow-2xs p-2.5 space-y-2 group">
            <div className="rounded-xl overflow-hidden aspect-video relative">
              <img
                src="/images/modern_soothing_dental_clinic.jpg"
                alt="Soothing pediatric dental clinic room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051F20]/75 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs text-[#DAF1DE] font-semibold">
                  Calming, Sensory-Friendly Clinical Environment
                </span>
              </div>
            </div>
            <p className="text-xs text-[#0B2B26] px-1 leading-relaxed font-medium">
              Soft ambient lighting, pastel walls, and predictable visual cues designed specifically for sensory-sensitive children.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5 CLINICAL INTAKE DOMAINS SECTION ────────────────────────────── */}
      <section id="intake" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-14 border-t border-[#D5E8DA]">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#235347]">
            Intake Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#051F20] mt-1">
            5 Key Domains Answered Once Post-Registration
          </h2>
          <p className="text-xs sm:text-sm text-[#163832] mt-1 max-w-xl mx-auto font-semibold">
            Your responses are stored securely in the clinical database to customize Argus AI and calibrate sensory routines. Never prompted again.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Demographics",
              desc: "Child's name, age, communication style, caregiver contact, and core sensory sensitivities.",
            },
            {
              step: "02",
              title: "Brushing Habits",
              desc: "Frequency, duration, brush type (collis / manual / sonic), paste tolerance, and assistance level.",
            },
            {
              step: "03",
              title: "Dietary Habits",
              desc: "Sugar frequency, healthy meals, food holding in cheeks, and nighttime bottle/milk routines.",
            },
            {
              step: "04",
              title: "Dental & Medical",
              desc: "Past visits, active cavities or tooth pain, bleeding gums, medical conditions, and medications.",
            },
            {
              step: "05",
              title: "Sensory & Behavior",
              desc: "Mouth opening cooperation, sensory aversion triggers, meltdown factors, and effective motivators.",
            },
          ].map((d) => (
            <div
              key={d.title}
              className="bg-white rounded-2xl p-5 border border-[#D5E8DA] shadow-2xs flex flex-col justify-between hover:border-[#8EB69B] transition-colors"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-[#DAF1DE] text-[#051F20] font-mono font-bold text-xs flex items-center justify-center mb-3 border border-[#8EB69B]">
                  {d.step}
                </div>
                <h3 className="text-sm font-bold text-[#051F20] mb-1.5">{d.title}</h3>
                <p className="text-xs text-[#0B2B26] leading-relaxed font-medium">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DAILY MONITORING CHECKLIST OVERVIEW ──────────────────────────── */}
      <section id="daily-monitoring" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-14 border-t border-[#D5E8DA]">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#D5E8DA] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#235347] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#235347]" /> Daily Once Routine Tracking
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#051F20] tracking-tight">
              Child&apos;s Daily Oral Hygiene Checklist
            </h2>
            <p className="text-xs sm:text-sm text-[#0B2B26] leading-relaxed">
              Asked once daily on the dashboard. Records morning and bedtime brushing, dietary sugar/snack balance, and behavioral cooperation. All submissions store directly in the database and feed live telemetry for parent and doctor monitoring.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#163832] font-semibold">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#235347]" /> Morning & Night Tracking</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#235347]" /> Sugar & Sticky Food Risk</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#235347]" /> Sensory Resistance Detection</span>
            </div>
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>View Daily Monitoring Protocol</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ON-SITE STORED VISUAL LEARNING SUITE ─────────────────────────── */}
      <section id="visual-learning" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-14 border-t border-[#D5E8DA]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#235347]">
              Visual Desensitization
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#051F20] mt-1">
              On-Site Visual Learning Videos
            </h2>
            <p className="text-xs sm:text-sm text-[#163832] mt-1 max-w-xl font-semibold">
              Stored directly on the website with zero external links or distractions. Tailored for children on the autism spectrum.
            </p>
          </div>

          <Link
            href="/learning"
            className="px-4 py-2 rounded-xl bg-[#DAF1DE]/40 hover:bg-[#DAF1DE] text-[#051F20] border border-[#D5E8DA] font-semibold text-xs flex items-center gap-1.5 transition-all self-start md:self-auto"
          >
            <Play className="w-3.5 h-3.5 text-[#235347]" />
            <span>Open Video Suite</span>
          </Link>
        </div>

        {/* Featured Child Brushing Inspiration Card */}
        <div className="mb-8 rounded-3xl overflow-hidden border border-[#D5E8DA] bg-white shadow-xs p-3 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 rounded-2xl overflow-hidden aspect-video relative shadow-xs">
              <img
                src="/images/child_happy_brushing.jpg"
                alt="Happy child joyfully brushing teeth"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051F20]/75 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[11px] text-[#DAF1DE] font-semibold">
                  Joyful, fear-free morning routines
                </span>
              </div>
            </div>
            <div className="md:col-span-7 space-y-2">
              <span className="text-xs font-bold text-[#235347] uppercase tracking-wider">
                Visual Modeling Power
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#051F20]">
                Children Learn by Seeing Happy Peers Brush
              </h3>
              <p className="text-xs text-[#0B2B26] leading-relaxed font-medium">
                Neurodivergent children thrive when they observe joyful, relatable peers happily brushing their teeth. Our on-site video suite replaces stress and tantrums with calm curiosity, healthy diet motivation, and positive moral encouragement.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/learning"
                  className="px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Watching Modules</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] shadow-2xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#DAF1DE] border border-[#8EB69B] text-[#051F20] flex items-center justify-center text-sm font-bold mb-3">
                01
              </div>
              <h3 className="text-sm font-bold text-[#051F20] mb-1.5">Step-by-Step Brushing</h3>
              <p className="text-xs text-[#0B2B26] leading-relaxed font-medium">
                Children demonstrating gentle brushing steps to help normalize sensations and build predictable morning and bedtime routines.
              </p>
            </div>
            <Link href="/learning" className="mt-4 pt-3 border-t border-[#D5E8DA] text-xs font-semibold text-[#235347] hover:text-[#051F20] flex items-center gap-1">
              <span>Watch Video</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] shadow-2xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-sm font-bold mb-3">
                02
              </div>
              <h3 className="text-sm font-bold text-[#051F20] mb-1.5">Diet Motivation: Shiny vs. Bugs</h3>
              <p className="text-xs text-[#0B2B26] leading-relaxed font-medium">
                Dr. Binocs explains how bacteria feed on chocolates and soda, and how crunchy healthy fruits keep tooth enamel bright and strong.
              </p>
            </div>
            <Link href="/learning" className="mt-4 pt-3 border-t border-[#D5E8DA] text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1">
              <span>Watch Video</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#D5E8DA] hover:border-[#8EB69B] shadow-2xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#DAF1DE] border border-[#8EB69B] text-[#051F20] flex items-center justify-center text-sm font-bold mb-3">
                03
              </div>
              <h3 className="text-sm font-bold text-[#051F20] mb-1.5">God Blessings & Cleanliness</h3>
              <p className="text-xs text-[#0B2B26] leading-relaxed font-medium">
                An uplifting moral story demonstrating how caring for teeth brings peace, self-respect, and divine blessings for the whole family.
              </p>
            </div>
            <Link href="/learning" className="mt-4 pt-3 border-t border-[#D5E8DA] text-xs font-semibold text-[#235347] hover:text-[#051F20] flex items-center gap-1">
              <span>Watch Video</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONSULTANTS PANEL SECTION ───────────────────────────────────── */}
      <section id="consultants" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-14 border-t border-[#D5E8DA]">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#235347]">
            Multidisciplinary Care
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#051F20] mt-1">
            Specialized ASD Consultant Panel
          </h2>
          <p className="text-xs sm:text-sm text-[#163832] mt-1 max-w-xl mx-auto font-semibold">
            Direct clinical WhatsApp access is exclusively dedicated to consulting our 3 specialized clinical practitioners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. ASD Therapist */}
          <div className="bg-white rounded-2xl p-6 border border-[#D5E8DA] hover:border-[#8EB69B] shadow-2xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-[#235347]" />
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B]">
                Behavior & Sensory
              </span>
              <h3 className="text-base font-bold text-[#051F20] mt-2">ASD Therapist</h3>
              <p className="text-xs text-[#0B2B26] mt-2 leading-relaxed font-medium">
                Tactile oral-motor desensitization, sensory trigger reduction, visual scheduling, and positive reinforcement strategies.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D5E8DA]">
              <a
                href={`https://wa.me/91${consultantWhatsAppNumber}?text=${encodeURIComponent(
                  "Hello, I would like to consult the ASD Therapist regarding sensory desensitization routines."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consult ASD Therapist</span>
              </a>
            </div>
          </div>

          {/* 2. Pediatric Dentist */}
          <div className="bg-white rounded-2xl p-6 border border-[#D5E8DA] hover:border-[#8EB69B] shadow-2xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                Clinical Caries Care
              </span>
              <h3 className="text-base font-bold text-[#051F20] mt-2">Pediatric Dentist</h3>
              <p className="text-xs text-[#0B2B26] mt-2 leading-relaxed font-medium">
                Supervised by Dr. Nivrutti Reddy. Non-foaming fluoride protocols, sensory-adapted mock checkups, and enamel remineralization.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D5E8DA]">
              <a
                href={`https://wa.me/91${consultantWhatsAppNumber}?text=${encodeURIComponent(
                  "Hello, I would like to consult the Pediatric Dentist regarding clinical exams and enamel care."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consult Pediatric Dentist</span>
              </a>
            </div>
          </div>

          {/* 3. Public Health Dentist */}
          <div className="bg-white rounded-2xl p-6 border border-[#D5E8DA] hover:border-[#8EB69B] shadow-2xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B] flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-[#235347]" />
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#DAF1DE] text-[#051F20] border border-[#8EB69B]">
                Prevention & Diet
              </span>
              <h3 className="text-base font-bold text-[#051F20] mt-2">Public Health Dentist</h3>
              <p className="text-xs text-[#0B2B26] mt-2 leading-relaxed font-medium">
                Preventive oral health guidelines, dietary sugar reduction strategies, caregiver coaching, and evidence-based home protocols.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D5E8DA]">
              <a
                href={`https://wa.me/91${consultantWhatsAppNumber}?text=${encodeURIComponent(
                  "Hello, I would like to consult the Public Health Dentist regarding preventive oral care guidelines."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consult Public Health Dentist</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#D5E8DA] px-4 sm:px-8 py-8 bg-white/95 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#163832] font-semibold">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#DAF1DE] border border-[#8EB69B] p-0.5 flex items-center justify-center">
              <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
            </div>
            <span>© 2026 ASD Oral Care Platform • Dr. Nivrutti Reddy • 24/7 Helpline: {helplineCallingNumber}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-semibold">
            <Link href="/helpline" className="text-rose-700 hover:underline">24/7 Helpline</Link>
            <Link href="/consultants" className="text-[#235347] hover:underline">Consultants Panel</Link>
            <Link href="/admin" className="text-[#163832] hover:text-[#051F20] font-bold">Admin Portal</Link>
            <Show when="signed-in">
              <Link href="/" className="text-[#163832] hover:text-[#051F20] font-bold">Dashboard</Link>
            </Show>
          </div>
        </div>
      </footer>
    </div>
  );
}
