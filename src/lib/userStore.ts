// Shared state & persistence for all user accounts, baseline intake, weekly assessments, and logs

export interface ChildAccount {
  id: string;
  code: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  caregiverName: string;
  caregiverPhone: string;
  relationship: string;
  asdLevel: string;
  communicationLevel: string;
  sensorySensitivities: string[];
  
  // 1. Demographic Details
  demographics: {
    childName: string;
    age: number;
    dob: string;
    gender: string;
    caregiverName: string;
    relationship: string;
    contactPhone: string;
    communicationStyle: string;
    sensoryTriggers: string[];
  };

  // 2. Brushing Habits
  brushingHabits: {
    frequency: string; // "Once a day", "Twice a day", etc.
    duration: string; // "< 1 min", "1-2 mins", "2+ mins"
    toothbrushType: string; // "Manual Ultra-soft", "Triple-headed / Collis", "Electric Sonic"
    toothpaste: string; // "Unflavored non-foaming", "Fruit flavored", "Fluoridated mild"
    surfacesCovered: string; // "All surfaces", "Front only", "Chewing only"
    assistanceNeeded: string; // "Full assistance", "Guided / Hand-over-hand", "Independent"
    toleranceLevel: string; // "Calm", "Mild protest", "Severe sensory distress"
    difficulties?: any;
    helpStrategy?: string;
  };

  // 3. Dietary Habits
  dietaryHabits: {
    sugaryFoodFrequency: string; // "Rarely", "1-2 times/day", "3+ times/day"
    healthyFoodFrequency: string; // "Daily", "3-4 times/week", "Rarely"
    foodHoldingInMouth: string; // "Never", "Sometimes (pooling)", "Frequently"
    snackingFrequency: string; // "Structured meals only", "Constant grazing", "1-2 snacks"
    nightFeedingOrBottle: string; // "No", "Water only", "Milk / Juice bottle in bed"
    waterIntake: string; // "Adequate (>1L)", "Moderate", "Low"
    sugaryDrinks?: string;
  };

  // 4. Dental / Medical History
  dentalMedicalHistory: {
    lastDentalVisit: string; // "Never", "Within 6 months", "6-12 months", "1+ year ago"
    pastDentalExperience: string; // "Positive", "Traumatic / High Anxiety", "Not applicable"
    activeCavitiesOrPain: string; // "No pain", "Suspected cavities / spots", "Active toothache"
    gumBleeding: string; // "No", "Occasional during brushing", "Frequent"
    regularMedications: string; // "None", "Syrups (sweetened)", "Tablets / Anti-epileptics"
    medicalDiagnoses: string[];
    neverVisitedDentist?: boolean;
    dentalProblems?: string[];
    dentalOther?: string;
    medicalConditions?: string[];
    medicalOther?: string;
  };

  // 5. Child Behaviour & Sensory
  childBehaviour: {
    mouthOpeningCooperation: string; // "Opens easily", "Needs visual timer", "Clenches shut"
    sensoryAversionTriggers: string[]; // ["Foam/texture", "Bristle vibration", "Bright bathroom light", "Taste"]
    routineReaction: string; // "Loves predictable routine", "Anxious with change", "Resistant"
    effectiveMotivators: string[]; // ["Praise", "Visual sticker chart", "Catchy tooth song", "Screen time token"]
    meltdownTriggers: string;
    motorSkills?: string;
    oralHygieneAttitude?: string;
  };

  rawQuestionnaire?: Record<string, any>;

  // Weekly Assessment History
  weeklyAssessments: {
    week: number;
    date: string;
    oralHygieneScore: number;
    dietaryRiskScore: number;
    sensoryComfortScore: number;
    routineStreakDays: number;
    statusSummary: string;
    motivationBadge: {
      title: string;
      icon: string;
      description: string;
    };
    aiRecommendations: string[];
  }[];
}

