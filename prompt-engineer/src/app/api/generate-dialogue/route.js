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


  

    const systemPrompt = `You are an expert screenwriter tasked with generating a compelling scene between ${speakingCharacter.name} and ${otherCharacter.name}. 
    Your job is to create the next line of dialogue that naturally continues the existing conversation.  Your expertise in screenwriting should be reflected in the quality of the dialogue, ensuring it captures the emotional nuances, tone, and depth required for a successful screenplay.
    
    Key guidelines:
    - **Response Length:** ${responseLength}/100 (0 = extremely concise, 100 = highly detailed). 
    - **Emotional State:** Reflect the emotional intensity described for ${speakingCharacter.name}, using your screenwriting expertise to convey the right balance of emotions.
    - **Dialogue Style:** Adjust vocabulary, formality, and phrasing to match the intended dialogue style.
    - **Relationship:** Convey the nuances of the relationship between ${speakingCharacter.name} and ${otherCharacter.name}. Use subtle cues—whether warmth, tension, or detachment—depending on the closeness of the relationship.
    - **Conversational Continuity:** Maintain seamless flow with the previous lines, ensuring that the response directly follows from what has been said. 
    - **Character Consistency:** Ensure ${speakingCharacter.name}'s personality, motivations, and voice remain consistent.
    - **Subtext and Implications:** Consider the underlying thoughts, feelings, or motives that might not be explicitly stated. Ensure that the dialogue can imply emotions or intentions beyond what is directly said.
    
    Your expertise as a screenwriter should be evident in the attention to emotional depth, tension, timing, and subtext that drives great dialogue.`;
    
    
    const userPrompt = `You are an expert screenwriter creating a single line of dialogue that ${speakingCharacter.name} would say to ${otherCharacter.name}.
    
    **Scene Context:** ${sceneDescription}
    **Plot Development:** ${plotLine}
    
    **Previous Conversation:**
    ${dialogueHistory?.length > 0 
      ? dialogueHistory.map(line => 
          `${line.character === 'character1' ? speakingCharacter.name : otherCharacter.name}: ${line.text}`
        ).join('\n')
      : 'No previous dialogue'}
    
    **Speaking Character (${speakingCharacter.name}):**
    - **Current State:** ${speakingCharacter.description}
    - **Attributes:**
      - **Emotional State:** ${speakingCharacter.attributes.EmotionalState.value}% towards ${speakingCharacter.attributes.EmotionalState.rightLabel} and ${(100 - speakingCharacter.attributes.EmotionalState.value)}% towards ${speakingCharacter.attributes.EmotionalState.leftLabel}. Use your screenwriting skills to reflect the appropriate emotional tone, combining both emotional states in the right proportion.
      - **Dialogue Style:** ${speakingCharacter.attributes.DialogueStyle.value}% towards ${speakingCharacter.attributes.DialogueStyle.rightLabel} and ${(100 - speakingCharacter.attributes.DialogueStyle.value)}% towards ${speakingCharacter.attributes.DialogueStyle.leftLabel}. Adjust vocabulary, formality, and phrasing to reflect the right balance of both styles.
      - **Relationship:** ${speakingCharacter.attributes.Relationships.value}% towards ${speakingCharacter.attributes.Relationships.rightLabel} and ${(100 - speakingCharacter.attributes.Relationships.value)}% towards ${speakingCharacter.attributes.Relationships.leftLabel}. Use subtle cues to reflect the relationship status, balancing both sides appropriately.
    
    **Other Character (${otherCharacter.name}):**
    - **Current State:** ${otherCharacter.description}
    
    **Guidelines for Generation:**
    - **Response Length Control:** Generate a response with a length of ${responseLength}/100. A low value should be brief and direct, while a high value should be more detailed and descriptive.
    - **Emotional Tone Impact:** Make sure the emotional intensity matches the given value. Use tone shifts and word choices to convey the right level of emotion, balancing both emotional states.
    - **Dialogue Style Influence:** Adjust the level of formality or casualness based on the given value. Use a mix of both styles depending on the slider position.
    - **Relationship Reflection:** Show how ${speakingCharacter.name} perceives ${otherCharacter.name} based on the given value. Use subtle cues to reflect this balance.
    
    Based on the previous conversation, generate ${speakingCharacter.name}'s next line of dialogue. Complete the dialogue: do not end with incomplete sentences. Do not include character names or quotation marks. Be specific, align with the character attributes, and let your screenwriting expertise shine through in the emotional depth, pacing, and natural flow of the dialogue.`;
    
//     const systemPrompt = `You are a dialogue generator for a scene between ${speakingCharacter.name} and ${otherCharacter.name}. 
// Your task is to generate the next line of dialogue that continues the existing conversation naturally. On a scale of 0 to 100, where 0 is extremely concise and 100 is highly detailed, your response length should be ${responseLength}. 
// Generate a single line of dialogue that ${speakingCharacter.name} would say to ${otherCharacter.name}

// Key guidelines:
// - Response length: ${responseLength}/100 (0=extremely concise, 100=highly detailed)
// - Maintain conversational continuity with the previous dialogue
// - Consider character attributes and current emotional states
// - Ensure the response directly addresses or follows from the last spoken lines
// - Keep the character's voice consistent`;




// const userPrompt = `On a scale of 0 to 100, where 0 is extremely concise and 100 is highly detailed, your response length should be ${responseLength}. 
// Generate a single line of dialogue that ${speakingCharacter.name} would say to ${otherCharacter.name} Scene Context: ${sceneDescription}
// Plot Development: ${plotLine}

// Previous Conversation:
// ${dialogueHistory?.length > 0 
//   ? dialogueHistory.map(line => 
//       `${line.character === 'character1' ? speakingCharacter.name : otherCharacter.name}: ${line.text}`
//     ).join('\n')
//   : 'No previous dialogue'}

// Speaking Character (${speakingCharacter.name}):
// Current State: ${speakingCharacter.description}
// Current Attributes:
// - Emotional State: ${speakingCharacter.attributes.EmotionalState.value}% out of 100 towards ${speakingCharacter.attributes.EmotionalState.rightLabel}
// - Dialogue Style: ${speakingCharacter.attributes.DialogueStyle.value}% out of 100 towards ${speakingCharacter.attributes.DialogueStyle.rightLabel}
// - Relationship: ${speakingCharacter.attributes.Relationships.value}% out of 100 towards ${speakingCharacter.attributes.Relationships.rightLabel}

// Other Character (${otherCharacter.name}):
// Current State: ${otherCharacter.description}

// Based on the previous conversation, generate ${speakingCharacter.name}'s next line of dialogue. Do not include character names or quotation marks.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: Math.max(30, Math.floor(responseLength * 2))  // Scale tokens with response length
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