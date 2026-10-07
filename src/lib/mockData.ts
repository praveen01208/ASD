import { DailyLog } from "./scoring";

export const mockChild = {
  id: "child-uuid-1",
  participant_code: "ASD-001",
  name: "Leo",
  age: 7,
  gender: "Male",
  communication_level: "verbal",
  support_level: "Recorded",
  motor_difficulty: "mild",
  sensory_profile: {
    taste: "high",
    touch: "moderate",
    sound: "low",
    visual: "low"
  },
  food_selectivity: "moderate",
  preferred_texture: "crunchy",
  reinforcement_type: "praise",
  toothbrush_type: "electric",
};

// Generate 14 days of logs
export const mockLogs: DailyLog[] = Array.from({ length: 14 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  
  // Gradual improvement in duration and tolerance over the 14 days
  const baseDuration = 40 + (i * 3); 
  
  return {
    id: `log-${i}`,
    child_id: mockChild.id,
    date: date.toISOString().split('T')[0],
    brushed: true,
    brush_duration_seconds: Math.min(baseDuration + Math.floor(Math.random() * 20), 120),
    fluoridated_toothpaste: i > 7, // Started after a week
    assistance_level: (i < 7 ? "full" : "partial") as "full" | "partial" | "independent",
    tolerance: (i < 5 ? "poor" : i < 10 ? "fair" : "good") as "poor" | "fair" | "good",
    brushing_resistance: (i < 5 ? "high" : "moderate") as "low" | "moderate" | "high",
    sensory_difficulty: (i < 7 ? "moderate" : "low") as "low" | "moderate" | "high",
    prompting_level: (i < 5 ? "high" : "moderate") as "low" | "moderate" | "high",
    
    meals_count: 3,
    snacks_count: Math.floor(Math.random() * 3) + 1, // 1-3 snacks
    sugary_snacks_count: Math.max(0, 3 - Math.floor(i / 4)), // decreases over time
    sugary_drinks_count: Math.max(0, 2 - Math.floor(i / 5)), // decreases over time
    water_intake: (i < 7 ? "fair" : "good") as "poor" | "fair" | "good",
    food_refusal_episodes: Math.max(0, 2 - Math.floor(i / 4)),
  } as unknown as DailyLog;
});

// Generate 8 weeks of assessments for the progress chart
export const mockAssessments = Array.from({ length: 8 }).map((_, i) => {
  return {
    id: `assessment-${i}`,
    date: `Week ${i + 1}`,
    oral_hygiene_score: 45 + (i * 4) + Math.floor(Math.random() * 5),
    dietary_risk_score: 85 - (i * 3) - Math.floor(Math.random() * 5), // Higher is worse, so decreasing
    sensory_difficulty_score: 70 - (i * 3), // Decreasing
    independence_score: 40 + (i * 4), // Increasing
    priorities: ["Posterior teeth frequently missed", "Frequent between-meal sugary snacks"]
  };
});