export const DEFAULT_ACCOUNTS: ChildAccount[] = [
  {
    id: "child-001",
    code: "ASD-001",
    name: "Leo",
    age: 7,
    gender: "Male",
    dob: "2019-04-12",
    caregiverName: "Priya Sharma",
    caregiverPhone: "9876543210",
    relationship: "Mother",
    asdLevel: "Level 1 (Mild Support Needed)",
    communicationLevel: "Verbal with Visual Cues",
    sensorySensitivities: ["Mint flavor burning sensation", "Electric brush vibration", "Foam buildup"],
    demographics: {
      childName: "Leo",
      age: 7,
      dob: "2019-04-12",
      gender: "Male",
      caregiverName: "Priya Sharma",
      relationship: "Mother",
      contactPhone: "9876543210",
      communicationStyle: "Verbal with Visual Schedule",
      sensoryTriggers: ["Strong mint", "Loud buzzing", "Foaming paste"],
    },
    brushingHabits: {
      frequency: "Twice daily (Morning & Bedtime)",
      duration: "1 to 2 minutes with timer",
      toothbrushType: "Triple-headed U-contour soft brush",
      toothpaste: "Mild Strawberry Non-foaming Enamel Paste",
      surfacesCovered: "Front & Chewing surfaces (Back molars need supervision)",
      assistanceNeeded: "Guided (Caregiver supports posterior reach)",
      toleranceLevel: "Mild initial protest, calms with visual song",
    },
    dietaryHabits: {
      sugaryFoodFrequency: "1 time per day (Post-lunch treat)",
      healthyFoodFrequency: "Daily (Crunchy apples, cucumbers)",
      foodHoldingInMouth: "Sometimes (Pools soft rice in lower cheek)",
      snackingFrequency: "2 structured snacks between meals",
      nightFeedingOrBottle: "No (Rinses with water before bed)",
      waterIntake: "Adequate (approx 1.2L daily)",
    },
    dentalMedicalHistory: {
      lastDentalVisit: "6 months ago (Checkup)",
      pastDentalExperience: "Mild sensory anxiety with dental chair light",
      activeCavitiesOrPain: "No active pain; mild white-spot lesion on upper molar",
      gumBleeding: "Occasional mild margin redness",
      regularMedications: "Multivitamin chewable (sugar-free)",
      medicalDiagnoses: ["ASD (Level 1)", "Mild Sensory Processing Sensitivity"],
    },
    childBehaviour: {
      mouthOpeningCooperation: "Opens well when counting to 10 with caregiver",
      sensoryAversionTriggers: ["Foaming sensation", "Cold water rinse"],
      routineReaction: "Thrives on predictable step-by-step visual timer",
      effectiveMotivators: ["Star sticker reward", "Catchy brushing melody", "High five praise"],
      meltdownTriggers: "Sudden rushing without warning",
    },
    weeklyAssessments: [
      {
        week: 4,
        date: "Current Week (Week 4)",
        oralHygieneScore: 84,
        dietaryRiskScore: 28,
        sensoryComfortScore: 88,
        routineStreakDays: 14,
        statusSummary: "Outstanding progress in sensory tolerance with the 3-sided soft brush and visual routine!",
        motivationBadge: {
          title: "Sparkling Routine Hero",
          icon: "🌟",
          description: "14 consecutive days of happy, completed brushing sessions!",
        },
        aiRecommendations: [
          "Continue the non-foaming strawberry paste; sensory distress reduced by 60%.",
          "Encourage gentle water swirling after eating rice to prevent food pocketing in cheeks.",
          "Introduce the interactive 'Sugar Bug' story video before weekend meals.",
        ],
      },
      {
        week: 3,
        date: "Week 3",
        oralHygieneScore: 78,
        dietaryRiskScore: 34,
        sensoryComfortScore: 80,
        routineStreakDays: 10,
        statusSummary: "Good routine adherence; back molar reach is improving with guided support.",
        motivationBadge: {
          title: "Sensory Champion",
          icon: "🛡️",
          description: "Overcame vibration sensitivity during morning routines.",
        },
        aiRecommendations: [
          "Maintain visual count-to-10 pacing during upper posterior brushing.",
          "Keep sugary snacks strictly paired with main meals.",
        ],
      },
      {
        week: 2,
        date: "Week 2",
        oralHygieneScore: 68,
        dietaryRiskScore: 45,
        sensoryComfortScore: 65,
        routineStreakDays: 6,
        statusSummary: "Initial transition to non-foaming paste completed successfully.",
        motivationBadge: {
          title: "Step-by-Step Explorer",
          icon: "🚀",
          description: "First full 7-day visual social story completion!",
        },
        aiRecommendations: [
          "Switch to triple-headed brush for automatic 3-surface coverage.",
        ],
      },
      {
        week: 1,
        date: "Week 1 (Baseline)",
        oralHygieneScore: 52,
        dietaryRiskScore: 60,
        sensoryComfortScore: 48,
        routineStreakDays: 2,
        statusSummary: "Baseline recorded. Primary challenge: toothpaste foaming aversion and brushing refusal.",
        motivationBadge: {
          title: "New Journey Starter",
          icon: "🌱",
          description: "Baseline completed and personalized desensitization plan generated.",
        },
        aiRecommendations: [
          "Eliminate strong mint paste immediately.",
          "Start visual step-by-step cue cards.",
        ],
      },
    ],
  },
  {
    id: "child-002",
    code: "ASD-002",
    name: "Aarav",
    age: 5,
    gender: "Male",
    dob: "2021-08-19",
    caregiverName: "Rohit Verma",
    caregiverPhone: "9812345678",
    relationship: "Father",
    asdLevel: "Level 2 (Substantial Support Needed)",
    communicationLevel: "Non-verbal (PECS & Gesture Communication)",
    sensorySensitivities: ["Tactile oral defensiveness", "Toothbrush handle texture", "Flavors"],
    demographics: {
      childName: "Aarav",
      age: 5,
      dob: "2021-08-19",
      gender: "Male",
      caregiverName: "Rohit Verma",
      relationship: "Father",
      contactPhone: "9812345678",
      communicationStyle: "PECS picture cards & Gestures",
      sensoryTriggers: ["Bristle stiffness", "Cold water", "Pressure on upper gums"],
    },
    brushingHabits: {
      frequency: "Once daily (Evening)",
      duration: "45 seconds",
      toothbrushType: "Silicone fingertip brush & Ultra-soft microbristle",
      toothpaste: "Unflavored plain fluoride gel",
      surfacesCovered: "Front incisors only",
      assistanceNeeded: "Full assistance (Father and mother co-support)",
      toleranceLevel: "Sensitive; requires calm singing and gentle cheek massage",
    },
    dietaryHabits: {
      sugaryFoodFrequency: "2 times per day (Fruit pouches & sweet biscuits)",
      healthyFoodFrequency: "2-3 times/week",
      foodHoldingInMouth: "Frequently keeps food in cheeks for 20+ mins",
      snackingFrequency: "Frequent small bites throughout afternoon",
      nightFeedingOrBottle: "Warm milk bottle before sleep (working on water swap)",
      waterIntake: "Moderate",
    },
    dentalMedicalHistory: {
      lastDentalVisit: "Never visited dentist",
      pastDentalExperience: "N/A",
      activeCavitiesOrPain: "Noticeable chalky white spot on front tooth",
      gumBleeding: "Mild gingivitis on lower gums",
      regularMedications: "None",
      medicalDiagnoses: ["ASD (Level 2)", "Oral Tactile Hypersensitivity"],
    },
    childBehaviour: {
      mouthOpeningCooperation: "Opens mouth with finger puppet and visual story card",
      sensoryAversionTriggers: ["Bristle prickle", "Paste foam"],
      routineReaction: "Needs dimmed lighting and familiar lullaby",
      effectiveMotivators: ["Sensory bubble toy", "Favorite cartoon chime", "Gentle hugs"],
      meltdownTriggers: "Forced mouth opening without visual warning",
    },
    weeklyAssessments: [
      {
        week: 2,
        date: "Current Week (Week 2)",
        oralHygieneScore: 65,
        dietaryRiskScore: 50,
        sensoryComfortScore: 68,
        routineStreakDays: 8,
        statusSummary: "Aarav tolerated fingertip silicone brushing for 45s without tears!",
        motivationBadge: {
          title: "Brave Smile Hero",
          icon: "🦸‍♂️",
          description: "Completed 8 consecutive calm brushing routines!",
        },
        aiRecommendations: [
          "Gradually introduce unflavored fluoride paste on tip of brush.",
          "Wipe gums gently with warm gauze after bedtime milk bottle.",
          "Consult ASD Therapist for oral-motor sensory prep before bedtime.",
        ],
      },
    ],
  },
  {
    id: "child-003",
    code: "ASD-003",
    name: "Maya",
    age: 9,
    gender: "Female",
    dob: "2017-02-10",
    caregiverName: "Ananya Iyer",
    caregiverPhone: "9731234567",
    relationship: "Mother",
    asdLevel: "Level 1 (Mild Support Needed)",
    communicationLevel: "Fluent Verbal",
    sensorySensitivities: ["Sticky food texture", "Bright bathroom mirror glare"],
    demographics: {
      childName: "Maya",
      age: 9,
      dob: "2017-02-10",
      gender: "Female",
      caregiverName: "Ananya Iyer",
      relationship: "Mother",
      contactPhone: "9731234567",
      communicationStyle: "Fluent Verbal",
      sensoryTriggers: ["Bright LED mirror light", "Spicy / Strong mint toothpaste"],
    },
    brushingHabits: {
      frequency: "Twice daily",
      duration: "2 full minutes with musical brush",
      toothbrushType: "Sonic Electric with soft silicone bristle head",
      toothpaste: "Mild Apple-Bubblegum Fluoride Gel",
      surfacesCovered: "All surfaces (Independent with spot checks)",
      assistanceNeeded: "Independent (Caregiver inspects with flashlight)",
      toleranceLevel: "Calm and enthusiastic",
    },
    dietaryHabits: {
      sugaryFoodFrequency: "Rarely (1 treat on weekend)",
      healthyFoodFrequency: "Daily (Eats crunchy carrots, bell peppers, almonds)",
      foodHoldingInMouth: "Never",
      snackingFrequency: "Structured 2 snacks",
      nightFeedingOrBottle: "No",
      waterIntake: "High (>1.5L daily)",
    },
    dentalMedicalHistory: {
      lastDentalVisit: "3 months ago (Routine cleaning & Pit/Fissure sealants placed)",
      pastDentalExperience: "Very positive (Used sensory sunglasses during exam)",
      activeCavitiesOrPain: "Zero cavities; healthy gums",
      gumBleeding: "None",
      regularMedications: "None",
      medicalDiagnoses: ["ASD (Level 1)"],
    },
    childBehaviour: {
      mouthOpeningCooperation: "Excellent; tracks timer independently",
      sensoryAversionTriggers: ["Overly bright lights"],
      routineReaction: "Follows self-managed checklist on iPad",
      effectiveMotivators: ["Digital badges", "Science books", "Praise"],
      meltdownTriggers: "Broken routines without prior discussion",
    },
    weeklyAssessments: [
      {
        week: 6,
        date: "Current Week (Week 6)",
        oralHygieneScore: 94,
        dietaryRiskScore: 15,
        sensoryComfortScore: 96,
        routineStreakDays: 28,
        statusSummary: "Exceptional oral hygiene! Enamel integrity and gum health are optimal.",
        motivationBadge: {
          title: "Master of Healthy Smiles",
          icon: "👑",
          description: "28 days streak with independent thorough brushing!",
        },
        aiRecommendations: [
          "Maintain twice-daily 2-minute routine.",
          "Keep regular 6-month dental checkups scheduled.",
        ],
      },
    ],
  },
];

