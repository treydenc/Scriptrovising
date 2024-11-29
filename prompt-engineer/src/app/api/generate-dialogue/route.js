// src/app/api/generate-dialogue/route.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const {
      speakingCharacter,
      otherCharacter,
      sceneDescription,
      plotLine
    } = await request.json();

    console.log('API received request:', {
      speakingCharacter,
      otherCharacter,
      sceneDescription,
      plotLine
    });

    const systemPrompt = `You are a dialogue generator for a scene between two characters.
Generate a single line of realistic dialogue that ${speakingCharacter.name} would say to ${otherCharacter.name}.`;

const userPrompt = `Scene Context: ${sceneDescription}
Plot Development: ${plotLine}

Speaking Character (${speakingCharacter.name}):
Current State: ${speakingCharacter.description}
Current Attributes:
- Emotional State: ${speakingCharacter.attributes.EmotionalState.value}% out of 100 towards ${speakingCharacter.attributes.EmotionalState.rightLabel}
- Dialogue Style: ${speakingCharacter.attributes.DialogueStyle.value}% out of 100 towards ${speakingCharacter.attributes.DialogueStyle.rightLabel}
- Relationship: ${speakingCharacter.attributes.Relationships.value}% out of 100 towards ${speakingCharacter.attributes.Relationships.rightLabel}

Other Character (${otherCharacter.name}):
Current State: ${otherCharacter.description}

Generate only the dialogue line that ${speakingCharacter.name} would say next. Do not include character names or quotation marks. NO quotation marks at all!`;

    console.log('Sending prompt to OpenAI:', { systemPrompt, userPrompt });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const dialogue = completion.choices[0].message.content.trim();
    console.log('Generated dialogue:', dialogue);

    return Response.json({ dialogue });
    
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate dialogue' },
      { status: 500 }
    );
  }
}