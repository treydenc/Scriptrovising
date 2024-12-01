// src/app/api/generate-scene/route.js
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define dialogue line schema
const DialogueLine = z.object({
  character: z.enum(["character1", "character2"]),
  text: z.string(),
  timestamp: z.string()
});

// Define scene response schema
const SceneResponse = z.object({
  dialogue: z.array(DialogueLine)
});

// Input validation schema
const SceneInputSchema = z.object({
  characters: z.object({
    character1: z.object({
      name: z.string(),
      description: z.string()
    }),
    character2: z.object({
      name: z.string(),
      description: z.string()
    })
  }),
  sceneDescription: z.string(),
  plotPoint: z.string(),
  previousDialogue: z.array(DialogueLine).optional(),
  previousPlotPoint: z.string().optional()
});

export async function POST(request) {
  try {
    const rawData = await request.json();
    console.log('Received request data:', JSON.stringify(rawData, null, 2));

    // Validate input data
    const validatedData = SceneInputSchema.parse(rawData);
    const {
      characters,
      sceneDescription,
      plotPoint,
      previousDialogue = [],
      previousPlotPoint = ''
    } = validatedData;

    const systemPrompt = `You are a dialogue scene generator focused on creating continuous, cohesive dialogue scenes. 
    Your task is to directly continue an ongoing conversation between two characters, ensuring:
    
    1. Each new line follows naturally from the last spoken line
    2. References specific details from the previous dialogue
    3. Maintains consistent character voices and personalities
    4. Advances the plot while staying true to character motivations
    5. Generate 3-6 exchanges that feel like a natural continuation
    
    Format Requirements:
    - Each line must be a direct response to the previous speaker
    - Character identifiers must be "character1" or "character2"
    - Dialogue should feel natural and in-character`;
    
    const userPrompt = `Scene Context: ${sceneDescription}
    
    Characters:
    ${characters.character1.name} (character1): ${characters.character1.description}
    ${characters.character2.name} (character2): ${characters.character2.description}
    
    Previous Exchange:
    ${previousDialogue.length > 0 
      ? previousDialogue
          .map(line => `${characters[line.character].name}: "${line.text}"`)
          .join('\n')
      : 'Starting conversation'}
    
    Last Line Spoken: "${previousDialogue[previousDialogue.length - 1]?.text || 'None'}"
    Previous Plot Point: ${previousPlotPoint || 'None'}
    Current Plot Point to Address: ${plotPoint}
    
    Generate the next part of this conversation, picking up where the last line left off.`;

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
    // Return a more detailed error response
    return Response.json(
      { 
        error: error.message || 'Failed to generate scene',
        details: error.errors || error.stack || 'No additional details',
        receivedData: error.data || 'No data available'
      },
      { status: 500 }
    );
  }
}