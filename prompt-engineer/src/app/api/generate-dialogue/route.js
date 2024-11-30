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
      plotLine,
      responseLength,
      dialogueHistory
    } = await request.json();

    const systemPrompt = `You are a dialogue generator for a scene between ${speakingCharacter.name} and ${otherCharacter.name}. 
Your task is to generate the next line of dialogue that continues the existing conversation naturally. On a scale of 0 to 100, where 0 is extremely concise and 100 is highly detailed, your response length should be ${responseLength}. 
Generate a single line of dialogue that ${speakingCharacter.name} would say to ${otherCharacter.name}

Key guidelines:
- Response length: ${responseLength}/100 (0=extremely concise, 100=highly detailed)
- Maintain conversational continuity with the previous dialogue
- Consider character attributes and current emotional states
- Ensure the response directly addresses or follows from the last spoken lines
- Keep the character's voice consistent`;

const userPrompt = `On a scale of 0 to 100, where 0 is extremely concise and 100 is highly detailed, your response length should be ${responseLength}. 
Generate a single line of dialogue that ${speakingCharacter.name} would say to ${otherCharacter.name} Scene Context: ${sceneDescription}
Plot Development: ${plotLine}

Previous Conversation:
${dialogueHistory?.length > 0 
  ? dialogueHistory.map(line => 
      `${line.character === 'character1' ? speakingCharacter.name : otherCharacter.name}: ${line.text}`
    ).join('\n')
  : 'No previous dialogue'}

Speaking Character (${speakingCharacter.name}):
Current State: ${speakingCharacter.description}
Current Attributes:
- Emotional State: ${speakingCharacter.attributes.EmotionalState.value}% out of 100 towards ${speakingCharacter.attributes.EmotionalState.rightLabel}
- Dialogue Style: ${speakingCharacter.attributes.DialogueStyle.value}% out of 100 towards ${speakingCharacter.attributes.DialogueStyle.rightLabel}
- Relationship: ${speakingCharacter.attributes.Relationships.value}% out of 100 towards ${speakingCharacter.attributes.Relationships.rightLabel}

Other Character (${otherCharacter.name}):
Current State: ${otherCharacter.description}

Based on the previous conversation, generate ${speakingCharacter.name}'s next line of dialogue. Do not include character names or quotation marks.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: Math.max(30, Math.floor(responseLength * 1.5))  // Scale tokens with response length
    });

    const dialogue = completion.choices[0].message.content.trim();
    return Response.json({ dialogue });
    
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate dialogue' },
      { status: 500 }
    );
  }
}