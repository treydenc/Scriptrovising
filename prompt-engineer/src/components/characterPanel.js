"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const CharacterPanel = ({ initialCharacter, onUpdate, onGenerate, isGenerating }) => {
  const [isDefaultCharacter, setIsDefaultCharacter] = useState(true);

  const getCharacterImage = (name) => {
    if (!isDefaultCharacter) {
      return '/images/person.png';
    }
    const formattedName = name.toLowerCase().split(' ')[0];
    return `/images/${formattedName}.jpg`;
  };

  useEffect(() => {
    setIsDefaultCharacter(
      initialCharacter.name === "Harry Potter" || 
      initialCharacter.name === "Severus Snape"
    );
  }, [initialCharacter.name]);

  const handleNameChange = (value) => {
    onUpdate({ name: value });
  };

  const handleDescriptionChange = (value) => {
    onUpdate({ description: value });
  };

  const handleSliderChange = (category, value) => {
    onUpdate({
      attributes: {
        ...initialCharacter.attributes,
        [category]: {
          ...initialCharacter.attributes[category],
          value: value[0]
        }
      }
    });
  };

  const handleLabelChange = (category, end, value) => {
    onUpdate({
      attributes: {
        ...initialCharacter.attributes,
        [category]: {
          ...initialCharacter.attributes[category],
          [end + 'Label']: value
        }
      }
    });
  };

  const handleResponseLengthChange = (value) => {
    onUpdate({ responseLength: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="w-full bg-black/30 border-gray-800/50 shadow-2xl h-full flex flex-col">
        {/* Header with Character Name */}
        <CardHeader className="flex-none p-4">
          <Input
            value={initialCharacter.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="text-xl sm:text-2xl text-center font-['Caslon'] bg-transparent border-gray-800/100"
            placeholder="Character Name"
          />
        </CardHeader>
        
        {/* Scrollable Content Area */}
        <CardContent className="flex-1 overflow-y-auto custom-scrollbar px-4">
          <div className="space-y-6">
            {/* Character Description */}
            <Textarea
              className="w-full p-3 sm:p-4 font-['Future'] text-sm sm:text-base rounded-lg 
                bg-black/30 resize-none text-white border-gray-800/100 placeholder:text-slate-500"
              placeholder="Describe the character's personality, background, and current state..."
              value={initialCharacter.description}
              rows={2}
              onChange={(e) => onUpdate({ description: e.target.value })}
            />
            
            {/* Character Image */}
            <motion.div 
              className="relative aspect-[3/4] w-28 sm:w-40 mx-auto rounded-lg overflow-hidden shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={getCharacterImage(initialCharacter.name)}
                alt={initialCharacter.name}
                fill
                className="object-cover object-center rounded-lg"
                priority
              />
            </motion.div>
          
            {/* Response Length Slider */}
            <div className="space-y-2">
              <h3 className="font-['Caslon'] text-sm sm:text-base font-bold text-gray-200">
                Response Length
              </h3>
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 font-['Future']">
                <span>Concise</span>
                <span>Verbose</span>
              </div>
              <Slider
                min={0}
                max={100}
                defaultValue={[initialCharacter.responseLength || 50]}
                onValueChange={(value) => onUpdate({ responseLength: value[0] })}
                className="py-2"
              />
            </div>

            {/* Character Attributes */}
            <div className="space-y-4">
              {Object.entries(initialCharacter.attributes).map(([category, data]) => (
                <motion.div 
                  key={category} 
                  className="space-y-2"
                  layout
                >
                  <h3 className="font-['Caslon'] text-sm sm:text-base font-bold text-gray-200">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  
                  <div className="flex justify-between gap-2">
                    <Input
                      type="text"
                      value={data.leftLabel}
                      onChange={(e) => onUpdate({
                        attributes: {
                          ...initialCharacter.attributes,
                          [category]: {
                            ...data,
                            leftLabel: e.target.value
                          }
                        }
                      })}
                      className="flex-1 text-xs sm:text-sm text-gray-400 font-['Future'] 
                        bg-gray-900/50 border-gray-700 placeholder:text-gray-600"
                    />
                    <Input
                      type="text"
                      value={data.rightLabel}
                      onChange={(e) => onUpdate({
                        attributes: {
                          ...initialCharacter.attributes,
                          [category]: {
                            ...data,
                            rightLabel: e.target.value
                          }
                        }
                      })}
                      className="flex-1 text-xs sm:text-sm text-gray-400 font-['Future'] 
                        bg-gray-900/50 border-gray-700 placeholder:text-gray-600"
                    />
                  </div>
                  
                  <div className="relative">
                    <Slider
                      min={0}
                      max={100}
                      value={[data.value]}
                      onValueChange={(value) => onUpdate({
                        attributes: {
                          ...initialCharacter.attributes,
                          [category]: {
                            ...data,
                            value: value[0]
                          }
                        }
                      })}
                      className="my-4"
                    />
                    <motion.div 
                      className="text-xs text-slate-400 mt-1 text-center"
                      layout
                    >
                      {data.value}%
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Footer with Generate Button */}
        <CardFooter className="flex-none border-t border-gray-800/50 p-4">
          <Button 
            className="w-full bg-white/5 hover:bg-white/10 text-gray-200 border border-gray-700
              text-sm sm:text-base py-2 sm:py-3"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Writing..." : "Generate Dialogue"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CharacterPanel;