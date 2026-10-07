/**
 * ASD Oral Care AI - Deterministic Rule-Based Scoring Engine
 * 
 * This module simulates an "AI" assessment by using a deterministic, rule-based 
 * weighted scoring system. It processes the last 7 days of daily logs to generate
 * actionable scores and priorities.
 */

export interface DailyLog {
  date: string;
  brushed: boolean;
  brush_duration_seconds: number;
  fluoridated_toothpaste: boolean;
  assistance_level: "full" | "partial" | "independent";
  tolerance: "poor" | "fair" | "good";
  brushing_resistance: "low" | "moderate" | "high";
  sensory_difficulty: "low" | "moderate" | "high";
  prompting_level: "low" | "moderate" | "high";
  meals_count: number;
  snacks_count: number;
  sugary_snacks_count: number;
  sugary_drinks_count: number;
  water_intake: "poor" | "fair" | "good";
  food_refusal_episodes: number;
}

export interface AssessmentResult {
  oral_hygiene_score: number; // 0-100
  dietary_risk_score: number; // 0-100 (higher means more risk)
  sensory_difficulty_score: number; // 0-100 (higher means more difficulty)
  independence_score: number; // 0-100 (higher means more independent)
  priorities: string[];
}

// Target values
const TARGET_BRUSH_DURATION = 120; // 2 minutes

/**
 * Maps a categorical value to a numerical score 0-100
 */
const mapToScore = (value: string, type: 'positive' | 'negative') => {
  if (type === 'positive') {
    switch (value) {
      case 'good': case 'independent': return 100;
      case 'fair': case 'partial': return 50;
      case 'poor': case 'full': return 0;
      default: return 50;
    }
  } else {
    switch (value) {
      case 'low': return 0;
      case 'moderate': return 50;
      case 'high': return 100;
      default: return 50;
    }
  }
};

/**
 * Calculates AI Assessment Scores based on the last 7 days of logs.
 * @param logs Array of DailyLogs, should be sorted chronologically (oldest to newest)
 */
export function calculateAssessment(logs: DailyLog[]): AssessmentResult {
  if (!logs || logs.length === 0) {
    return {
      oral_hygiene_score: 0,
      dietary_risk_score: 0,
      sensory_difficulty_score: 0,
      independence_score: 0,
      priorities: ["Insufficient data to generate priorities."]
    };
  }

  // Get up to the last 7 days
  const recentLogs = logs.slice(-7);
  const daysCount = recentLogs.length;

  // --- 1. Oral Hygiene Score ---
  // Weights: 40% Consistency (did they brush?), 30% Duration, 30% Tolerance
  const brushingConsistency = recentLogs.filter(l => l.brushed).length / daysCount;
  
  const avgDuration = recentLogs.reduce((sum, l) => sum + (l.brushed ? l.brush_duration_seconds : 0), 0) / daysCount;
  const durationScore = Math.min((avgDuration / TARGET_BRUSH_DURATION) * 100, 100);
  
  const avgTolerance = recentLogs.reduce((sum, l) => sum + mapToScore(l.tolerance, 'positive'), 0) / daysCount;
  
  const oral_hygiene_score = Math.round(
    (brushingConsistency * 100 * 0.4) + (durationScore * 0.3) + (avgTolerance * 0.3)
  );

  // --- 2. Dietary Risk Score ---
  // Higher score = Worse diet. 
  // Weights: 40% Sugary Snacks, 40% Sugary Drinks, 20% Food Refusal
  // Max expected daily sugary snacks/drinks ~3, Max food refusals ~3
  const avgSugarySnacks = recentLogs.reduce((sum, l) => sum + l.sugary_snacks_count, 0) / daysCount;
  const avgSugaryDrinks = recentLogs.reduce((sum, l) => sum + l.sugary_drinks_count, 0) / daysCount;
  const avgFoodRefusals = recentLogs.reduce((sum, l) => sum + l.food_refusal_episodes, 0) / daysCount;

  const snackScore = Math.min((avgSugarySnacks / 3) * 100, 100);
  const drinkScore = Math.min((avgSugaryDrinks / 3) * 100, 100);
  const refusalScore = Math.min((avgFoodRefusals / 3) * 100, 100);
  
  const dietary_risk_score = Math.round(
    (snackScore * 0.4) + (drinkScore * 0.4) + (refusalScore * 0.2)
  );

  // --- 3. Sensory Difficulty Score ---
  // Weights: 40% Resistance, 40% Sensory Difficulty, 20% Prompting Level
  const avgResistance = recentLogs.reduce((sum, l) => sum + mapToScore(l.brushing_resistance, 'negative'), 0) / daysCount;
  const avgSensoryDiff = recentLogs.reduce((sum, l) => sum + mapToScore(l.sensory_difficulty, 'negative'), 0) / daysCount;
  const avgPrompting = recentLogs.reduce((sum, l) => sum + mapToScore(l.prompting_level, 'negative'), 0) / daysCount;

  const sensory_difficulty_score = Math.round(
    (avgResistance * 0.4) + (avgSensoryDiff * 0.4) + (avgPrompting * 0.2)
  );

  // --- 4. Independence Score ---
  // Simple mapping of assistance level (Full=0, Partial=50, Independent=100)
  const independence_score = Math.round(
    recentLogs.reduce((sum, l) => sum + mapToScore(l.assistance_level, 'positive'), 0) / daysCount
  );

  // --- 5. Generate Priorities (Rules engine) ---
  const priorities: string[] = [];
  
  if (durationScore < 50 && avgTolerance < 50) {
    priorities.push("Posterior teeth frequently missed due to low tolerance");
  } else if (durationScore < 60) {
    priorities.push("Brushing duration consistently below target");
  }

  if (snackScore > 60 || drinkScore > 60) {
    priorities.push("Frequent between-meal sugary exposures");
  }

  if (avgSensoryDiff > 70) {
    priorities.push("High sensory resistance during routines");
  }
  
  if (avgFoodRefusals >= 1) {
    priorities.push("Recent increase in food refusal episodes");
  }

  if (independence_score < 40) {
    priorities.push("High level of caregiver assistance required");
  }

  // Fallback if doing well
  if (priorities.length === 0) {
    priorities.push("Maintain current positive routine");
  }

  return {
    oral_hygiene_score,
    dietary_risk_score,
    sensory_difficulty_score,
    independence_score,
    priorities: priorities.slice(0, 4) // Return top 4 max
  };
}
