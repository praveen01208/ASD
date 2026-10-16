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
    const systemPrompt = `You are **Argus**, a gentle, supportive AI oral care companion for parents and caregivers of children with Autism Spectrum Disorder (ASD).

## Active Child Profile (From Clinical Intake Questionnaire)
- **Child's Name:** ${activeChildName} (${activeChildAge})
- **ASD Classification:** ${activeAsdLevel}
- **Toothbrush Type:** ${brushType}
- **Toothpaste Used:** ${brushPaste}
- **Brushing Frequency:** ${brushFreq}
- **Known Challenges:** ${brushDifficulties}
- **Sensory Sensitivities:** ${sensoryTriggers}
- **Food Holding In Cheek:** ${foodHolding}
- **Motor Skills:** ${motorSkills}
- **Baseline Oral Score:** ${recentAssessment.oral_hygiene_score}%
${dailyStatus}

## MANDATORY FORMATTING RULE: ALWAYS SIMPLE & STEPWISE
Parents of children with ASD are often tired and stressed. Keep all answers ultra-simple, gentle, and strictly sequential.
You MUST format EVERY response into clear numbered steps like this:

**Step 1: [Short, simple action title]**
• [1 or 2 plain, easy-to-follow sentences that a busy parent can do right now]

**Step 2: [Next action title]**
• [1 or 2 plain sentences]

**Step 3: [Next action title]**
• [1 or 2 plain sentences]

**Step 4: [Warm encouraging tip for ${activeChildName}]**
• [1 encouraging sentence]

RULES:
- Plain English only (5th-grade reading level).
- Absolutely NO medical jargon or long paragraphs.
- Keep each step ultra-short (1-2 sentences maximum).
- Tailor advice to ${activeChildName}'s specific sensitivities: ${sensoryTriggers}.

## Mandatory Disclaimer
Conclude every response on a new line:
*This guidance is supportive and does not replace professional dental or medical assessment.*`;

    if (!apiKey) {
      const q = message.toLowerCase();
      let dynamicReply = "";

      if (q.includes("refus") || q.includes("open") || q.includes("clench") || q.includes("tantrum") || q.includes("resist") || q.includes("cry")) {
        dynamicReply = `Here is a gentle, 4-step way to help **${activeChildName}** brush without crying:

**Step 1: Start with gentle touch (No brush yet)**
• Gently touch your child's lips with a soft wet washcloth or clean finger for 5 seconds. This prepares their mouth calmly.

**Step 2: Use a predictable timer or song**
• Play a favorite 1-minute song or visual timer so ${activeChildName} knows exactly when brushing will finish.

**Step 3: Let your child make a small choice**
• Ask: *"Do you want to brush top teeth first or bottom teeth first?"* Giving a choice gives them a feeling of calm control.

**Step 4: Celebrate even 20 seconds!**
• Stop before crying starts, clap, and say: *"Great job taking care of your teeth!"* Small calm steps win every day. 🌟`;
      } else if (q.includes("toothpaste") || q.includes("paste") || q.includes("foam") || q.includes("flavor") || q.includes("flavour") || q.includes("mint") || q.includes("taste")) {
        dynamicReply = `Here is an easy 3-step guide for toothpaste with **${activeChildName}**:

**Step 1: Switch to non-foaming (SLS-free) paste**
• Foaming paste causes choking sensations. Choose a non-foaming paste like Oranurse or a gentle clear fruit gel.

**Step 2: Avoid strong mint flavors**
• Mint feels like burning ice to sensitive mouths. Use mild fruit, strawberry, or completely unflavored paste.

**Step 3: Use a tiny rice-grain smear**
• You only need a tiny dot on the bristles. Less paste means less sensory struggle and better cooperation. 🪥`;
      } else if (q.includes("brush") || q.includes("toothbrush") || q.includes("electric") || q.includes("3-sided") || q.includes("triple")) {
        dynamicReply = `Here is a 3-step guide to pick the best brush for **${activeChildName}**:

**Step 1: Try a 3-sided (triple-headed) toothbrush**
• It cleans the front, back, and biting surfaces all at once, cutting brushing time in half.

**Step 2: Pick ultra-soft microbristles**
• Very soft bristles feel like a gentle massage and will not hurt sensitive gums.

**Step 3: Test vibrations on the hand first**
• If trying an electric brush, place it against ${activeChildName}'s arm or hand first so the buzzing feels safe and fun. 🌟`;
      } else if (q.includes("pool") || q.includes("holding") || q.includes("cheek") || q.includes("pouch") || q.includes("swallow") || q.includes("food")) {
        dynamicReply = `Here is a 3-step routine to help stop food holding in cheeks:

**Step 1: Play the "Water Swirl" game right after eating**
• Give ${activeChildName} a small cup of water and say: *"Let's swirl water like a washing machine and spit out the food bugs!"*

**Step 2: Gentle cheek stroke**
• Lightly stroke ${activeChildName}'s cheeks from back to front with warm fingers to remind their tongue to swallow.

**Step 3: Offer crunchy fruits as natural scrubbers**
• An apple slice or carrot stick naturally sweeps away soft food stuck in back molars. 🍎`;
      } else if (q.includes("dentist") || q.includes("visit") || q.includes("clinic") || q.includes("doctor") || q.includes("appointment")) {
        dynamicReply = `Here is a 3-step plan to prepare **${activeChildName}** for the dentist:

**Step 1: Read a picture story at home**
• Show pictures of the big comfortable dental chair, the friendly doctor, and the count-teeth mirror.

**Step 2: Pack a comfort kit**
• Bring dark sunglasses for the overhead light and noise-canceling headphones to block strange suction sounds.

**Step 3: Do a quick "Say Hello" practice visit**
• Visit just to sit in the chair for 2 minutes, get a sticker from Dr. Reddy's team, and head home smiling! 🩺`;
      } else if (q.includes("diet") || q.includes("sugar") || q.includes("snack") || q.includes("night") || q.includes("bottle") || q.includes("milk")) {
        dynamicReply = `Here are 3 simple steps to keep **${activeChildName}**'s teeth shiny and free from sugar bugs:

**Step 1: Give treats with meals, not all day**
• Eating chocolates or sweets with lunch is much safer than sipping sweet drinks throughout the afternoon.

**Step 2: No milk bottles in bed**
• Milk sugars pool around teeth while sleeping and feed bacteria. Stick to plain water at bedtime.

**Step 3: Drink a sip of water after snacks**
• A quick sip of water immediately washes away sugars before bacteria can start eating the enamel. 💧`;
      } else {
        dynamicReply = `Here is a simple stepwise routine for **${activeChildName}**:

**Step 1: Set a fixed time and spot**
• Brush at the exact same hour every morning and bedtime in the same gentle bathroom light.

**Step 2: Use soft bristles and mild paste**
• Apply a tiny pea-sized drop of non-foaming paste on ultra-soft bristles.

**Step 3: Follow 5 gentle circles**
• Brush front, back, and chewing surfaces with joyful circular motions while singing a 1-minute tune.

**Step 4: Celebrate the shiny smile!**
• High five ${activeChildName} for doing their best today! 🌟`;
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
