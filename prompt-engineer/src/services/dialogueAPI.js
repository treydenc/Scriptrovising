// src/services/dialogueApi.js
export async function generateDialogue({
  speakingCharacter,
  otherCharacter,
  sceneDescription,
  plotLine
}) {
  console.log('Sending data to API:', {
    speakingCharacter,
    otherCharacter,
    sceneDescription,
    plotLine
  });

  try {
    const response = await fetch('/api/generate-dialogue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speakingCharacter,
        otherCharacter,
        sceneDescription,
        plotLine
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate dialogue');
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data.dialogue;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
}

export async function generateScene({
  characters,
  sceneDescription,
  plotPoint
}) {
  console.log('Generating scene for plot point:', plotPoint);

  try {
    const response = await fetch('/api/generate-scene', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        characters,
        sceneDescription,
        plotPoint
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate scene');
    }

    const data = await response.json();
    return data.dialogue; // Array of dialogue objects
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
}