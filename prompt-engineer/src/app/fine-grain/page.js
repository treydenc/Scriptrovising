// src/app/page.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import CharacterPanel from '@/components/CharacterPanel';
import { defaultSceneData } from '@/data/default';
import { generateDialogue } from '@/services/dialogueApi';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
        responseLength: speakingCharacter.responseLength || 50
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
      className="min-h-screen bg-gradient-to-b from-black to-gray-9006 pt-24"
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
            <CardHeader>
              <h4 className="text-3xl font-bold text-white text-center">Character 1</h4>
            </CardHeader>
              <Textarea
                className="w-full p-4 rounded-lg bg-gray-800 text-white resize-none border-gray-700 placeholder:text-slate-500"
                placeholder="Describe Harry Potter's current state..."
                value={sceneData.characters.character1.description}
                onChange={(e) => handleCharacterUpdate('character1', { description: e.target.value })}
              />
              <div className="flex-1 overflow-auto">
                <CharacterPanel 
                  initialCharacter={sceneData.characters.character1}
                  onUpdate={(updates) => handleCharacterUpdate('character1', updates)}
                  onGenerate={() => handleGenerateDialogue('character1')}
                  isGenerating={isGenerating}
                />
              </div>
          </div>
          
          <Card className="flex flex-col bg-gray-900 border-transparent p-6 shadow-xl h-full">
            <CardHeader>
              <h2 className="text-3xl font-bold text-white text-center">Scene Description</h2>
            </CardHeader>
            
            <CardContent className="space-y-6 flex-1 flex flex-col">
              {/* Scene Description Input */}
              <Textarea
                className="w-full p-4 rounded-lg bg-gray-800 text-white resize-none border-gray-700"
                placeholder="Describe the scene setting and context..."
                value={sceneData.scene.description}
                onChange={(e) => handleSceneUpdate({ description: e.target.value })}
              />
              
              {/* Dialogue Area - Scrollable */}
              <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto border border-gray-700">
                <div className="space-y-4">
                  {sceneData.scene.dialogueLines.map((line, index) => (
                    <div 
                      key={index}
                      className={`flex ${
                        line.character === 'character1' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div 
                        className={`p-4 rounded-2xl ${
                          line.character === 'character1'
                            ? 'bg-blue-600 mr-auto max-w-[80%]' 
                            : 'bg-purple-600 ml-auto max-w-[80%]'
                        } shadow-lg relative`}
                      >
                        <div className="font-semibold text-white/75 text-sm mb-1">
                          {sceneData.characters[line.character].name}
                        </div>
                        <div className="text-white leading-relaxed">
                          {line.text}
                        </div>
                        <div className="absolute -bottom-5 right-2 text-xs text-white/50">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plot Line Input */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-2">Plot Development</h3>
                <Textarea 
                  className="w-full p-4 rounded-lg bg-gray-800 text-white resize-none border-gray-700"
                  placeholder="What happens next in the scene?"
                  value={sceneData.scene.plotLine}
                  onChange={(e) => handleSceneUpdate({ plotLine: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Character Panel */}
          <div className="flex flex-col gap-4">
          <CardHeader>
              <h4 className="text-3xl font-bold text-white text-center">Character 2</h4>
            </CardHeader>
            <textarea
              className="w-full p-4 rounded-lg bg-gray-800 text-white resize-none border-gray-700 placeholder:text-slate-500"
              placeholder="Describe Severus Snape's current state..."
              value={sceneData.characters.character2.description}
              onChange={(e) => handleCharacterUpdate('character2', { description: e.target.value })}
            />
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