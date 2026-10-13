"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Activity, Mail, Lock, ArrowRight, Sparkles, ShieldCheck, AlertCircle } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { signInWithEmail, signInAsDemo, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { error } = await signInWithEmail(email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 selection:bg-teal-500 selection:text-white">
      {/* Background glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-md liquid-glass p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/landing" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-teal-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">ASD Oral Care AI</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Caregiver Sign In</h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervised by Dr. Nivrutti Reddy • Pediatric ASD Oral Care
          </p>
        </div>

        {/* Supabase Status Pill */}
        <div className="mb-5 flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 mx-auto w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>{isConfigured ? "Connected to Supabase Auth" : "Local Development Mode Active"}</span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="caregiver@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={signInAsDemo}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-teal-300 hover:text-teal-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Quick Demo Login (Instant Access)
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-5 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-teal-300 hover:text-teal-200 font-bold underline underline-offset-2">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
