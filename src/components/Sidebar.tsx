"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  User, 
  Activity, 
  ListChecks, 
  PlaySquare, 
  MessageSquareHeart, 
  LineChart, 
  Stethoscope, 
  FileText, 
  Settings,
  MessageCircle,
  ExternalLink,
  Compass,
  LogOut,
  Home
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Child Profile", href: "/profile", icon: User },
  { name: "AI Assessment", href: "/assessment", icon: Activity },
  { name: "Care Plan", href: "/care-plan", icon: ListChecks },
  { name: "Visual Learning", href: "/learning", icon: PlaySquare },
  { name: "Daily Monitoring", href: "/monitoring", icon: FileText },
  { name: "ASD Bot", href: "/assistant", icon: MessageSquareHeart },
  { name: "Progress", href: "/progress", icon: LineChart },
  { name: "Clinical Outcomes", href: "/clinical", icon: Stethoscope },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const doctorWhatsapp = "https://wa.me/917758022942?text=" + encodeURIComponent(
    "Hello Dr. Nivrutti Reddy, I am contacting you through the ASD Oral Care AI Platform regarding child ASD-001."
  );

  return (
    <aside aria-label="Sidebar Navigation" className="flex h-full w-64 flex-col liquid-glass border-r border-white/10 text-slate-200">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center px-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 p-2 rounded-xl shadow-lg shadow-teal-500/20 font-bold">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-white">ASD Oral Care AI</span>
            <span className="text-[10px] font-semibold text-teal-400">Dr. Nivrutti Reddy</span>
          </div>
        </Link>
      </div>

      {/* Navigation items */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-3 pb-3 px-3">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-x-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-teal-400" : "text-slate-400 group-hover:text-teal-300"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* Doctor Contact Quick Card */}
        <div className="mt-3 p-3 rounded-2xl liquid-glass border border-emerald-500/30 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Dr. Nivrutti Reddy
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono mb-2">+91 77580 22942</div>
          <a
            href={doctorWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
            WhatsApp Direct
          </a>
        </div>

        {/* User Account / Sign In / Log Out */}
        <div className="mt-3 space-y-2">
          <Show when="signed-in">
            <div className="liquid-glass rounded-xl p-2.5 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <UserButton />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate">Caregiver Account</span>
                  <span className="text-[10px] text-teal-400">Baseline Synced</span>
                </div>
              </div>

              <SignOutButton redirectUrl="/landing">
                <button className="w-full py-2 px-3 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-rose-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm">
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </SignOutButton>
            </div>
          </Show>
          <Show when="signed-out">
            <div className="liquid-glass rounded-xl p-2.5 border border-white/10 space-y-2">
              <SignInButton mode="modal">
                <button className="w-full text-center py-2 px-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-all shadow-sm">
                  Sign In / Register
                </button>
              </SignInButton>
              <Link
                href="/landing"
                className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <Home className="w-3.5 h-3.5 text-teal-400" />
                Landing Page
              </Link>
            </div>
          </Show>
        </div>
      </div>
    </aside>
  );
}
