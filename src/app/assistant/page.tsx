"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, RefreshCw, AlertCircle, MessageCircle } from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { getActiveAccount, getUserProfile, fetchUserProfileFromServer, ChildAccount } from "@/lib/userStore";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AssistantPage() {
  const { user } = useUser();
  const [activeAccount, setActiveAccount] = useState<ChildAccount | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I am **Argus**, your specialized AI oral health companion for children with ASD. I have direct context on your child's sensory profile, brushing habits, and dietary risk factors. How can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          content: `👋 Hello! I am **Argus**, your specialized AI oral health companion for children with ASD.\n\nI am synced with **${acc?.name || "your child"}** (${acc?.code || "ASD Profile"}). Ask me about brushing resistance, non-foaming paste recommendations, food pocketing in cheeks, or preparing for clinical dental visits! 💙`
        }
      ]);
    };

    loadProfile();

    const handleAccountChange = () => {
      const updated = user?.id ? getUserProfile(user.id) || getActiveAccount(user.id) : getActiveAccount();
      setActiveAccount(updated);
      setMessages([
        {
          role: "assistant",
          content: `✅ Switched profile context to **${updated?.name || "your child"}** (${updated?.code || ""}). How can I assist you with ${updated?.name}'s oral care routine today?`
        }
      ]);
    };

    window.addEventListener("asd_account_changed", handleAccountChange);
    return () => window.removeEventListener("asd_account_changed", handleAccountChange);
  }, [user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const query = customInput || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: query.trim() };
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
        setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
      } else {
        throw new Error(data.error || "No response received");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: "I apologize, but I encountered a momentary connection issue. Please try asking again in a moment." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-6.5rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Argus AI Oral Health Companion
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5 font-medium">
            Empathetic pediatric oral health guidance tailored for neurodivergent children
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/35 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Argus AI Active
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/15">
            {activeAccount?.name || "Child"} ({activeAccount?.code || "ASD"}) Synced
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-5 overflow-hidden min-h-0">
        {/* Quick Actions Sidebar */}
        <div className="w-full md:w-80 liquid-glass-card rounded-3xl p-4 flex flex-col gap-2.5 overflow-y-auto flex-shrink-0 border border-white/15">
          <h3 className="font-extrabold text-white text-xs uppercase tracking-wider mb-1 px-1 flex items-center justify-between">
            <span>Quick Prompt Chips</span>
            <span className="text-[10px] text-teal-400 font-mono">1-Tap</span>
          </h3>

          <QuickActionBtn 
            onClick={() => handleQuickAction("My child refuses to open their mouth for brushing. What can I do?")} 
            title="Refusing to Open Mouth" 
            desc="Desensitization techniques for oral motor resistance"
          />
          <QuickActionBtn 
            onClick={() => handleQuickAction("How can I introduce a 3-sided toothbrush without sensory overload?")} 
            title="3-Sided Toothbrush Intro" 
            desc="Step-by-step bristle texture desensitization"
          />
          <QuickActionBtn 
            onClick={() => handleQuickAction("What are healthy crunchy snack alternatives to reduce dental plaque?")} 
            title="Crunchy Plaque Defense Snacks" 
            desc="Saliva stimulation & non-sticky food swaps"
          />
          <QuickActionBtn 
            onClick={() => handleQuickAction("How do I prepare my child with ASD for an upcoming dental clinic visit?")} 
            title="Dental Clinic Preparation" 
            desc="Social stories & clinical acclimation steps"
          />
          <QuickActionBtn 
            onClick={() => handleQuickAction("What non-foaming or unflavored toothpastes work best for sensitive gag reflex?")} 
            title="Unflavored Toothpastes" 
            desc="Non-foaming pastes for strong gag reflex"
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 liquid-glass-card rounded-3xl flex flex-col overflow-hidden border border-white/15 shadow-2xl">
          {/* Header */}
          <div className="border-b border-white/10 px-6 py-3.5 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-teal-500/20">
                <Bot className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-sm">Argus AI</h2>
                <p className="text-[11px] text-slate-300 font-medium">Child: {activeAccount?.name || "Leo"} ({activeAccount?.code || "ASD-001"}) • Pediatric ASD Oral Health Guide</p>
              </div>
            </div>
            
            <button
              onClick={() => setMessages([{ 
                role: "assistant", 
                content: `Hello! I am **Argus**. How can I help you and ${activeAccount?.name || "your child"} today?` 
              }])}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/10"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4.5 transition-all ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-medium shadow-lg shadow-teal-500/20' 
                    : 'liquid-glass border border-white/15 text-slate-100 shadow-md'
                }`}>
                  <div className={`text-[11px] font-black mb-1.5 uppercase tracking-wider ${
                    m.role === 'user' ? 'text-slate-950/80' : 'text-teal-400'
                  }`}>
                    {m.role === 'user' ? 'Caregiver' : 'Argus AI'}
                  </div>
                  <div className={`leading-relaxed text-sm whitespace-pre-wrap ${
                    m.role === 'user' ? 'text-slate-950 font-medium' : 'text-slate-100 font-normal'
                  }`}>{m.content}</div>
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="liquid-glass border border-white/15 rounded-2xl p-4 text-slate-200 text-sm flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
                  <span>Argus is generating tailored clinical guidance...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="p-4 border-t border-white/10 bg-slate-950/40">
            <form onSubmit={sendMessage} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about sensory routines, brushing difficulties, or diet..."
                className="w-full liquid-glass-input rounded-2xl py-3.5 pl-4 pr-24 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-400/50"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 disabled:opacity-40 text-slate-950 px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-teal-500/20"
              >
                Send <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-[11px] text-slate-400 mt-2 text-center flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              Guidance is supportive and does not replace in-person professional dental care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionBtn({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className="w-full text-left p-3.5 rounded-2xl liquid-glass hover:bg-white/10 border border-white/10 hover:border-teal-400/40 transition-all group shadow-sm"
    >
      <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">{title}</div>
      <div className="text-[11px] text-slate-300 mt-1 leading-snug font-normal">{desc}</div>
    </button>
  );
}