// Helper to get child profile for a specific user
export function getUserProfile(userId?: string | null): ChildAccount | null {
  if (typeof window === "undefined") return null;
  if (!userId) {
    const raw = localStorage.getItem("asd_current_user_profile");
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return null;
  }
  try {
    const stored = localStorage.getItem(`asd_profile_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    // Fallback to active current profile
    const raw = localStorage.getItem("asd_current_user_profile");
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
  } catch (e) {
    console.error("Error reading user profile", e);
  }
  return null;
}

// Async fetch from server database (profiles.json / Supabase)
export async function fetchUserProfileFromServer(userId: string): Promise<ChildAccount | null> {
  if (!userId) return null;
  try {
    const res = await fetch(`/api/user-profile?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.profile?.profile) {
        const prof = data.profile.profile;
        if (typeof window !== "undefined") {
          localStorage.setItem(`asd_profile_${userId}`, JSON.stringify(prof));
          localStorage.setItem("asd_current_user_profile", JSON.stringify(prof));
          localStorage.setItem("asd_active_child_id", prof.id);
          localStorage.setItem(`asd_onboarded_${userId}`, "true");
        }
        return prof;
      } else if (data?.profile) {
        const prof = data.profile;
        if (typeof window !== "undefined") {
          localStorage.setItem(`asd_profile_${userId}`, JSON.stringify(prof));
          localStorage.setItem("asd_current_user_profile", JSON.stringify(prof));
          localStorage.setItem("asd_active_child_id", prof.id);
          localStorage.setItem(`asd_onboarded_${userId}`, "true");
        }
        return prof;
      }
    }
  } catch (err) {
    console.error("Failed to fetch profile from server:", err);
  }
  return getUserProfile(userId);
}

