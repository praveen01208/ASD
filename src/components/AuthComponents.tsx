"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon, Shield, ChevronDown } from "lucide-react";

export function Show({
  when,
  children,
}: {
  when: "signed-in" | "signed-out";
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (when === "signed-in" && isSignedIn) {
    return <>{children}</>;
  }

  if (when === "signed-out" && !isSignedIn) {
    return <>{children}</>;
  }

  return null;
}

export function SignInButton({
  children,
  mode,
}: {
  children?: React.ReactNode;
  mode?: "modal" | "redirect";
}) {
  const router = useRouter();

  if (children) {
    return (
      <span onClick={() => router.push("/sign-in")} className="cursor-pointer inline-block">
        {children}
      </span>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
    >
      Sign In
    </Link>
  );
}

export function SignUpButton({
  children,
  mode,
}: {
  children?: React.ReactNode;
  mode?: "modal" | "redirect";
}) {
  const router = useRouter();

  if (children) {
    return (
      <span onClick={() => router.push("/sign-up")} className="cursor-pointer inline-block">
        {children}
      </span>
    );
  }

  return (
    <Link
      href="/sign-up"
      className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-teal-500/30 transition-all"
    >
      Get Started
    </Link>
  );
}

export function SignOutButton({
  children,
  redirectUrl = "/landing",
}: {
  children?: React.ReactNode;
  redirectUrl?: string;
}) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  if (children) {
    return (
      <span onClick={handleSignOut} className="cursor-pointer block w-full">
        {children}
      </span>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full py-2 px-3 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-rose-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
    >
      <LogOut className="w-3.5 h-3.5" />
      Log Out
    </button>
  );
}

export function UserButton() {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const email = user.email || "Caregiver";
  const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split("@")[0];
  const initial = (name[0] || "C").toUpperCase();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 transition-all focus:outline-none"
        aria-label="User profile menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-md">
          {initial}
        </div>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090d16] border border-white/15 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-2 border-b border-white/10 mb-1">
            <p className="text-xs font-bold text-white truncate">{name}</p>
            <p className="text-[11px] text-slate-400 truncate">{email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <UserIcon className="w-3.5 h-3.5 text-teal-400" />
            Caregiver Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Account Settings
          </Link>
          <div className="border-t border-white/10 my-1 pt-1">
            <button
              onClick={() => {
                setDropdownOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-all text-left"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
