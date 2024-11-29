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
          plotPoint,
          
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