"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Phone,
  Stethoscope,
  ChevronDown,
  Zap,
  MessageSquareDot,
} from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { getActiveAccount, getUserProfile, fetchUserProfileFromServer, ChildAccount } from "@/lib/userStore";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const QUICK_PROMPTS = [
  "🪥 Tips for brushing resistance?",
  "🦷 Sensory-friendly toothpaste options",
  "🍎 Food pooling in cheeks – help?",
  "🏥 Preparing for first dental visit",
];

function formatTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FloatingChatbot() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeAccount, setActiveAccount] = useState<ChildAccount | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      let acc: ChildAccount | null = null;
      if (user?.id) {
        acc = (await fetchUserProfileFromServer(user.id)) || getUserProfile(user.id);
      }
      if (!acc) {
        acc = getActiveAccount(user?.id);
      }
      setActiveAccount(acc);
      setMessages([
        {
          role: "assistant",
          content: `👋 Hello! I'm **Argus**, your AI oral health companion for children with ASD.\n\nI'm calibrated specifically for **${acc?.name || "your child"}** (${acc?.asdLevel || "ASD Profile"}). Ask me anything about brushing routines, sensory strategies, diet, or dental visits! 💙`,
          timestamp: formatTime(),
        },
      ]);
    };

    loadProfile();

    const handleAccountChange = () => {
      const updated = user?.id ? getUserProfile(user.id) || getActiveAccount(user.id) : getActiveAccount();
      setActiveAccount(updated);
      setMessages([
        {
          role: "assistant",
          content: `✅ Calibrated to **${updated?.name || "your child"}** (${updated?.code || ""}). How can I help with their oral routine?`,
          timestamp: formatTime(),
        },
      ]);
    };

    window.addEventListener("asd_account_changed", handleAccountChange);
    return () => window.removeEventListener("asd_account_changed", handleAccountChange);
  }, [user?.id]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 60);
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (customText?: string) => {
    const query = customText || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: query.trim(),
      timestamp: formatTime(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let todayChecklist = null;
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("asd_today_checklist");
      if (raw) {
        try { todayChecklist = JSON.parse(raw); } catch(e) {}
      }
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: updatedMessages,
          childName: activeAccount?.name,
          childAge: activeAccount?.age,
          asdLevel: activeAccount?.asdLevel,
          sensoryProfile: activeAccount?.childBehaviour?.sensoryAversionTriggers || activeAccount?.sensorySensitivities,
          brushingHabits: activeAccount?.brushingHabits,
          dietaryHabits: activeAccount?.dietaryHabits,
          dentalMedicalHistory: activeAccount?.dentalMedicalHistory,
          childBehaviour: activeAccount?.childBehaviour,
          questionnaire: activeAccount?.rawQuestionnaire,
          dailyLog: todayChecklist,
        }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message, timestamp: formatTime() },
        ]);
      } else {
        throw new Error(data.error || "No response received");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'm having a brief moment of reflection 🌿\n\nIn the meantime: for **${activeAccount?.name || "your child"}**, try using a non-foaming paste, a 3-sided soft brush, and a consistent 2-minute visual schedule. These are among the most effective sensory comfort strategies.\n\n*This guidance is supportive and does not replace professional dental or medical assessment.*`,
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        const boldLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return (
          <p
            key={i}
            className={line === "" ? "h-2" : ""}
            dangerouslySetInnerHTML={{ __html: boldLine }}
          />
        );
      });
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {/* ── Expanded Chat Panel ── */}
      {isOpen && (
        <div
          className={`
            flex flex-col overflow-hidden transition-all duration-300 ease-out
            ${isMinimized
              ? "w-72 h-[52px]"
              : "w-[94vw] sm:w-[400px] h-[560px] max-h-[88vh]"}
          `}
          style={{
            background: "linear-gradient(160deg, rgba(5,31,32,0.98) 0%, rgba(11,43,38,0.99) 100%)",
            backdropFilter: "blur(32px) saturate(200%)",
            WebkitBackdropFilter: "blur(32px) saturate(200%)",
            border: "1px solid rgba(142,182,155,0.45)",
            borderRadius: "24px",
            boxShadow:
              "0 0 0 1px rgba(218,241,222,0.08) inset, 0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(35,83,71,0.25)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(35,83,71,0.35) 0%, rgba(22,56,50,0.25) 100%)",
              borderBottom: "1px solid rgba(142,182,155,0.2)",
            }}
          >
            <div className="flex items-center gap-2.5">
              {/* Argus Avatar */}
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg border border-[#8EB69B]/40"
                  style={{
                    background:
                      "linear-gradient(135deg, #0B2B26 0%, #235347 100%)",
                    boxShadow: "0 0 18px rgba(35,83,71,0.5)",
                  }}
                >
                  <Sparkles className="w-4.5 h-4.5 text-[#DAF1DE]" style={{ width: 18, height: 18 }} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#8EB69B] rounded-full border-2 border-[#051F20] animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white tracking-tight">Argus</h3>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(218,241,222,0.2)",
                      border: "1px solid #8EB69B",
                      color: "#DAF1DE",
                    }}
                  >
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-[#8EB69B] truncate max-w-[190px]">
                  {activeAccount?.name ? `Active: ${activeAccount.name} · ${activeAccount.code}` : "ASD Oral Health Guide"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-[#DAF1DE] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                aria-label={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#DAF1DE] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body – only when not minimized */}
          {!isMinimized && (
            <>
              {/* Quick access bar */}
              <div
                className="px-3.5 py-2 flex items-center justify-between text-[10px] flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(142,182,155,0.15)", background: "rgba(5,31,32,0.6)" }}
              >
                <span className="text-[#8EB69B]/70">Need immediate help?</span>
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/helpline"
                    className="text-[#DAF1DE] hover:text-white flex items-center gap-1 font-bold transition-colors"
                  >
                    <Phone className="w-3 h-3 text-[#8EB69B]" />
                    Helpline
                  </Link>
                  <span className="text-[#8EB69B]/40">·</span>
                  <Link
                    href="/consultants"
                    className="text-[#DAF1DE] hover:text-white flex items-center gap-1 font-bold transition-colors"
                  >
                    <Stethoscope className="w-3 h-3 text-[#8EB69B]" />
                    Consultants
                  </Link>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-4">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 ${
                        m.role === "user"
                          ? "bg-[#235347] text-white"
                          : "bg-white/10 text-[#DAF1DE] border border-[#8EB69B]/30"
                      }`}
                    >
                      {m.role === "user" ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[80%] flex flex-col gap-0.5 ${m.role === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-3.5 py-2.5 text-xs leading-relaxed space-y-0.5 ${
                          m.role === "user"
                            ? "rounded-2xl rounded-br-sm text-white font-medium"
                            : "rounded-2xl rounded-bl-sm text-[#F4FAF6]"
                        }`}
                        style={
                          m.role === "user"
                            ? {
                                background: "#235347",
                                border: "1px solid #8EB69B",
                                boxShadow: "0 4px 15px rgba(35,83,71,0.4)",
                              }
                            : {
                                background: "rgba(22,56,50,0.5)",
                                border: "1px solid rgba(142,182,155,0.25)",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                              }
                        }
                      >
                        {renderContent(m.content)}
                      </div>
                      {m.timestamp && (
                        <span className="text-[10px] text-[#DAF1DE]/90 px-1 font-medium">
                          {m.timestamp}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-end gap-2">
                    <div
                      className="w-6 h-6 rounded-xl flex items-center justify-center border border-white/10"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <Bot className="w-3.5 h-3.5 text-teal-300" />
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl rounded-bl-sm"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <div className="flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div
                className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto flex-shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.25)" }}
              >
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="whitespace-nowrap px-2.5 py-1.5 rounded-full text-xs font-bold text-[#DAF1DE] hover:text-white transition-all flex-shrink-0 disabled:opacity-40"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(20,184,166,0.15)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(20,184,166,0.35)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2 p-3 flex-shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.4)" }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask Argus about ${activeAccount?.name || "your child"}'s care…`}
                  className="flex-1 text-xs text-white placeholder-[#8EB69B]/50 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8EB69B] transition-all"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(142,182,155,0.25)",
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 hover:scale-105 active:scale-95 border border-[#8EB69B]"
                  style={{
                    background: "linear-gradient(135deg, #0B2B26, #235347)",
                    boxShadow: "0 4px 15px rgba(35,83,71,0.4)",
                  }}
                  aria-label="Send"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* ── Launcher Button ── */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="group relative flex items-center gap-3 pl-3.5 pr-5 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 border border-[#8EB69B]/60 shadow-xl"
          style={{
            background: "linear-gradient(135deg, #051F20 0%, #235347 100%)",
            boxShadow: "0 8px 32px rgba(5,31,32,0.45)",
          }}
          aria-label="Open Argus – ASD Care AI"
        >
          {/* Ping indicator */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#8EB69B] rounded-full border-2 border-[#051F20] animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#8EB69B] rounded-full border-2 border-[#051F20]" />

          {/* Icon */}
          <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#DAF1DE]" />
          </div>

          {/* Labels */}
          <div className="flex flex-col">
            <span className="text-xs font-black text-white tracking-tight leading-none">Argus</span>
            <span className="text-[10px] text-[#DAF1DE]/90 font-medium leading-none mt-0.5">AI Care Guide · Active</span>
          </div>
        </button>
      )}
    </div>
  );
}
