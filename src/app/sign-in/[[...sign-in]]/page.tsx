"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#080D1A] text-slate-100 selection:bg-teal-600 selection:text-white">
      <div className="w-full max-w-md bg-[#0F172A] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl relative">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/landing" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1.5 shadow-sm">
              <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">ASD Oral Care AI</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Caregiver Sign In</h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervised by Dr. Nivrutti Reddy • Pediatric ASD Oral Care Portal
          </p>
        </div>

        {/* Database Status Pill */}
        <div className="mb-5 flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 mx-auto w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>{isConfigured ? "Connected to Supabase Database" : "Local Development Mode Active"}</span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500 transition-all"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={signInAsDemo}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Quick Demo Caregiver Access</span>
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-5 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-teal-400 hover:underline font-semibold">
            Register Caregiver Account
          </Link>
        </div>
      </div>
    </div>
  );
}
