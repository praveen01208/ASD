"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Users, 
  Search, 
  Check, 
  ChevronRight, 
  UserCheck, 
  Activity, 
  Sparkles, 
  X,
  ExternalLink,
  PlusCircle,
  FileSpreadsheet
} from "lucide-react";
import { getAllAccounts, getActiveAccount, setActiveAccountId, ChildAccount } from "@/lib/userStore";
import Link from "next/link";

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminAccessModal({ isOpen, onClose }: AdminAccessModalProps) {
  const [accounts, setAccounts] = useState<ChildAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<ChildAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChildDetail, setSelectedChildDetail] = useState<ChildAccount | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAccounts(getAllAccounts());
      const active = getActiveAccount();
      setActiveAccount(active);
      setSelectedChildDetail(active);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredAccounts = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.caregiverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAccount = (acc: ChildAccount) => {
    setActiveAccountId(acc.id);
    setActiveAccount(acc);
    setSelectedChildDetail(acc);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="liquid-glass-island rounded-3xl border border-teal-500/40 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-teal-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Admin Authority
                </span>
                <span className="text-xs text-slate-400">Total Accounts: {accounts.length}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Caregiver & Child Accounts Directory
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              onClick={onClose}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all"
            >
              <span>Full Admin Suite</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* Left Column: Account List */}
          <div className="md:col-span-5 p-4 flex flex-col min-h-0 bg-slate-950/40">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by child name, code, caregiver..."
                className="w-full liquid-glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredAccounts.map((acc) => {
                const isCurrent = activeAccount?.id === acc.id;
                const isSelected = selectedChildDetail?.id === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedChildDetail(acc)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-teal-500/20 border-teal-400/50 shadow-md shadow-teal-500/10"
                        : "liquid-glass border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/10 text-teal-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {acc.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white truncate">{acc.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-teal-300">
                            {acc.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          Caregiver: {acc.caregiverName} ({acc.relationship})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAccount(acc);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] transition-all"
                      >
                        Switch
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <Link
                href="/onboarding"
                onClick={onClose}
                className="text-teal-300 hover:text-teal-200 font-bold flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Create New Child Profile
              </Link>
            </div>
          </div>

          {/* Right Column: Selected Account Deep-Dive */}
          <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-900/40">
            {selectedChildDetail ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {selectedChildDetail.name} ({selectedChildDetail.code})
                      </h3>
                      <span className="text-xs text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                        Age: {selectedChildDetail.age}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {selectedChildDetail.asdLevel} • {selectedChildDetail.communicationLevel}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectAccount(selectedChildDetail)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs shadow-md shadow-teal-500/20 transition-all hover:scale-105"
                  >
                    Set as Active View
                  </button>
                </div>

                {/* 5 Domains Quick Breakdown */}
                <div className="space-y-3 text-xs">
                  {/* 1. Demographics */}
                  <div className="p-3 rounded-xl liquid-glass border border-white/10">
                    <h4 className="font-bold text-teal-300 uppercase tracking-wider text-[10px] mb-1.5">
                      1. Demographic Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div><span className="text-slate-500">Caregiver:</span> {selectedChildDetail.demographics.caregiverName} ({selectedChildDetail.demographics.relationship})</div>
                      <div><span className="text-slate-500">Phone:</span> {selectedChildDetail.demographics.contactPhone}</div>
                      <div><span className="text-slate-500">DOB:</span> {selectedChildDetail.demographics.dob}</div>
                      <div><span className="text-slate-500">Communication:</span> {selectedChildDetail.demographics.communicationStyle}</div>
                    </div>
                  </div>

                  {/* 2. Brushing Habits */}
                  <div className="p-3 rounded-xl liquid-glass border border-white/10">
                    <h4 className="font-bold text-teal-300 uppercase tracking-wider text-[10px] mb-1.5">
                      2. Brushing Habits
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div><span className="text-slate-500">Frequency:</span> {selectedChildDetail.brushingHabits.frequency}</div>
                      <div><span className="text-slate-500">Duration:</span> {selectedChildDetail.brushingHabits.duration}</div>
                      <div><span className="text-slate-500">Toothbrush:</span> {selectedChildDetail.brushingHabits.toothbrushType}</div>
                      <div><span className="text-slate-500">Paste:</span> {selectedChildDetail.brushingHabits.toothpaste}</div>
                      <div className="col-span-2"><span className="text-slate-500">Tolerance:</span> {selectedChildDetail.brushingHabits.toleranceLevel}</div>
                    </div>
                  </div>

                  {/* 3. Dietary Habits */}
                  <div className="p-3 rounded-xl liquid-glass border border-white/10">
                    <h4 className="font-bold text-teal-300 uppercase tracking-wider text-[10px] mb-1.5">
                      3. Dietary Habits
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div><span className="text-slate-500">Sugar Frequency:</span> {selectedChildDetail.dietaryHabits.sugaryFoodFrequency}</div>
                      <div><span className="text-slate-500">Healthy Foods:</span> {selectedChildDetail.dietaryHabits.healthyFoodFrequency}</div>
                      <div><span className="text-slate-500">Food Holding/Pooling:</span> {selectedChildDetail.dietaryHabits.foodHoldingInMouth}</div>
                      <div><span className="text-slate-500">Night Feeding:</span> {selectedChildDetail.dietaryHabits.nightFeedingOrBottle}</div>
                    </div>
                  </div>

                  {/* 4. Dental / Medical History */}
                  <div className="p-3 rounded-xl liquid-glass border border-white/10">
                    <h4 className="font-bold text-teal-300 uppercase tracking-wider text-[10px] mb-1.5">
                      4. Dental & Medical History
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div><span className="text-slate-500">Last Dental Visit:</span> {selectedChildDetail.dentalMedicalHistory.lastDentalVisit}</div>
                      <div><span className="text-slate-500">Cavities/Spots:</span> {selectedChildDetail.dentalMedicalHistory.activeCavitiesOrPain}</div>
                      <div><span className="text-slate-500">Gum Bleeding:</span> {selectedChildDetail.dentalMedicalHistory.gumBleeding}</div>
                      <div><span className="text-slate-500">Medications:</span> {selectedChildDetail.dentalMedicalHistory.regularMedications}</div>
                    </div>
                  </div>

                  {/* 5. Child Behaviour & Sensory */}
                  <div className="p-3 rounded-xl liquid-glass border border-white/10">
                    <h4 className="font-bold text-teal-300 uppercase tracking-wider text-[10px] mb-1.5">
                      5. Child Behaviour & Motivators
                    </h4>
                    <div className="space-y-1 text-slate-300">
                      <div><span className="text-slate-500">Mouth Opening:</span> {selectedChildDetail.childBehaviour.mouthOpeningCooperation}</div>
                      <div><span className="text-slate-500">Sensory Triggers:</span> {selectedChildDetail.childBehaviour.sensoryAversionTriggers.join(", ")}</div>
                      <div><span className="text-slate-500">Motivators:</span> {selectedChildDetail.childBehaviour.effectiveMotivators.join(", ")}</div>
                    </div>
                  </div>

                  {/* Latest Weekly AI Assessment */}
                  {selectedChildDetail.weeklyAssessments?.[0] && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-teal-950/60 to-indigo-950/60 border border-teal-400/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-teal-300 text-[10px] uppercase">
                          Latest Weekly AI Assessment ({selectedChildDetail.weeklyAssessments[0].date})
                        </span>
                        <span className="font-black text-white text-xs">
                          Hygiene: {selectedChildDetail.weeklyAssessments[0].oralHygieneScore}%
                        </span>
                      </div>
                      <p className="text-slate-200 text-xs italic">
                        "{selectedChildDetail.weeklyAssessments[0].statusSummary}"
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                Select an account on the left to view complete records
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