// Save profile specifically for this user to database + localStorage
export async function saveUserProfile(
  userId: string,
  userEmail: string,
  profile: ChildAccount
): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(`asd_profile_${userId}`, JSON.stringify(profile));
    localStorage.setItem("asd_current_user_profile", JSON.stringify(profile));
    localStorage.setItem("asd_active_child_id", profile.id);
    localStorage.setItem(`asd_onboarded_${userId}`, "true");
    localStorage.setItem("asd_onboarding_completed", "true");

    try {
      const all = getAllAccounts();
      const idx = all.findIndex((a) => a.id === profile.id || a.code === profile.code);
      if (idx >= 0) {
        all[idx] = profile;
      } else {
        all.unshift(profile);
      }
      saveAllAccounts(all);
    } catch (e) {}

    window.dispatchEvent(new Event("asd_account_changed"));
  }

  try {
    await fetch("/api/user-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userEmail, profile }),
    });
  } catch (err) {
    console.error("Failed to persist user profile to server DB:", err);
  }
}

// Helper to check if a specific user has completed questionnaire
export function hasUserCompletedOnboarding(userId?: string | null): boolean {
  if (typeof window === "undefined") return false;
  if (!userId) {
    return localStorage.getItem("asd_onboarding_completed") === "true";
  }
  return (
    localStorage.getItem(`asd_onboarded_${userId}`) === "true" ||
    !!localStorage.getItem(`asd_profile_${userId}`)
  );
}

