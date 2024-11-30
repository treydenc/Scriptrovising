export async function generateScene({
    characters,
    sceneDescription,
    plotPoint,
    previousDialogue,
    previousPlotPoint
  }) {
    // Log the complete input data
    console.log('=== SCENE GENERATION REQUEST ===');
    console.log('Characters:');
    console.log(JSON.stringify(characters, null, 2));
    console.log('\nScene Description:', sceneDescription);
    console.log('\nPlot Point:', plotPoint);
    console.log('\nPrevious Plot Point:', previousPlotPoint);
    console.log('\nPrevious Dialogue:');
    console.log(JSON.stringify(previousDialogue, null, 2));
    console.log('==============================');
  
    try {
      const requestBody = {
        characters,
        sceneDescription,
        plotPoint,
        previousDialogue,
        previousPlotPoint
      };
  
      // Log the actual request being sent
      console.log('=== API REQUEST PAYLOAD ===');
      console.log(JSON.stringify(requestBody, null, 2));
      console.log('=========================');
  
      const response = await fetch('/api/generate-scene', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('=== API ERROR ===');
        console.error('Status:', response.status);
        console.error('Error Data:', errorData);
        console.error('================');
        throw new Error(errorData.error || 'Failed to generate scene');
      }
  
      const data = await response.json();
      
      // Log the API response
      console.log('=== API RESPONSE ===');
      console.log(JSON.stringify(data, null, 2));
      console.log('==================');
  
      // Validate the dialogue structure
      if (!Array.isArray(data.dialogue)) {
        console.error('Invalid dialogue format:', data);
        throw new Error('Invalid dialogue format received');
      }
  
      // Validate each dialogue line
      data.dialogue.forEach((line, index) => {
        if (!line.character || !line.text) {
          console.error(`Invalid dialogue line at index ${index}:`, line);
          throw new Error(`Invalid dialogue line at position ${index}`);
        }
        if (line.character !== 'character1' && line.character !== 'character2') {
          console.error(`Invalid character identifier at index ${index}:`, line);
          throw new Error(`Invalid character identifier at position ${index}`);
        }
      });
  
      return data.dialogue;
    } catch (error) {
      console.error('=== SCENE GENERATION ERROR ===');
      console.error('Error:', error);
      console.error('Stack:', error.stack);
      console.error('=============================');
      throw new Error(`Failed to generate scene: ${error.message}`);
    }
  }