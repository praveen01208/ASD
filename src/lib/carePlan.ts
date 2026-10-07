import { AssessmentResult } from './scoring';

export interface CarePlan {
  oral_intervention: {
    target: string;
    reason: string;
    steps: string; // The step sequence string
  };
  dietary_intervention: {
    target: string;
    suggestion: string;
  };
}

/**
 * Rules Engine for generating a Care Plan based on AI Assessment results and child profile.
 */
export function generateCarePlan(assessment: AssessmentResult, preferredTexture: string = 'crunchy'): CarePlan {
  const plan: CarePlan = {
    oral_intervention: {
      target: "General brushing maintenance",
      reason: "Oral hygiene is stable.",
      steps: "visual sequence → reinforcement"
    },
    dietary_intervention: {
      target: "Maintain balanced diet",
      suggestion: "Continue offering a variety of accepted textures."
    }
  };

  // --- Oral Intervention Rules ---
  if (assessment.priorities.some(p => p.toLowerCase().includes("posterior"))) {
    plan.oral_intervention.target = "Posterior tooth brushing";
    plan.oral_intervention.reason = "Posterior coverage has been low on recent observations.";
    plan.oral_intervention.steps = "visual sequence → preferred region first → gradual duration increase → reinforcement";
  } else if (assessment.sensory_difficulty_score > 60) {
    plan.oral_intervention.target = "Reduce sensory overload";
    plan.oral_intervention.reason = "High sensory resistance detected during recent routines.";
    plan.oral_intervention.steps = "desensitization massage → non-foaming toothpaste → visual sequence → praise";
  } else if (assessment.oral_hygiene_score < 60) {
    plan.oral_intervention.target = "Increase brushing duration";
    plan.oral_intervention.reason = "Brushing duration consistently below target.";
    plan.oral_intervention.steps = "visual timer → positive reinforcement → gradual duration increase";
  }

  // --- Dietary Intervention Rules ---
  if (assessment.priorities.some(p => p.toLowerCase().includes("sugary"))) {
    plan.dietary_intervention.target = "Reduce frequent sugary snacks";
    plan.dietary_intervention.suggestion = `Use the child's preferred ${preferredTexture} texture to offer lower-sugar alternatives. Track acceptance and refusal in the daily monitoring screen.`;
  } else if (assessment.dietary_risk_score > 50) {
    plan.dietary_intervention.target = "Expand food repertoire";
    plan.dietary_intervention.suggestion = `Gradually introduce new foods alongside preferred ${preferredTexture} foods to minimize refusal episodes.`;
  }

  return plan;
}
