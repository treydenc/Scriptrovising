// components/CharacterPanel.js
"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CharacterPanel = ({ initialCharacter, onUpdate, onGenerate, isGenerating }) => {
  const getCharacterImage = (name) => {
    const formattedName = name.toLowerCase().split(' ')[0];
    return `/images/${formattedName}.jpg`;
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
    >
    <Card className="w-full bg-black/30 border-gray-800/50 backdrop-blur-sm shadow-2xl">
      <CardHeader>
        <motion.h2 
          className="font-['Caslon'] text-2xl text-gray-200 text-center"
          layout
        >
          {initialCharacter.name}
        </motion.h2>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Image */}
        <motion.div 
          className="relative aspect-[3/4] w-48 mx-auto rounded-lg overflow-hidden shadow-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={getCharacterImage(initialCharacter.name)}
            alt={initialCharacter.name}
            fill
            className="object-cover object-center rounded-lg"
            priority
          />
        </motion.div>
          
        <div className="space-y-2">
          <h3 className="font-['Caslon'] font-bold text-gray-200">Response Length</h3>
          <div className="flex justify-between text-sm text-gray-400 font-['Future']">
              <span>Concise</span>
              <span>Detailed</span>
            </div>
            <Slider
              min={0}
              max={100}
              defaultValue={[initialCharacter.responseLength || 50]}
              onValueChange={(value) => handleResponseLengthChange(value[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-8">
            {Object.entries(initialCharacter.attributes).map(([category, data]) => (
              <motion.div 
                key={category} 
                className="space-y-2"
                layout
              >
                <h3 className="font-['Caslon'] font-bold text-gray-200">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                
                <div className="flex justify-between gap-4">
                  <Input
                    type="text"
                    value={data.leftLabel}
                    onChange={(e) => handleLabelChange(category, 'left', e.target.value)}
                    className="flex justify-between text-sm text-gray-400 font-['Future']"
                  />
                  <Input
                    type="text"
                    value={data.rightLabel}
                    onChange={(e) => handleLabelChange(category, 'right', e.target.value)}
                    className="flex justify-between text-sm text-gray-400 font-['Future']"
                  />
                </div>
                
                <div className="relative pt-2">
                  <Slider
                    min={0}
                    max={100}
                    value={[data.value]}
                    onValueChange={(value) => handleSliderChange(category, value)}
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
        </CardContent>

        <CardFooter>
          <Button 
            className="w-full bg-white/5 hover:bg-white/10 text-gray-200 border border-gray-700 
            font-['Caslon'] text-lg h-12 transition-all duration-300"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <motion.div /* ... */ >
                Writing...
              </motion.div>
            ) : (
              'Generate Dialogue'
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CharacterPanel;