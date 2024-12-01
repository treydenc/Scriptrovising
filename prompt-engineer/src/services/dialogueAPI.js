export async function generateDialogue({
  speakingCharacter,
  otherCharacter,
  sceneDescription,
  plotLine,
  responseLength,
  dialogueHistory
}) {
  console.log('Sending data to API:', {
    speakingCharacter,
    otherCharacter,
    sceneDescription,
    plotLine,
    responseLength,
    dialogueHistory
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
        plotLine,
        responseLength,
        dialogueHistory
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