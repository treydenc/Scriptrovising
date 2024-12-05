// src/app/basic/page.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSessionData } from '@/hooks/useSessionData';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { generateScene } from '@/services/sceneAPI';
import { basicDefaultSceneData } from '@/data/default';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DownloadButton from '@/components/DownloadButton';

export default function BasicMode() {
  const {
    sceneData,
    isLoading,
    updateSceneData,
    resetToOriginal,
    clearAllData,
    clearModeAndReturn
  } = useSessionData('normal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingInitialText, setEditingInitialText] = useState(null);
  const router = useRouter();
  const downloadButtonRef = useRef();

  useEffect(() => {
    if (sceneData && sceneData.scene && 
      (!sceneData.scene.hasOwnProperty('editCount') || 
       !sceneData.scene.hasOwnProperty('generateCount'))
    ) {
      updateSceneData({
        ...sceneData,
        scene: {
          ...sceneData.scene,
          editCount: 0,
          generateCount: 0
        }
      });
    }
  }, [sceneData, updateSceneData]);

  if (isLoading || !sceneData || !sceneData.characters) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="text-gray-400">Loading session data...</span>
        </div>
      </div>
    );
  }

  const handleBackAndClear = () => {
    // Trigger download first if there's content
    if (sceneData.scene.dialogueLines.length > 0) {
      downloadButtonRef.current?.click();
    }
    setTimeout(() => {
      clearModeAndReturn();
    }, 100);
  };


  const handleCharacterUpdate = (characterId, updates) => {
    updateSceneData({
      ...sceneData,
      characters: {
        ...sceneData.characters,
        [characterId]: {
          ...sceneData.characters[characterId],
          ...updates
        }
      }
    });
  };

  const handleSceneUpdate = (updates) => {
    updateSceneData({
      ...sceneData,
      scene: {
        ...sceneData.scene,
        ...updates
      }
    });
  };
  
  const handleDeleteDialogue = (index) => {
    updateSceneData({
      ...sceneData,
      scene: {
        ...sceneData.scene,
        dialogueLines: sceneData.scene.dialogueLines.filter((_, i) => i !== index),
        editCount: (sceneData.scene.editCount || 0) + 1
      }
    });
  };
  
  const handleDialogueEdit = (index, newText) => {
    updateSceneData({
      ...sceneData,
      scene: {
        ...sceneData.scene,
        dialogueLines: sceneData.scene.dialogueLines.map((line, i) => 
          i === index ? { ...line, text: newText } : line
        )
      }
    });
  };

  const handleDialogueEditStart = (index) => {
    setEditingInitialText(sceneData.scene.dialogueLines[index].text);
  };

  const handleDialogueEditEnd = (index) => {
    const currentText = sceneData.scene.dialogueLines[index].text;
    if (editingInitialText !== null && editingInitialText !== currentText) {
      updateSceneData({
        ...sceneData,
        scene: {
          ...sceneData.scene,
          editCount: (sceneData.scene.editCount || 0) + 1
        }
      });
    }
    setEditingInitialText(null);
  };
  
  const handleGenerateScene = async () => {
    try {
      setIsGenerating(true);
      
      const recentDialogue = sceneData.scene.dialogueLines.slice(-3);
      const previousPlotPoints = sceneData.scene.plotPoints || [];
      const previousPlotPoint = previousPlotPoints[previousPlotPoints.length - 1];
  
      const dialogue = await generateScene({
        characters: sceneData.characters,
        sceneDescription: sceneData.scene.description,
        plotPoint: sceneData.scene.plotLine,
        previousDialogue: recentDialogue,
        previousPlotPoint: previousPlotPoint
      });
  
      // Update scene with new dialogue using updateSceneData
      updateSceneData({
        ...sceneData,
        scene: {
          ...sceneData.scene,
          dialogueLines: [...sceneData.scene.dialogueLines, ...dialogue],
          plotPoints: [...(sceneData.scene.plotPoints || []), sceneData.scene.plotLine],
          generateCount: (sceneData.scene.generateCount || 0) + 1
        }
      });
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <main className="container mx-auto px-4 py-4 min-h-screen flex flex-col">
        {/* Navigation and Controls - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <Button
          onClick={handleBackAndClear}
          variant="ghost"
          className="text-gray-400 hover:text-gray-200"
        >
          ← Back & Clear
        </Button>
          
          <div className="flex justify-end">
          <DownloadButton 
            ref={downloadButtonRef}
            dialogueContent={sceneData.scene.dialogueLines.map(line => ({
              character: sceneData.characters[line.character].name,
              dialogue: line.text
            }))}
            sceneDescription={sceneData.scene.description}
            editCount={sceneData.scene.editCount || 0}
            sliderCount={sceneData.scene.sliderCount || 0}
            generateCount={sceneData.scene.generateCount || 0}
          />
          </div>
        </div>

        {/* Character Inputs - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Character 1 */}
          <div className="space-y-2">
            <input
              type="text"
              className="font-['Caslon'] text-lg text-gray-200 bg-transparent border-b border-transparent 
                hover:border-gray-700 focus:border-gray-500 focus:outline-none w-full"
              value={sceneData.characters.character1.name}
              onChange={(e) => handleCharacterUpdate('character1', { name: e.target.value })}
              placeholder="Character 1 Name"
            />
            <Textarea
              className="w-full p-2 rounded-lg bg-black/30 text-gray-200 resize-none border-gray-800 
                focus:border-gray-600 h-16 font-['Future'] text-sm"
              placeholder="Enter character description..."
              value={sceneData.characters.character1.description}
              onChange={(e) => handleCharacterUpdate('character1', { description: e.target.value })}
            />
          </div>

          {/* Character 2 */}
          <div className="space-y-2">
            <input
              type="text"
              className="font-['Caslon'] text-lg text-gray-200 bg-transparent border-b border-transparent 
                hover:border-gray-700 focus:border-gray-500 focus:outline-none w-full"
              value={sceneData.characters.character2.name}
              onChange={(e) => handleCharacterUpdate('character2', { name: e.target.value })}
              placeholder="Character 2 Name"
            />
            <Textarea
              className="w-full p-2 rounded-lg bg-black/30 text-gray-200 resize-none border-gray-800 
                focus:border-gray-600 h-16 font-['Future'] text-sm"
              placeholder="Enter character description..."
              value={sceneData.characters.character2.description}
              onChange={(e) => handleCharacterUpdate('character2', { description: e.target.value })}
            />
          </div>
        </div>

        {/* Main Script Card - Flexible Height */}
        <Card className="bg-transparent border-transparent flex-1 flex flex-col">
        <CardHeader className="py-2 flex flex-col items-center gap-2">
          <h2 className="font-['Caslon'] text-3xl font-bold text-gray-200">SCRIPT</h2>
          <div className="bg-black/30 px-3 py-1 rounded-lg">
            <span className="text-gray-200 font-['Future'] text-sm">
              Edits: <span className="font-bold">{sceneData.scene.editCount || 0}</span>
            </span>
          </div>
        </CardHeader>
          
          <CardContent className="space-y-4 flex-1 flex flex-col">
            {/* Scene Setting */}
            <div>
              <h3 className="font-['Caslon'] text-lg font-bold text-gray-200 mb-1">Scene Setting</h3>
              <Textarea
                className="w-full p-2 rounded-lg bg-black/30 text-gray-200 resize-none border-gray-800/50 
                  focus:border-gray-600 font-['Future'] text-base h-12"
                placeholder="INT. HOGWARTS - POTIONS CLASSROOM - NIGHT"
                value={sceneData.scene.description}
                onChange={(e) => handleSceneUpdate({ description: e.target.value })}
              />
            </div>

            {/* Dialogue Area - Dynamic Height */}
            <div className="bg-black/30 rounded-xl p-4 sm:p-8 backdrop-blur-sm flex-1">
        <div className="h-[40vh] sm:h-[50vh] overflow-y-auto custom-scrollbar space-y-4 font-['Courier'] max-w-4xl mx-auto">
          {sceneData.scene.dialogueLines.map((line, index) => (
            <div key={index} className="relative group">
              <div className="text-center text-gray-300 mb-2 uppercase flex items-center justify-between">
                <div className="flex-1">{sceneData.characters[line.character].name}</div>
                <button
                  onClick={() => handleDeleteDialogue(index)}
                  className="text-red-400/50 hover:text-red-400 p-1 rounded transition-colors duration-200 
                    opacity-0 group-hover:opacity-100 absolute right-0 top-0"
                  aria-label="Delete line"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-4 sm:px-16">
                <textarea
                  value={line.text}
                  onFocus={() => handleDialogueEditStart(index)}
                  onChange={(e) => handleDialogueEdit(index, e.target.value)}
                  onBlur={() => handleDialogueEditEnd(index)}
                  className="w-full text-md bg-transparent text-gray-200 leading-relaxed focus:outline-none 
                    focus:bg-black/20 p-2 rounded resize-none font-['Courier']"
                  rows={Math.max(1, Math.ceil(line.text.length / 60))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

            {/* Plot Development - Fixed Height */}
            <div className="space-y-2">
              <h3 className="font-['Caslon'] text-lg font-bold text-gray-200">Plot Development</h3>
              <Textarea
                className="w-full p-2 rounded-lg bg-black/30 text-gray-200 resize-none border-gray-800/100 
                  focus:border-gray-600 font-['Future'] text-sm h-16"
                placeholder="Describe the next story beat..."
                value={sceneData.scene.plotLine}
                onChange={(e) => handleSceneUpdate({ plotLine: e.target.value })}
              />
              <Button
                className="w-full h-10 bg-white/5 hover:bg-white/10 border border-gray-700 text-gray-200 
                  font-['Caslon'] text-base transition-all duration-300"
                onClick={handleGenerateScene}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Writing Scene...
                  </div>
                ) : 'Generate Scene'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};