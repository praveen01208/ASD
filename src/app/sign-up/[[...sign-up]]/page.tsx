"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUpWithEmail, signInAsDemo, isConfigured } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { error } = await signUpWithEmail(email, password, { full_name: fullName });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      // First time registration: route to the 20 questionnaire baseline intake
      router.push("/onboarding");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#F4FAF6] text-[#0B2B26] selection:bg-[#235347] selection:text-white">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl border border-[#D5E8DA] shadow-xs relative">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/landing" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#DAF1DE] border border-[#8EB69B]/40 flex items-center justify-center p-1.5 shadow-2xs">
              <img src="/asd-logo.png" alt="ASD Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-base tracking-tight text-[#051F20]">ASD Oral Care AI</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-[#051F20] tracking-tight">Create Caregiver Account</h1>
          <p className="text-xs text-[#0B2B26]/70 mt-1">
            Supervised by Dr. Nivrutti Reddy • Clinical ASD Oral Health Protocol
          </p>
        </div>

        {/* Database Status Pill */}
        <div className="mb-5 flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-[#DAF1DE] border border-[#8EB69B] text-[11px] text-[#051F20] mx-auto w-fit font-bold shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#235347]" />
          <span>{isConfigured ? "Connected to Supabase Database" : "Local Development Mode Active"}</span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#051F20] mb-1.5">Caregiver Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8EB69B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] text-[#051F20] placeholder-[#0B2B26]/40 text-xs focus:bg-white focus:outline-none focus:border-[#8EB69B] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#051F20] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8EB69B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="caregiver@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] text-[#051F20] placeholder-[#0B2B26]/40 text-xs focus:bg-white focus:outline-none focus:border-[#8EB69B] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#051F20] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8EB69B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4FAF6] border border-[#D5E8DA] text-[#051F20] placeholder-[#0B2B26]/40 text-xs focus:bg-white focus:outline-none focus:border-[#8EB69B] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#235347] hover:bg-[#163832] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Register & Begin Baseline Intake</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="mt-4 pt-4 border-t border-[#D5E8DA]/60">
          <button
            type="button"
            onClick={signInAsDemo}
            className="w-full py-2.5 rounded-xl bg-[#DAF1DE] hover:bg-[#8EB69B]/30 border border-[#8EB69B] text-[#051F20] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#235347]" />
            <span>Quick Demo Caregiver Access</span>
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-5 text-center text-xs text-[#0B2B26]/70">
          Already registered?{" "}
          <Link href="/sign-in" className="text-[#235347] hover:underline font-bold">
            Sign In to Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
