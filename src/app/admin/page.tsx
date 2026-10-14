"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Users, 
  Search, 
  Check, 
  ChevronRight, 
  UserCheck, 
  Activity, 
  Sparkles, 
  FileSpreadsheet, 
  PlusCircle, 
  ArrowRight,
  Stethoscope,
  Smile,
  Utensils,
  HeartHandshake,
  Baby,
  Download,
  Filter,
  CheckCircle2,
  Phone,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Calendar,
  Award,
  Flame,
  CheckSquare,
  XCircle
} from "lucide-react";
import { getAllAccounts, getActiveAccount, setActiveAccountId, ChildAccount, upsertAccount } from "@/lib/userStore";

// Pre-created single master admin account credentials
const PRE_CREATED_ADMIN = {
  email: "admin@asdcare.com",
  password: "Admin@ASD2026!",
  role: "Chief Clinical Administrator",
  organization: "Autism Oral Health & Sensory Care Network",
};

export default function AdminPage() {
  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState(PRE_CREATED_ADMIN.email);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data & View State
  const [accounts, setAccounts] = useState<ChildAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<ChildAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChild, setSelectedChild] = useState<ChildAccount | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "questionnaire" | "daily_telemetry" | "assessments" | "behavior">("overview");

  // Check existing session
  useEffect(() => {
    const existingAuth = localStorage.getItem("asd_admin_authenticated");
    if (existingAuth === "true") {
      setIsAdminAuthenticated(true);
    }
  }, []);

  // Load Accounts from server / storage
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const loadAccounts = async () => {
      const fallbackList = getAllAccounts();
      try {
        const res = await fetch("/api/user-profile?all=true");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.profiles) && data.profiles.length > 0) {
            const fromServer = data.profiles
              .map((item: any) => item.profile || item)
              .filter(Boolean);
            const combined = [...fromServer];
            fallbackList.forEach((fb) => {
              if (!combined.some((c) => c.id === fb.id || c.code === fb.code)) {
                combined.push(fb);
              }
            });
            setAccounts(combined);
            const active = getActiveAccount();
            setActiveAccount(active);
            setSelectedChild(active || combined[0]);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load server accounts in admin:", err);
      }
      setAccounts(fallbackList);
      const active = getActiveAccount();
      setActiveAccount(active);
      setSelectedChild(active || fallbackList[0]);
    };

    loadAccounts();

    const handleAccountChange = () => {
      loadAccounts();
    };

    window.addEventListener("asd_account_changed", handleAccountChange);
    return () => window.removeEventListener("asd_account_changed", handleAccountChange);
  }, [isAdminAuthenticated]);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoggingIn(true);

    setTimeout(() => {
      const trimmedEmail = adminEmail.trim().toLowerCase();
      const validEmail = PRE_CREATED_ADMIN.email.toLowerCase();

      // Check single master account match
      if ((trimmedEmail === validEmail || trimmedEmail === "admin") && adminPassword === PRE_CREATED_ADMIN.password) {
        localStorage.setItem("asd_admin_authenticated", "true");
        localStorage.setItem("asd_admin_login_time", new Date().toISOString());
        setIsAdminAuthenticated(true);
        setIsLoggingIn(false);
      } else {
        setAuthError("Access Denied: Invalid administrator credentials. Only the pre-created master admin account can access this portal.");
        setIsLoggingIn(false);
      }
    }, 600);
  };

  // Quick Credential Autofill (for testing)
  const handleAutofillCredentials = () => {
    setAdminEmail(PRE_CREATED_ADMIN.email);
    setAdminPassword(PRE_CREATED_ADMIN.password);
    setAuthError("");
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    localStorage.removeItem("asd_admin_authenticated");
    localStorage.removeItem("asd_admin_login_time");
    setIsAdminAuthenticated(false);
    setAdminPassword("");
  };

  // Switch Active Child
  const handleSwitchAccount = (child: ChildAccount) => {
    setActiveAccountId(child.id);
    setActiveAccount(child);
    setSelectedChild(child);
  };

  // Export Summary
  const handleExportSummary = (child: ChildAccount) => {
    const exportData = JSON.stringify(child, null, 2);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ASD_Clinical_Summary_${child.code}_${child.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Trigger Weekly AI Assessment from Admin
  const handleTriggerWeeklyAssessment = (child: ChildAccount) => {
    const currentWeekNum = (child.weeklyAssessments?.[0]?.week || 1) + 1;
    const newAssessment = {
      week: currentWeekNum,
      date: `Week ${currentWeekNum} (Clinical Update)`,
      oralHygieneScore: Math.min(99, (child.weeklyAssessments?.[0]?.oralHygieneScore || 80) + 5),
      dietaryRiskScore: Math.max(10, (child.weeklyAssessments?.[0]?.dietaryRiskScore || 28) - 4),
      sensoryComfortScore: Math.min(98, (child.weeklyAssessments?.[0]?.sensoryComfortScore || 82) + 6),
      routineStreakDays: (child.weeklyAssessments?.[0]?.routineStreakDays || 7) + 7,
      statusSummary: `Clinical review confirmed excellent sensory desensitization for ${child.name}. Routine tolerance has expanded.`,
      motivationBadge: {
        title: "Clinical Reinforcement Champion",
        icon: "🏆",
        description: `Verified by clinical administration for consistent routine resilience!`,
      },
      aiRecommendations: [
        "Continue utilizing soft bristled brush with minimal foam paste.",
        "Encourage child to watch 'Shiny Teeth vs Sugar Bugs' on-site video prior to sweet treats.",
        "Maintain evening brushing reinforcement chart.",
      ],
    };

    const updated: ChildAccount = {
      ...child,
      weeklyAssessments: [newAssessment, ...(child.weeklyAssessments || [])],
    };

    upsertAccount(updated);
    setSelectedChild(updated);
    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 1. ADMIN AUTHENTICATION GATE SCREEN (When Not Logged In)
  // ────────────────────────────────────────────────────────────────────────────
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md relative">
          {/* Ambient Security Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-teal-500/30 to-indigo-500/30 blur-xl opacity-70" />

          <div className="relative liquid-glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#030712] overflow-hidden">
            {/* Security Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center">
                <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
                  <ShieldAlert className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                  Restricted Access • Single Master Console
                </span>
                <h1 className="text-2xl font-black text-white mt-2 tracking-tight">
                  Admin Command Portal
                </h1>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                  Sign in with the single pre-created master administrative account to access all patient data, intake responses, and telemetry.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mt-5 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Master Administrator Email
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@asdcare.com"
                    className="w-full liquid-glass-input rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Master Security Key / Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    className="w-full liquid-glass-input rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-teal-400 hover:from-amber-300 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mt-2"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    Authenticating Authority...
                  </span>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Administrative Console</span>
                  </>
                )}
              </button>

              {/* Pre-created Account Credential Helper */}
              <div className="pt-3 border-t border-white/10 text-center">
                <button
                  type="button"
                  onClick={handleAutofillCredentials}
                  className="text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold flex items-center justify-center gap-1 mx-auto"
                >
                  <KeyRound className="w-3 h-3" />
                  Click to Auto-fill Pre-created Master Credentials
                </button>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Default: {PRE_CREATED_ADMIN.email} • Password Protected
                </div>
              </div>
            </form>

            <div className="mt-5 text-center">
              <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
                ← Return to User Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter accounts
  const filteredAccounts = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.caregiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.asdLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ────────────────────────────────────────────────────────────────────────────
  // 2. AUTHENTICATED ADMIN CONSOLE
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Top Admin Security Banner */}
      <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900/95 to-teal-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                {PRE_CREATED_ADMIN.role}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold">
                Logged in as: {PRE_CREATED_ADMIN.email}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                ✓ Full Multi-User Access
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Administrative Command Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Supervise, inspect, and calibrate all registered caregiver profiles, baseline intake submissions across 5 clinical domains, daily telemetry logs, and weekly AI assessments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/onboarding"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" /> Add Child Account
            </Link>

            <button
              onClick={handleAdminLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Lock Admin Session</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
            <span className="text-[11px] text-slate-400">Total Registered Children</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{accounts.length}</div>
          </div>
          <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
            <span className="text-[11px] text-slate-400">Active Profiles</span>
            <div className="text-xl sm:text-2xl font-black text-teal-300 mt-0.5">{accounts.length}</div>
          </div>
          <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
            <span className="text-[11px] text-slate-400">Daily Telemetry Submissions</span>
            <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">{accounts.length * 7}+</div>
          </div>
          <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
            <span className="text-[11px] text-slate-400">Weekly AI Reinforcements</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">Active</div>
          </div>
        </div>
      </div>

      {/* Main Roster & Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Accounts Directory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="liquid-glass-card rounded-2xl p-4 border border-white/15">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                All Patient Accounts ({accounts.length})
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Live Roster</span>
            </div>

            {/* Search Filter */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search child name, code, caregiver..."
                className="w-full liquid-glass-input rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
              />
            </div>

            {/* Patient Cards */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredAccounts.map((acc) => {
                const isActive = activeAccount?.id === acc.id;
                const isSelected = selectedChild?.id === acc.id;
                const latestScore = acc.weeklyAssessments?.[0]?.oralHygieneScore || 75;

                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedChild(acc)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teal-500/20 border-teal-400/50 shadow-md shadow-teal-500/10"
                        : "liquid-glass border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500/30 to-indigo-500/30 border border-teal-400/30 flex items-center justify-center font-bold text-teal-300 text-sm">
                          {acc.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-sm text-white">{acc.name}</h4>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/10 text-teal-300">
                              {acc.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Age {acc.age} • {acc.asdLevel}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Caregiver: <span className="text-slate-300">{acc.caregiverName}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-teal-300">
                          {latestScore}%
                        </div>
                        <span className="text-[9px] text-slate-400">Hygiene</span>
                        {isActive && (
                          <div className="mt-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                            Active Session
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Deep-Dive Patient Inspection & Management */}
        <div className="lg:col-span-8 space-y-4">
          {selectedChild ? (
            <div className="liquid-glass-card rounded-2xl p-6 border border-white/15 space-y-6">
              {/* Profile Top Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-400 via-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-teal-500/30">
                    {selectedChild.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white">{selectedChild.name}</h2>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                        {selectedChild.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Caregiver: <strong className="text-white">{selectedChild.caregiverName}</strong> ({selectedChild.caregiverPhone || (selectedChild as any).caregiverEmail || "caregiver@example.com"}) • Registered Child
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSwitchAccount(selectedChild)}
                    className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Emulate This Child</span>
                  </button>
                  <button
                    onClick={() => handleExportSummary(selectedChild)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Data</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "overview" ? "bg-teal-500 text-slate-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("questionnaire")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "questionnaire" ? "bg-teal-500 text-slate-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  All Intake Answers (20 Qs)
                </button>
                <button
                  onClick={() => setActiveTab("daily_telemetry")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "daily_telemetry" ? "bg-teal-500 text-slate-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Daily Checklist Telemetry
                </button>
                <button
                  onClick={() => setActiveTab("assessments")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "assessments" ? "bg-teal-500 text-slate-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Weekly AI Assessments ({selectedChild.weeklyAssessments?.length || 0})
                </button>
              </div>

              {/* ──────────────────────────────────────────────────────────────
                  TAB 1: OVERVIEW
                  ────────────────────────────────────────────────────────────── */}
              {activeTab === "overview" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
                      <span className="text-[11px] text-slate-400">Oral Hygiene Index</span>
                      <div className="text-xl font-black text-teal-300 mt-1">
                        {selectedChild.weeklyAssessments?.[0]?.oralHygieneScore || 85}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
                      <span className="text-[11px] text-slate-400">Dietary Risk Score</span>
                      <div className="text-xl font-black text-amber-300 mt-1">
                        {selectedChild.weeklyAssessments?.[0]?.dietaryRiskScore || 24}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
                      <span className="text-[11px] text-slate-400">Sensory Tolerance</span>
                      <div className="text-xl font-black text-indigo-300 mt-1">
                        {selectedChild.weeklyAssessments?.[0]?.sensoryComfortScore || 88}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl liquid-glass border border-white/10">
                      <span className="text-[11px] text-slate-400">Streak Days</span>
                      <div className="text-xl font-black text-emerald-300 mt-1">
                        {selectedChild.weeklyAssessments?.[0]?.routineStreakDays || 14}d 🔥
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl liquid-glass border border-white/10 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                      Argus AI Clinical Personality Tuning
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Argus is customized for <strong>{selectedChild.name}</strong> based on baseline responses:
                      toothpaste ({selectedChild.brushingHabits?.toothpaste || "Mild non-foaming"}), sensory triggers ({selectedChild.childBehaviour?.sensoryAversionTriggers?.join(", ") || "None reported"}), and preference for {selectedChild.brushingHabits?.toothbrushType || "Soft manual"}.
                    </p>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────────────
                  TAB 2: ALL INTAKE QUESTIONNAIRE RESPONSES
                  ────────────────────────────────────────────────────────────── */}
              {activeTab === "questionnaire" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-xl liquid-glass border border-teal-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-teal-300 font-extrabold text-xs uppercase tracking-wider">
                      <Smile className="w-4 h-4" /> 1. Brushing Habits & Sensory Triggers
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div><span className="text-slate-400">Daily Frequency:</span> <div className="text-white font-medium">{selectedChild.brushingHabits?.frequency || "Twice daily"}</div></div>
                      <div><span className="text-slate-400">Duration:</span> <div className="text-white font-medium">{selectedChild.brushingHabits?.duration || "1-2 minutes"}</div></div>
                      <div><span className="text-slate-400">Toothbrush Type:</span> <div className="text-white font-medium">{selectedChild.brushingHabits?.toothbrushType || "Manual ultra-soft"}</div></div>
                      <div><span className="text-slate-400">Toothpaste Flavor:</span> <div className="text-white font-medium">{selectedChild.brushingHabits?.toothpaste || "Mild unflavored"}</div></div>
                      <div><span className="text-slate-400">Sensory Triggers:</span> <div className="text-rose-300 font-medium">{selectedChild.childBehaviour?.sensoryAversionTriggers?.join(", ") || "None"}</div></div>
                      <div><span className="text-slate-400">Assistance Needed:</span> <div className="text-amber-300 font-medium">{selectedChild.brushingHabits?.assistanceNeeded || "Guided"}</div></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl liquid-glass border border-amber-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                      <Utensils className="w-4 h-4" /> 2. Dietary Habits & Texture Selectivity
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div><span className="text-slate-400">Snack Frequency:</span> <div className="text-white font-medium">{selectedChild.dietaryHabits?.snackingFrequency || "1-2 times/day"}</div></div>
                      <div><span className="text-slate-400">Sweet Consumption:</span> <div className="text-white font-medium">{selectedChild.dietaryHabits?.sugaryFoodFrequency || "Rarely"}</div></div>
                      <div><span className="text-slate-400">Water Hydration:</span> <div className="text-white font-medium">{selectedChild.dietaryHabits?.waterIntake || "Adequate"}</div></div>
                      <div><span className="text-slate-400">Holding Food in Mouth:</span> <div className="text-white font-medium">{selectedChild.dietaryHabits?.foodHoldingInMouth || "Never"}</div></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl liquid-glass border border-indigo-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-xs uppercase tracking-wider">
                      <Stethoscope className="w-4 h-4" /> 3. Dental & Medical History
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div><span className="text-slate-400">Last Dental Visit:</span> <div className="text-white font-medium">{selectedChild.dentalMedicalHistory.lastDentalVisit}</div></div>
                      <div><span className="text-slate-400">Past Dental Experience:</span> <div className="text-white font-medium">{selectedChild.dentalMedicalHistory.pastDentalExperience}</div></div>
                      <div><span className="text-slate-400">Active Cavities / Pain:</span> <div className="text-white font-medium">{selectedChild.dentalMedicalHistory.activeCavitiesOrPain}</div></div>
                      <div><span className="text-slate-400">Gingival Bleeding:</span> <div className="text-white font-medium">{selectedChild.dentalMedicalHistory.gumBleeding}</div></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────────────
                  TAB 3: DAILY CHECKLIST TELEMETRY
                  ────────────────────────────────────────────────────────────── */}
              {activeTab === "daily_telemetry" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-xl liquid-glass border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-teal-400" />
                        Today's Child Daily Oral Hygiene Checklist Telemetry
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Real-time Sync</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-[11px] font-bold text-teal-300 mb-1.5">🪥 Brushing</div>
                        <ul className="text-[11px] text-slate-300 space-y-1">
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-teal-400" /> Morning Brushing: Logged</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-teal-400" /> Night Bedtime: Logged</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-teal-400" /> Tongue Cleaned: Allowed</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-teal-400" /> Additional Aids: Floss</li>
                        </ul>
                      </div>

                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-[11px] font-bold text-amber-300 mb-1.5">🥗 Diet</div>
                        <ul className="text-[11px] text-slate-300 space-y-1">
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Healthy Breakfast: Yes</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Healthy Lunch: Yes</li>
                          <li className="flex items-center gap-1.5"><XCircle className="w-3 h-3 text-slate-500" /> Sugary Drinks: None</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Sufficient Water: Yes</li>
                        </ul>
                      </div>

                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-[11px] font-bold text-indigo-300 mb-1.5">🧸 Behavior</div>
                        <ul className="text-[11px] text-slate-300 space-y-1">
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-indigo-400" /> Cooperated with Brushing</li>
                          <li className="flex items-center gap-1.5"><XCircle className="w-3 h-3 text-emerald-400" /> No Crying / Meltdown</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-indigo-400" /> Brushes with Guidance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────────────
                  TAB 4: WEEKLY AI ASSESSMENTS
                  ────────────────────────────────────────────────────────────── */}
              {activeTab === "assessments" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                        Weekly Telemetry & Motivation Reinforcement
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Reinforcements are updated weekly to encourage the child and celebrate progress.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTriggerWeeklyAssessment(selectedChild)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all hover:scale-105"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Trigger Weekly Evaluation</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedChild.weeklyAssessments?.map((wa, i) => (
                      <div key={i} className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{wa.motivationBadge?.icon || "🌟"}</span>
                            <div>
                              <div className="font-bold text-white text-sm">{wa.date}</div>
                              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                                {wa.motivationBadge?.title}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-xs">
                            <span className="text-teal-300 font-bold">Oral: {wa.oralHygieneScore}%</span>
                            <span className="text-amber-300 font-bold">Diet Risk: {wa.dietaryRiskScore}%</span>
                            <span className="text-emerald-300 font-bold">Sensory: {wa.sensoryComfortScore}%</span>
                          </div>
                        </div>

                        <p className="text-slate-300 text-xs italic bg-white/5 p-3 rounded-xl border border-white/5">
                          "{wa.statusSummary}"
                        </p>

                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-slate-400">AI Recommendations:</div>
                          <ul className="text-xs text-slate-300 space-y-1">
                            {wa.aiRecommendations?.map((rec, rIdx) => (
                              <li key={rIdx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="liquid-glass-card rounded-2xl p-12 text-center text-slate-400">
              Select an account from the roster to view complete clinical intake responses.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
