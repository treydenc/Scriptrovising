import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

const CharacterPanel = ({ initialCharacter, onUpdate, onGenerate, isGenerating }) => {
  const [isDefaultCharacter, setIsDefaultCharacter] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Preset options for each side of each attribute
  const presetOptions = {
    EmotionalState: {
      left: ["Troubled", "Anxious", "Fearful", "Insecure", "Vulnerable"],
      right: ["Confident", "Calm", "Brave", "Self-assured", "Resilient"]
    },
    DialogueStyle: {
      left: ["Hesitant", "Reserved", "Indirect", "Passive", "Timid"],
      right: ["Assertive", "Outspoken", "Direct", "Active", "Bold"]
    },
    Relationships: {
      left: ["Distant", "Guarded", "Independent", "Solitary", "Detached"],
      right: ["Connected", "Open", "Dependent", "Social", "Attached"]
    }
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
  
  const handleSliderDragStart = () => {
    setIsDragging(true);
  };
  
  const handleSliderDragEnd = () => {
    if (isDragging) {
      onUpdate({ isSliderMovement: true });
      setIsDragging(false);
    }
  };

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

  const CustomInput = ({ value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    
    return (
      <div className="relative w-full">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-xs sm:text-sm text-gray-400 font-['Future'] 
            bg-gray-900/50 border-gray-700 pr-8"
        />
        <div 
          onClick={() => setOpen(!open)} 
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5
            flex items-center justify-center hover:bg-gray-700/50 rounded-sm
            transition-colors cursor-pointer"
        >
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        <Select open={open} onOpenChange={setOpen} onValueChange={onChange}>
          <SelectTrigger className="sr-only" />
          <SelectContent className="bg-gray-900/95 border-gray-700/50 backdrop-blur-sm">
            {options.map((option) => (
              <SelectItem 
                key={option} 
                value={option}
                className="text-xs sm:text-sm text-gray-300"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="w-full bg-black/30 border-gray-800/50 shadow-2xl h-full flex flex-col">
        <CardHeader className="flex-none p-4">
          <Input
            value={initialCharacter.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="text-xl sm:text-2xl text-center font-['Caslon'] bg-transparent border-gray-800/100"
            placeholder="Character Name"
          />
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto custom-scrollbar px-4">
          <div className="space-y-6">
            <Textarea
              className="w-full p-3 sm:p-4 font-['Future'] text-sm sm:text-base rounded-lg 
                bg-black/30 resize-none text-white border-gray-800/100 placeholder:text-slate-500"
              placeholder="Describe the character's personality, background, and current state..."
              value={initialCharacter.description}
              rows={2}
              onChange={(e) => onUpdate({ description: e.target.value })}
            />
            
            <motion.div 
              className="relative aspect-[4/4] w-12 sm:w-24 mx-auto rounded-lg overflow-hidden shadow-xl"
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
                onPointerDown={handleSliderDragStart}
                onPointerUp={handleSliderDragEnd}
                className="py-2"
              />
            </div>

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
                    <CustomInput
                      value={data.leftLabel}
                      onChange={(value) => onUpdate({
                        attributes: {
                          ...initialCharacter.attributes,
                          [category]: {
                            ...data,
                            leftLabel: value
                          }
                        }
                      })}
                      options={presetOptions[category]?.left || []}
                    />
                    <CustomInput
                      value={data.rightLabel}
                      onChange={(value) => onUpdate({
                        attributes: {
                          ...initialCharacter.attributes,
                          [category]: {
                            ...data,
                            rightLabel: value
                          }
                        }
                      })}
                      options={presetOptions[category]?.right || []}
                    />
                  </div>
                  
                  <div className="relative">
                  <Slider
                    min={0}
                    max={100}
                    value={[data.value]}
                    onValueChange={(value) => handleSliderChange(category, value)}
                    onPointerDown={handleSliderDragStart}
                    onPointerUp={handleSliderDragEnd}
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