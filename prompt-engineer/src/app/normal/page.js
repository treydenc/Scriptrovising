// src/app/basic/page.js
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { generateScene } from '@/services/sceneAPI';
import { basicDefaultSceneData } from '@/data/default';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function BasicMode() {
  const [sceneData, setSceneData] = useState(basicDefaultSceneData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleCharacterUpdate = (characterId, updates) => {
    setSceneData(prev => ({
      ...prev,
      characters: {
        ...prev.characters,
        [characterId]: {
          ...prev.characters[characterId],
          ...updates
        }
      }
    }));
  };

  const handleSceneUpdate = (updates) => {
    setSceneData(prev => ({
      ...prev,
      scene: {
        ...prev.scene,
        ...updates
      }
    }));
  };

  const handleGenerateScene = async () => {
    try {
      setIsGenerating(true);
      
      // Get the last few lines of dialogue for context
      const recentDialogue = sceneData.scene.dialogueLines.slice(-3);
      
      // Get the previous plot point
      const previousPlotPoints = sceneData.scene.plotPoints || [];
      const previousPlotPoint = previousPlotPoints[previousPlotPoints.length - 1];
  
      const dialogue = await generateScene({
        characters: sceneData.characters,
        sceneDescription: sceneData.scene.description,
        plotPoint: sceneData.scene.plotLine,
        previousDialogue: recentDialogue,
        previousPlotPoint: previousPlotPoint
      });
  
      // Update scene with new dialogue and store the plot point
      setSceneData(prev => ({
        ...prev,
        scene: {
          ...prev.scene,
          dialogueLines: [...prev.scene.dialogueLines, ...dialogue],
          plotPoints: [...(prev.scene.plotPoints || []), prev.scene.plotLine]
        }
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // src/app/normal/page.js
return (
  <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
    <main className="container mx-auto px-8 pt-24">
      {/* Character Descriptions */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="font-['Caslon'] text-2xl text-gray-200 mb-3">Harry Potter</h2>
          <Textarea
            className="w-full p-4 rounded-lg bg-black/30 text-gray-200 resize-none border-gray-800 
            focus:border-gray-600 min-h-[120px] font-['Future'] text-lg"
            placeholder="Enter character description..."
            value={sceneData.characters.character1.description}
            onChange={(e) => handleCharacterUpdate('character1', { description: e.target.value })}
          />
        </div>

        <div>
          <h2 className="font-['Caslon'] text-2xl text-gray-200 mb-3">Severus Snape</h2>
          <Textarea
            className="w-full p-4 rounded-lg bg-black/30 text-gray-200 resize-none border-gray-800 
            focus:border-gray-600 min-h-[120px] font-['Future'] text-lg"
            placeholder="Enter character description..."
            value={sceneData.characters.character2.description}
            onChange={(e) => handleCharacterUpdate('character2', { description: e.target.value })}
          />
        </div>
      </div>

      {/* Scene Content */}
      <Card className="bg-transparent border-transparent">
        <CardHeader>
          <h2 className="font-['Caslon'] text-3xl text-center text-gray-200">Scene</h2>
        </CardHeader>
        
        <CardContent className="space-y-2">
          <div>
            <h3 className="font-['Caslon'] text-xl text-gray-200 mb-3">Scene Setting</h3>
            <Textarea
              className="w-full p-4 rounded-lg bg-black/30 text-gray-200 resize-none border-gray-800/50 
              focus:border-gray-600 font-['Future'] text-lg"
              placeholder="INT. HOGWARTS - POTIONS CLASSROOM - NIGHT"
              value={sceneData.scene.description}
              onChange={(e) => handleSceneUpdate({ description: e.target.value })}
            />
          </div>

          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="h-[400px] overflow-y-auto space-y-4 mb-6 font-['Future']">
              {sceneData.scene.dialogueLines.map((line, index) => (
                <div 
                  key={index}
                  className={`flex ${line.character === 'character1' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[80%] p-4 ${
                      line.character === 'character1' 
                        ? 'text-left' 
                        : 'text-right'
                    }`}
                  >
                    <div className="font-['Caslon'] text-gray-400 text-sm mb-1">
                      {sceneData.characters[line.character].name.toUpperCase()}
                    </div>
                    <div className="text-gray-200 text-lg leading-relaxed">
                      {line.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-['Caslon'] text-xl text-gray-200">Plot Development</h3>
              <Textarea
                className="w-full p-4 rounded-lg bg-black/30 text-gray-200 resize-none border-gray-800/50 
                focus:border-gray-600 font-['Future'] text-lg"
                placeholder="Describe the next story beat..."
                value={sceneData.scene.plotLine}
                onChange={(e) => handleSceneUpdate({ plotLine: e.target.value })}
              />
              <Button
                className="w-full h-14 bg-white/5 hover:bg-white/10 border border-gray-700 text-gray-200 
                font-['Caslon'] text-lg transition-all duration-300"
                onClick={handleGenerateScene}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Writing Scene...
                  </div>
                ) : 'Generate Scene'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
);}