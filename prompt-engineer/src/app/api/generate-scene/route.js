// src/app/api/generate-scene/route.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const {
      characters,
      sceneDescription,
      plotPoint,
      previousDialogue,
      previousPlotPoint
    } = await request.json();

    // Format previous dialogue for context
    const previousLines = previousDialogue?.length > 0 
      ? `Previous Dialogue:\n${previousDialogue
          .map(line => `${line.character === 'character1' ? characters.character1.name : characters.character2.name}: ${line.text}`)
          .join('\n')}`
      : 'No previous dialogue';

    const systemPrompt = `You are a dialogue scene generator focused on advancing specific plot points through character interactions. Your task is to generate dialogue that explicitly moves the story toward the given plot points while maintaining character authenticity.

Key Requirements:
- Each line of dialogue must clearly contribute to advancing the plot point
- Keep the conversation focused on achieving the plot goal
- Maintain character voices and personalities
- Always Format lines as "character1: [dialogue]" or "character2: [dialogue]"
- Generate 3-8 exchanges that directly progress toward the plot point`;

    const userPrompt = `Scene Context: ${sceneDescription}

Characters:
${characters.character1.name}: ${characters.character1.description}
${characters.character2.name}: ${characters.character2.description}

Previous Plot Point: ${previousPlotPoint || 'Starting scene'}

${previousLines}

Current Plot Point: ${plotPoint} must continue with the topics and ideas of what previously happened in the scene.
Generate the next part of the conversation, ensuring it builds naturally from any previous dialogue while driving directly toward the current plot point.`;

    console.log('Sending prompt to OpenAI:', { systemPrompt, userPrompt });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    // Parse the response into dialogue objects
    const dialogueText = completion.choices[0].message.content;
    const dialogueLines = dialogueText.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [character, ...textParts] = line.split(':');
        const text = textParts.join(':').trim();
        const characterKey = character.trim().toLowerCase() === characters.character1.name.toLowerCase() 
          ? 'character1' 
          : 'character2';
        return {
          character: characterKey,
          text: text,
          timestamp: new Date().toISOString()
        };
      });

    return Response.json({ dialogue: dialogueLines });
    
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Failed to generate scene' },
      { status: 500 }
    );
  }
}