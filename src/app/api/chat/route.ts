import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { mockChild, mockAssessments } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Recent clinical metrics
    const recentAssessment = mockAssessments[mockAssessments.length - 1];

    // Rich domain-specialized system prompt for ASD Oral Care
    const systemPrompt = `You are the ASD Bot, an empathetic, highly specialized AI pediatric dental and behavioral expert for caregivers of children with Autism Spectrum Disorder (ASD).

Child Profile Context:
- Child ID: ASD-001 (Leo), Age: ${mockChild.age} years old
- ASD Level: ${mockChild.communication_level}
- Sensory Sensitivities: 
  * Taste: ${mockChild.sensory_profile.taste}
  * Touch: ${mockChild.sensory_profile.touch}
  * Sound/Vibration: Sensitive to electric toothbrush whirring
- Food Selectivity: ${mockChild.food_selectivity}
- Recent AI Assessment:
  * Oral Hygiene Index: ${recentAssessment.oral_hygiene_score}%
  * Sensory Difficulty Index: ${recentAssessment.sensory_difficulty_score}%
  * Dietary Risk Index: ${recentAssessment.dietary_risk_score}%
- Current Clinical Priorities: ${recentAssessment.priorities.join(", ")}

Guiding Principles:
1. Provide actionable, evidence-based pediatric oral care advice tailored to neurodivergent sensory profiles (e.g., non-foaming unflavored toothpaste, visual step-by-step schedules, social stories, gradual desensitization).
2. Maintain a warm, encouraging, non-judgmental tone with caregivers who may be feeling overwhelmed.
3. Keep responses concise, structured (using bullet points where helpful), and practical.
4. ALWAYS conclude responses with the mandatory clinical disclaimer:
"This guidance is supportive and does not replace professional dental or medical assessment."`;

    if (!apiKey) {
      return NextResponse.json({
        message: `Based on Leo's profile and current oral hygiene score (${recentAssessment.oral_hygiene_score}%), I recommend using the visual sequencing cards before tonight's routine and trying a gentle 3-sided soft brush with unflavored toothpaste.\n\nThis guidance is supportive and does not replace professional dental or medical assessment.`
      });
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Format chat history if provided, or build single turn
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.role === 'user' || item.role === 'assistant') {
          messages.push({
            role: item.role,
            content: item.content,
          });
        }
      }
    }

    // Append current message if not already included
    if (messages.length === 0 || messages[messages.length - 1].content !== message) {
      messages.push({
        role: 'user',
        content: message,
      });
    }

    // Call Claude API (Claude Sonnet)
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const responseText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n');

    return NextResponse.json({
      message: responseText,
      model: response.model,
    });

  } catch (error: any) {
    console.error("Claude API Error:", error);
    
    // Fallback message with graceful error handling
    return NextResponse.json(
      { 
        message: `I encountered a momentary connection issue. In the meantime, remember to use gradual desensitization and visual schedule cards to support your child during brushing routines.\n\nThis guidance is supportive and does not replace professional dental or medical assessment.`,
        error: error?.message || "Internal server error"
      }, 
      { status: 200 }
    );
  }
}