// Helper to get all accounts from localStorage or fallback to defaults (for admin portal)
export function getAllAccounts(): ChildAccount[] {
  if (typeof window === "undefined") return DEFAULT_ACCOUNTS;
  try {
    const stored = localStorage.getItem("asd_all_accounts");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading accounts from localStorage", e);
  }
  return DEFAULT_ACCOUNTS;
}

// Helper to save all accounts (for admin use)
export function saveAllAccounts(accounts: ChildAccount[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("asd_all_accounts", JSON.stringify(accounts));
  } catch (e) {
    console.error("Error saving accounts", e);
  }
}

// Helper to get active account for current user
export function getActiveAccount(userId?: string | null): ChildAccount | null {
  const userAcc = getUserProfile(userId);
  if (userAcc) return userAcc;

  // Fallback to current selected account
  const accounts = getAllAccounts();
  if (typeof window === "undefined") return accounts[0];
  try {
    const activeId = localStorage.getItem("asd_active_child_id");
    if (activeId) {
      const found = accounts.find((a) => a.id === activeId || a.code === activeId);
      if (found) return found;
    }
  } catch (e) {
    console.error("Error reading active account", e);
  }
  return accounts[0] || null;
}

// Helper to set active account
export function setActiveAccountId(id: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("asd_active_child_id", id);
    window.dispatchEvent(new Event("asd_account_changed"));
  } catch (e) {
    console.error("Error setting active account", e);
  }
}

// Helper to add or update account
export function upsertAccount(account: ChildAccount, userId?: string | null) {
  if (userId) {
    saveUserProfile(userId, "", account);
  }
  const accounts = getAllAccounts();
  const index = accounts.findIndex((a) => a.id === account.id || a.code === account.code);
  if (index >= 0) {
    accounts[index] = account;
  } else {
    accounts.push(account);
  }
  saveAllAccounts(accounts);
  setActiveAccountId(account.id);
}
