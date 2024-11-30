// src/app/page.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import CharacterPanel from '@/components/characterPanel';
import { defaultSceneData } from '@/data/default';
import { generateDialogue } from '@/services/dialogueAPI';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sceneData, setSceneData] = useState(defaultSceneData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const dialogueEndRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Scroll to bottom when new dialogue is added
    dialogueEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sceneData.scene.dialogueLines]);

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

  const handleDialogueEdit = (index, newText) => {
    setSceneData(prev => ({
      ...prev,
      scene: {
        ...prev.scene,
        dialogueLines: prev.scene.dialogueLines.map((line, i) => 
          i === index ? { ...line, text: newText } : line
        )
      }
    }));
  };
  
  const handleDeleteDialogue = (index) => {
    setSceneData(prev => ({
      ...prev,
      scene: {
        ...prev.scene,
        dialogueLines: prev.scene.dialogueLines.filter((_, i) => i !== index)
      }
    }));
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
  
      setSceneData(prev => ({
        ...prev,
        scene: {
          ...prev.scene,
          dialogueLines: [...prev.scene.dialogueLines, {
            character: speakingCharacterId,
            text: dialogue,
            timestamp: new Date().toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }]
        }
      }));
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
      className="min-h-screen custom-scrollbar bg-gradient-to-b from-black to-gray-9006 pt-24"
    >
      <div className="container max-w-[1920px] mx-auto">

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

        <div className="grid grid-cols-[400px_1fr_400px] gap-8 h-[calc(100vh-120px)]">
        {/* Left Character Panel */}
            <div className="flex flex-col gap-4">
              <div className="flex-1 overflow-auto">
                <CharacterPanel 
                  initialCharacter={sceneData.characters.character1}
                  onUpdate={(updates) => handleCharacterUpdate('character1', updates)}
                  onGenerate={() => handleGenerateDialogue('character1')}
                  isGenerating={isGenerating}
                />
              </div>
          </div>
          
          <Card className="flex flex-col bg-black/30 border-gray-800/50 custom-scrollbar shadow-2xl h-[calc(100vh-120px)]"> {/* Fixed height */}
            <CardHeader className="flex-none space-y-2 pb-4">
              <h2 className="text-3xl font-bold text-gray-200 text-center font-['Caslon']">Scene Description</h2>
            </CardHeader>
            
            <CardContent className="flex flex-col gap-4 overflow-hidden h-[calc(100%-6rem)]"> {/* Fixed height calculation */}
              {/* Scene Description Input */}
              <Textarea
                className="flex-none w-full p-4 font-['Future'] rounded-lg bg-gray-800/50 text-white resize-none border-gray-700 placeholder:text-slate-500"
                placeholder="Describe the scene setting and context..."
                value={sceneData.scene.description}
                onChange={(e) => handleSceneUpdate({ description: e.target.value })}
                rows={3}
              />
              
              {/* Dialogue Area - Fixed Height */}
              <div className="flex-1 h-0">
                <div className="h-full bg-gray-800/50 rounded-lg p-8 overflow-y-auto border border-gray-700/50 font-mono">
                  <div className="space-y-6 max-w-3xl mx-auto">
                    {sceneData.scene.dialogueLines.map((line, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative group"
                      >
                        {/* Character Name */}
                        <div className="text-center mb-2 text-white/90">
                          {sceneData.characters[line.character].name.toUpperCase()}
                        </div>

                        {/* Dialogue Text - Editable */}
                        <div className="px-16"> {/* Screenplay-style indentation */}
                          <textarea
                            defaultValue={line.text}
                            onChange={(e) => handleDialogueEdit(index, e.target.value)}
                            className="w-full bg-transparent text-white/90 resize-none outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-2 py-1"
                            rows={Math.ceil(line.text.length / 50)} // Dynamically size based on content
                          />
                        </div>

                        {/* Edit/Delete Controls - Show on Hover */}
                        <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDeleteDialogue(index)}
                            className="text-red-400/50 hover:text-red-400 p-1"
                            title="Delete line"
                          >
                            ×
                          </button>
                        </div>

                        {/* Timestamp - Small and Subtle */}
                        <div className="absolute -right-16 bottom-0 text-[10px] text-white/30">
                          {line.timestamp}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={dialogueEndRef} className="h-6" />
                  </div>
                </div>
              </div>

              {/* Plot Line Input */}
              <div className="flex-none space-y-2">
                <h3 className="text-xl font-semibold text-gray-200 font-['Caslon']">Plot Development</h3>
                <Textarea 
                  className="w-full font-['Future'] p-4 rounded-lg bg-gray-800/50 text-white resize-none border-gray-700 placeholder:text-slate-500"
                  placeholder="What happens next in the scene?"
                  value={sceneData.scene.plotLine}
                  onChange={(e) => handleSceneUpdate({ plotLine: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Character Panel */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 overflow-auto">
            <CharacterPanel 
              initialCharacter={sceneData.characters.character2}
              onUpdate={(updates) => handleCharacterUpdate('character2', updates)}
              onGenerate={() => handleGenerateDialogue('character2')}  // This was likely missing
              isGenerating={isGenerating}
            />
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}