// src/app/page.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import CharacterPanel from '@/components/characterPanel';
import { useSessionData } from '@/hooks/useSessionData';
import { defaultSceneData } from '@/data/default';
import { generateDialogue } from '@/services/dialogueAPI';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import DownloadButton from '@/components/DownloadButton';
import AutoResizeTextArea from '@/components/AutoResizeTextArea';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(null);
  const dialogueEndRef = useRef(null);
  const {
    sceneData,
    isLoading,
    updateSceneData,
    resetToOriginal,
    clearAllData,
    clearModeAndReturn
  } = useSessionData('finegrain');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (dialogueEndRef.current && sceneData?.scene?.dialogueLines) {
      dialogueEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sceneData?.scene?.dialogueLines]);

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

    // Add this check at the top level
    if (!mounted || isLoading || !sceneData || !sceneData.characters) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="text-gray-400">Loading session data...</span>
          </div>
        </div>
      );
    }

  const handleSceneUpdate = (updates) => {
    updateSceneData({
      ...sceneData,
      scene: {
        ...sceneData.scene,
        ...updates
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
  
  const handleDeleteDialogue = (index) => {
    updateSceneData({
      ...sceneData,
      scene: {
        ...sceneData.scene,
        dialogueLines: sceneData.scene.dialogueLines.filter((_, i) => i !== index)
      }
    });
  };

  const handleGenerateDialogue = async (speakingCharacterId) => {
    try {
      setError(null);
      setIsGenerating(true);
      
      const speakingCharacter = sceneData.characters[speakingCharacterId];
      const otherCharacterId = speakingCharacterId === 'character1' ? 'character2' : 'character1';
      const otherCharacter = sceneData.characters[otherCharacterId];
  
      // Get the last few lines of dialogue for context
      const recentDialogue = sceneData.scene.dialogueLines.slice(-3); // Last 3 lines
  
      const dialogue = await generateDialogue({
        speakingCharacter: {
          name: speakingCharacter.name,
          description: speakingCharacter.description,
          attributes: speakingCharacter.attributes
        },
        otherCharacter: {
          name: otherCharacter.name,
          description: otherCharacter.description
        },
        sceneDescription: sceneData.scene.description,
        plotLine: sceneData.scene.plotLine,
        responseLength: speakingCharacter.responseLength || 50,
        dialogueHistory: recentDialogue // Add dialogue history
      });
  
      updateSceneData({
        ...sceneData,
        scene: {
          ...sceneData.scene,
          dialogueLines: [...sceneData.scene.dialogueLines, {
            character: speakingCharacterId,
            text: dialogue,
            timestamp: new Date().toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }]
        }
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mounted) return null;

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen custom-scrollbar bg-gradient-to-b from-black to-gray-900"
    >
      {/* Navigation Bar - Responsive */}
      <div className="sticky top-0 z-50 bg-transparent backdrop-blur-sm p-4">
        <div className="container max-w-[1920px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            onClick={clearModeAndReturn}
            variant="ghost"
            className="text-gray-400 hover:text-gray-200"
          >
            ← Back & Clear
          </Button>
          
          <CardHeader className="flex-none space-y-2 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
            <h2 className="text-4xl sm:text-3xl font-bold text-gray-200 text-center font-['Caslon'] pt-2">
              SCRIPT
            </h2>
          </CardHeader>

          <DownloadButton 
            dialogueContent={sceneData.scene.dialogueLines.map(line => ({
              character: sceneData.characters[line.character].name,
              dialogue: line.text
            }))}
            sceneDescription={sceneData.scene.description}
          />
        </div>
      </div>

      <div className="container max-w-[1920px] mx-auto p-4">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Layout - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4 lg:gap-8">
          {/* Left Character Panel */}
          <div className="lg:h-[calc(100vh-120px)]">
            <CharacterPanel 
              initialCharacter={sceneData.characters.character1}
              onUpdate={(updates) => handleCharacterUpdate('character1', updates)}
              onGenerate={() => handleGenerateDialogue('character1')}
              isGenerating={isGenerating}
            />
          </div>

          {/* Central Script Area */}
            <Card className="flex flex-col bg-black/35 border-transparent shadow-2xl h-[calc(100vh-8rem)]">
              <CardContent className="flex flex-col gap-4 h-full p-4 sm:p-6">
                {/* Scene Description */}
                <div className="flex-none">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-200 font-['Caslon'] mb-2">
                    Scene Description
                  </h3>
                  <Textarea
                    className="w-full p-2 font-['Future'] rounded-lg bg-black/30 resize-none 
                      text-white border-gray-800/50 placeholder:text-slate-500"
                    placeholder="Describe the scene setting and context..."
                    value={sceneData.scene.description}
                    onChange={(e) => handleSceneUpdate({ description: e.target.value })}
                    rows={1}
                  />
                </div>

                {/* Dialogue Area */}
                <div className="flex-1 min-h-0 relative">
                  <div className="absolute inset-0 bg-black/30 rounded-xl flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                      <div className="space-y-6 max-w-4xl mx-auto">
                        {sceneData.scene.dialogueLines.map((line, index) => (
                          <div key={index} className="relative group">
                            <div className="text-center text-gray-300 mb-2 uppercase font-['Courier']">
                              {sceneData.characters[line.character].name}
                            </div>
                            <div className="relative">
                              <div className="px-4 sm:px-16">
                                <AutoResizeTextArea
                                  value={line.text}
                                  onChange={handleDialogueEdit}
                                  index={index}
                                />
                              </div>
                              <button
                                onClick={() => handleDeleteDialogue(index)}
                                className="absolute top-1/2 -translate-y-1/2 -right-2 sm:right-2
                                  opacity-0 group-hover:opacity-100 transition-opacity
                                  text-red-400/50 hover:text-red-400 p-1 bg-black/20 rounded"
                                title="Delete line"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                        <div ref={dialogueEndRef} className="h-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plot Development */}
                <div className="flex-none">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-200 font-['Caslon'] mb-2">
                    Plot Development
                  </h3>
                  <Textarea 
                    className="w-full font-['Future'] p-2 rounded-lg bg-black/30 resize-none 
                      text-white border-gray-800/50 placeholder:text-slate-500"
                    placeholder="What happens next in the scene?"
                    value={sceneData.scene.plotLine}
                    onChange={(e) => handleSceneUpdate({ plotLine: e.target.value })}
                    rows={1}
                  />
                </div>
              </CardContent>
            </Card>

          {/* Right Character Panel */}
          <div className="lg:h-[calc(100vh-120px)]">
            <CharacterPanel 
              initialCharacter={sceneData.characters.character2}
              onUpdate={(updates) => handleCharacterUpdate('character2', updates)}
              onGenerate={() => handleGenerateDialogue('character2')}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    </motion.main>
  );
};