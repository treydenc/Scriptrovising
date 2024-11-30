import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define the schema for dialogue lines
const DialogueLine = z.object({
  character: z.enum(["character1", "character2"]),
  text: z.string(),
  timestamp: z.string()
});

// Define the scene response schema
const SceneResponse = z.object({
  dialogue: z.array(DialogueLine)
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

    const systemPrompt = `You are a dialogue scene generator focused on creating continuous, cohesive dialogue scenes. 
    Your task is to directly continue an ongoing conversation between two characters, ensuring:
    
    1. Each new line follows DIRECTLY from the last spoken line in the previous dialogue
    2. Reference specific details and points mentioned in the previous dialogue
    3. Maintain the ongoing emotional thread and tension
    4. Keep consistent character voices and personalities
    5. Generate dialogue that moves toward the plot goal while building on established context
    
    Format Requirements:
    - Each line must be a direct response to the previous speaker
    - Character identifiers must be "character1" or "character2"
    - Generate 3-6 exchanges that feel like a natural continuation`;
    
    const userPrompt = `Scene Context: ${sceneDescription}
    
    Characters:
    ${characters.character1.name} (character1): ${characters.character1.description}
    ${characters.character2.name} (character2): ${characters.character2.description}
    
    Previous Exchange:
    ${previousDialogue?.length > 0 
      ? previousDialogue
          .map(line => `${characters[line.character].name}: "${line.text}"`)
          .join('\n')
      : 'Starting conversation'}
    
    Last Line Spoken: "${previousDialogue?.[previousDialogue.length - 1]?.text || 'None'}"
    
    Plot Point to Address: ${plotPoint}
    
    Generate the next part of this conversation, picking up EXACTLY where the last line left off. The dialogue should feel like a seamless continuation of the existing exchange, particularly responding to Snape's last question about being prepared for the responsibility.`;

    console.log('Sending prompt to OpenAI:', { systemPrompt, userPrompt });

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: zodResponseFormat(SceneResponse, "scene"),
      temperature: 0.7,
      max_tokens: 500
    });

    const dialogueLines = completion.choices[0].message.parsed.dialogue.map(line => ({
      ...line,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));

    return Response.json({ dialogue: dialogueLines });
    
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate scene' },
      { status: 500 }
    );
  }
}