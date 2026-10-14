import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { mockChild, mockAssessments } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const { 
      message, 
      history, 
      childName, 
      childAge,
      asdLevel, 
      sensoryProfile,
      brushingHabits,
      dietaryHabits,
      dentalMedicalHistory,
      childBehaviour,
      questionnaire,
      dailyLog
    } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Use real child data from the frontend if available, else fall back to default
    const recentAssessment = mockAssessments[mockAssessments.length - 1];
    const activeChildName = childName || "your child";
    const activeChildAge = childAge ? `${childAge} years old` : "child";
    const activeAsdLevel = asdLevel || "Registered ASD Profile";
    const sensoryTriggers = Array.isArray(sensoryProfile) && sensoryProfile.length > 0
      ? sensoryProfile.join(", ")
      : (questionnaire?.q20_sensoryTriggers?.join(", ") || "Toothpaste foaming, bristle vibrations, strong mint");
    
    const brushType = brushingHabits?.toothbrushType || questionnaire?.q3_toothbrushType || "Standard toothbrush";
    const brushPaste = brushingHabits?.toothpaste || questionnaire?.q4_toothpaste || "Standard paste";
    const brushFreq = brushingHabits?.frequency || questionnaire?.q1_brushFrequency || "Once daily";
    const brushDifficulties = Array.isArray(brushingHabits?.difficulties) && brushingHabits.difficulties.length > 0
      ? brushingHabits.difficulties.join(", ")
      : (questionnaire?.q7_brushingDifficulties?.join(", ") || "Oral resistance, clenching");
    const foodHolding = dietaryHabits?.foodHoldingInMouth || questionnaire?.q13_foodHolding || "None reported";
    const motorSkills = childBehaviour?.motorSkills || questionnaire?.q19_motorSkills || "Developing motor skills";

    // Format today's Daily Oral Hygiene Checklist
    const dailyStatus = dailyLog ? `
## Today's Daily Oral Hygiene Checklist Log:
- Morning Brushing: ${dailyLog.brushedMorning ? "✅ Done" : "❌ Missed"}
- Bedtime Brushing: ${dailyLog.brushedNight ? "✅ Done" : "❌ Not yet / Missed"}
- Allowed Tongue/Mouth Cleaning: ${dailyLog.allowedTongueCleaning ? "✅ Yes" : "❌ No"}
- Additional Aids (Floss, Interdental brush): ${dailyLog.usedAdditionalAids ? "✅ Yes" : "❌ No"}
- Diet: Breakfast (${dailyLog.healthyBreakfast ? "Healthy" : "Not marked"}), Lunch (${dailyLog.healthyLunch ? "Healthy" : "Not marked"}), Dinner (${dailyLog.healthyDinner ? "Healthy" : "Not marked"})
- Drank Sufficient Water: ${dailyLog.drankSufficientWater ? "✅ Yes" : "❌ No"}
- Sugary snacks / drinks today: ${dailyLog.consumedSugarySnacksDrinks ? "⚠️ Yes consumed" : "No"}
- Sticky food (chocolate) today: ${dailyLog.consumedStickyFood ? "⚠️ Yes consumed" : "No"}
- Snacks in between meals: ${dailyLog.consumedSnacksBetweenMeals ? "⚠️ Yes" : "No"}
- Brushes Independently: ${dailyLog.brushesIndependently ? "Yes" : "No"}
- Cooperated With Brushing: ${dailyLog.cooperatedWithBrushing ? "Yes" : "No"}
- Experienced Crying / Resistance Today: ${dailyLog.showResistanceOrCrying ? "⚠️ YES, child cried/resisted today" : "No"}
` : "";

    // Argus – specialized system prompt with deep user questionnaire context
    const systemPrompt = `You are **Argus**, a compassionate, expert AI oral health companion for parents and caregivers of children with Autism Spectrum Disorder (ASD). You specialize in pediatric oral health, ASD behavioral strategies, sensory desensitization, and caregiver support.

## Active Child Profile (From Clinical Intake Questionnaire)
- **Child's Name:** ${activeChildName} (${activeChildAge})
- **ASD Classification:** ${activeAsdLevel}
- **Toothbrush Type:** ${brushType}
- **Toothpaste Used:** ${brushPaste}
- **Brushing Frequency:** ${brushFreq}
- **Known Brushing Challenges:** ${brushDifficulties}
- **Sensory Sensitivities:** ${sensoryTriggers}
- **Food Pocketing / Holding Behavior:** ${foodHolding}
- **Fine Motor Skills:** ${motorSkills}
- **Baseline Oral Health Score:** ${recentAssessment.oral_hygiene_score}%
${dailyStatus}

## Your Core Responsibilities
1. **Evidence-Based Advice:** Provide actionable, clinically grounded pediatric oral care strategies tailored specifically for ${activeChildName} based on the questionnaire data above (e.g., sensory-safe toothpaste, visual step schedules, desensitization ladders, social stories).
2. **Warm & Empowering Tone:** Caregivers are often exhausted and anxious. Always affirm their efforts, celebrate small wins, and use encouraging language.
3. **Structured Responses:** Use bullet points, numbered steps, or short paragraphs. Avoid overwhelming walls of text.
4. **Personalized Context:** Always reference ${activeChildName}'s specific habits, sensitivities, or toothbrush type when answering.
5. **Safety First:** For urgent dental pain, bleeding, or emergencies, always direct caregivers to seek professional dental or medical care immediately.

## Communication Style
- Use friendly, accessible language (avoid excessive jargon).
- Use relevant emojis sparingly to add warmth (e.g., 🦷 🪥 💙 ✅).
- Keep responses concise but complete — 3 to 6 bullet points or 2-3 short paragraphs is ideal.
- Use **bold** for key terms and action steps.

## Mandatory Disclaimer
Always conclude every response with this note on a new line:
*This guidance is supportive and does not replace professional dental or medical assessment.*`;

    if (!apiKey) {
      const q = message.toLowerCase();
      let dynamicReply = "";

      if (q.includes("refus") || q.includes("open") || q.includes("clench") || q.includes("tantrum") || q.includes("resist") || q.includes("cry")) {
        dynamicReply = `I understand how overwhelming brushing resistance can feel with **${activeChildName}** (challenges noted: *${brushDifficulties}*). Here is a gentle, sensory-attuned clinical protocol:

1. **Step-by-Step Desensitization:** Do not jump straight to the teeth. Start by gently touching the lips with a clean finger or soft wet gauze, count to 5 together, then celebrate.
2. **Predictable Visual Schedule:** Use a visual countdown (a visual sand timer or a 2-minute favorite melody). Children with ASD thrive when they know *exactly* when an activity will conclude.
3. **Choice and Control:** Offer two acceptable choices (e.g., *"Do you want to brush the top teeth or bottom teeth first?"* or *"Do you want the blue or yellow brush?"*).
4. **Sensory-Attuned Pace:** Given ${activeChildName}'s profile (${sensoryTriggers}), aim for 30 calm seconds today instead of a 2-minute struggle. Consistency beats force every single time. 🌟`;
      } else if (q.includes("toothpaste") || q.includes("paste") || q.includes("foam") || q.includes("flavor") || q.includes("flavour") || q.includes("mint") || q.includes("taste")) {
        dynamicReply = `Sensory aversion to toothpaste is very common in autism. For **${activeChildName}** (currently using: *${brushPaste}*):

1. **Eliminate Foaming (SLS-Free):** Standard sodium lauryl sulfate creates foaming that triggers gag reflexes and sensory panic. Choose non-foaming, SLS-free pastes (e.g., Oranurse unflavored, Biotene, or gentle xylitol gels).
2. **Ditch Harsh Mint:** Mint activates cold/pain thermoreceptors that feel like burning to sensory-defensive children. Opt for unflavored, mild fruit, or apple-cinnamon flavors.
3. **Dry Brushing First:** Start brushing with just warm water to remove plaque mechanically, then introduce a tiny rice-grain smear of paste once comfortable.`;
      } else if (q.includes("brush") || q.includes("toothbrush") || q.includes("electric") || q.includes("3-sided") || q.includes("triple")) {
        dynamicReply = `Selecting the right toothbrush for **${activeChildName}** (currently using: *${brushType}*):

1. **Triple-Headed (3-Sided) Brush:** Hugs all 3 tooth surfaces (front, back, and biting surface) simultaneously. This cuts required brushing time by over 50% while guaranteeing coverage.
2. **Ultra-Soft Microbristles:** Avoid medium or stiff bristles that cause gingival microtrauma. Look for 10,000+ nano-bristle brushes with velvety softness.
3. **Electric Sonic Brushes:** While some children enjoy the soothing rhythmic vibration, others experience it as painful buzzing (${sensoryTriggers.includes("vibration") ? "⚠️ Warning: vibration sensitivity detected in profile!" : "test gently first"}). Test the vibration on **${activeChildName}**'s hand or arm first before bringing it to the mouth.`;
      } else if (q.includes("pool") || q.includes("holding") || q.includes("cheek") || q.includes("pouch") || q.includes("swallow") || q.includes("food")) {
        dynamicReply = `Food pouching or holding food in cheeks is a frequent oral-motor sensory behavior (Status for ${activeChildName}: *${foodHolding}*):

1. **High Enamel Risk:** Pocketed carbohydrates (like rice, bread, or biscuits) ferment rapidly in the cheek pouch, bathing molars in acid and accelerating cavities.
2. **Post-Meal Swish Routine:** Introduce a "water swirl" habit immediately after eating. Make it a fun game: *"Let's see who can make the loudest swirl sound!"*
3. **Cheek Massage:** After meals, gently stroke **${activeChildName}**'s cheeks from back to front with warm hands to help prompt sensory awareness and swallowing.`;
      } else if (q.includes("dentist") || q.includes("visit") || q.includes("clinic") || q.includes("doctor") || q.includes("appointment")) {
        dynamicReply = `Preparing **${activeChildName}** for a clinical dental visit requires desensitization well in advance:

1. **Social Stories & Picture Cards:** Read a simple picture story showing the waiting room, the big reclining chair, the sunglasses for the bright overhead light, and the mirror tool.
2. **Sensory Comfort Kit:** Bring sunglasses to block bright operatory lamps, noise-canceling headphones for suction noises, and a weighted comfort toy for the lap.
3. **Desensitization "Meet & Greet":** Schedule a zero-procedure appointment where **${activeChildName}** simply sits in the chair, counts teeth with the pediatric dentist, gets a sticker, and leaves with positive memories.`;
      } else if (q.includes("diet") || q.includes("sugar") || q.includes("snack") || q.includes("night") || q.includes("bottle") || q.includes("milk")) {
        dynamicReply = `Dietary enamel defense strategy for **${activeChildName}**:

1. **Eliminate Bedtime Milk Bottles:** Nursing or sipping milk bottles during the night allows milk sugars (lactose) to pool around teeth while saliva flow drops, leading to aggressive decay.
2. **Structured Snack Windows:** Rather than frequent carbohydrate grazing, group treats with main meals when natural saliva production is at its peak to buffer acid.
3. **Enamel-Friendly Crunchy Foods:** Crunchy apples, cucumbers, and carrot sticks naturally scrape plaque and stimulate mineralizing saliva.`;
      } else {
        dynamicReply = `Based on **${activeChildName}**'s stored clinical profile (${activeAsdLevel}) and intake questionnaire:

• **Sensory Triggers on Record:** ${sensoryTriggers}
• **Current Toothbrush & Paste:** ${brushType} with ${brushPaste}
• **Brushing Frequency:** ${brushFreq}
• **Oral-Motor / Attitude:** ${motorSkills}

**Recommended Next Step:**
Keep routines completely predictable by brushing at the exact same hour and bathroom setting every day. Use non-foaming paste and a visual timer to give ${activeChildName} a safe, reassuring routine! 🌟`;
      }

      return NextResponse.json({
        message: `${dynamicReply}\n\n*This guidance is supportive and does not replace professional dental or medical assessment.*`
      });
    }

    const anthropic = new Anthropic({ apiKey });

    // Format chat history
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (item.role === 'user' || item.role === 'assistant') {
          messages.push({ role: item.role, content: item.content });
        }
      }
    }

    if (messages.length === 0 || messages[messages.length - 1].content !== message) {
      messages.push({ role: 'user', content: message });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const responseText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n');

    return NextResponse.json({ message: responseText, model: response.model });

  } catch (error: any) {
    console.error("Argus API Error:", error);
    return NextResponse.json(
      {
        message: `I'm momentarily offline 🌿 — but here's a quick tip: **consistent routines and sensory-safe tools** are the most powerful strategies for ASD oral care. Try a non-foaming toothpaste and a predictable 2-minute visual timer to ease resistance.\n\n*This guidance is supportive and does not replace professional dental or medical assessment.*`,
        error: error?.message || "Internal server error"
      },
      { status: 200 }
    );
  }
}
