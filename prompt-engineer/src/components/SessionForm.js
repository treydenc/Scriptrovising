import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SessionForm = ({ onComplete }) => {
    const [formData, setFormData] = useState({
      characters: {
        character1: {
          name: '',
          description: '',
          attributes: {
            EmotionalState: {
              value: 50,
              leftLabel: 'Troubled',
              rightLabel: 'Confident'
            },
            DialogueStyle: {
              value: 50,
              leftLabel: 'Hesitant',
              rightLabel: 'Assertive'
            },
            Relationships: {
              value: 50,
              leftLabel: 'Distant',
              rightLabel: 'Connected'
            }
          }
        },
        character2: {
          name: '',
          description: '',
          attributes: {
            EmotionalState: {
              value: 50,
              leftLabel: 'Guarded',
              rightLabel: 'Expressive'
            },
            DialogueStyle: {
              value: 50,
              leftLabel: 'Cryptic',
              rightLabel: 'Direct'
            },
            Relationships: {
              value: 50,
              leftLabel: 'Antagonistic',
              rightLabel: 'Protective'
            }
          }
        }
      },
      scene: {
        description: '',
        plotLine: '',
        dialogueLines: []
      }
    });
  
    const [errors, setErrors] = useState({});
  
    const validateForm = () => {
      const newErrors = {};
      if (!formData.characters.character1.name) newErrors.character1Name = 'Required';
      if (!formData.characters.character1.description) newErrors.character1Desc = 'Required';
      if (!formData.characters.character2.name) newErrors.character2Name = 'Required';
      if (!formData.characters.character2.description) newErrors.character2Desc = 'Required';
      if (!formData.scene.description) newErrors.sceneDesc = 'Required';
      if (!formData.scene.plotLine) newErrors.plotLine = 'Required';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = () => {
      if (validateForm()) {
        localStorage.setItem('originalSessionData', JSON.stringify(formData));
        onComplete(formData);
      }
    };
  
    const handleChange = (field, value, characterNum) => {
      setFormData(prev => {
        if (characterNum) {
          return {
            ...prev,
            characters: {
              ...prev.characters,
              [characterNum]: {
                ...prev.characters[characterNum],
                [field]: value
              }
            }
          };
        }
        return {
          ...prev,
          scene: {
            ...prev.scene,
            [field]: value
          }
        };
      });
    };
  
    return (
      <Card className="w-full max-w-4xl mx-auto bg-black/30 border-gray-800/50">

        <CardHeader>
          <CardTitle className="text-center text-4xl text-gray-100" style={{ fontFamily: 'Garamond' }}>
            Set Up Your Characters
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Character 1 */}
            <div className="space-y-4">
              <h3 className="text-2xl text-gray-200" style={{ fontFamily: 'Garamond' }}>
                Character 1
              </h3>

              <div>
                <Input
                  placeholder="Character Name"
                  value={formData.characters.character1.name}
                  onChange={(e) => handleChange('name', e.target.value, 'character1')}
                  className="bg-black/20 border-gray-700 font-caslon text-lg"
                  style={{ fontFamily: 'future' }}
                />
                {errors.character1Name && (
                  <span className="text-sm text-red-400 font-['Future']">
                    {errors.character1Name}
                  </span>
                )}
              </div>
              <div>
                <Textarea
                  placeholder="Character Description"
                  value={formData.characters.character1.description}
                  onChange={(e) => handleChange('description', e.target.value, 'character1')}
                  className="bg-black/20 border-gray-700 text-lg"
                  style={{ fontFamily: 'Future' }}
                />
                {errors.character1Desc && (
                  <span className="text-sm text-red-400" style={{ fontFamily: 'Future' }}>
                    {errors.character1Desc}
                  </span>
                )}
              </div>
            </div>
  
            {/* Character 2 */}
            <div className="space-y-4">
              <h3 className="text-2xl text-gray-200" style={{ fontFamily: 'Garamond' }}>
                Character 2
              </h3>
              <div>
                <Input
                  placeholder="Character Name"
                  value={formData.characters.character2.name}
                  onChange={(e) => handleChange('name', e.target.value, 'character2')}
                  className="bg-black/20 border-gray-700 text-lg"
                  style={{ fontFamily: 'Future' }}
                />
                {errors.character2Name && (
                  <span className="text-sm text-red-400" style={{ fontFamily: 'Future' }}>
                    {errors.character2Name}
                  </span>
                )}
              </div>
              <div>
                <Textarea
                  placeholder="Character Description"
                  value={formData.characters.character2.description}
                  onChange={(e) => handleChange('description', e.target.value, 'character2')}
                  className="bg-black/20 border-gray-700 text-lg"
                  style={{ fontFamily: 'Future' }}
                />
                {errors.character2Desc && (
                  <span className="text-sm text-red-400" style={{ fontFamily: 'Future' }}>
                    {errors.character2Desc}
                  </span>
                )}
              </div>
            </div>
          </div>
  
          {/* Scene Information */}
          <div className="space-y-4">
            <h3 className="text-2xl text-gray-200" style={{ fontFamily: 'Garamond' }}>
              Scene Details
            </h3>
            <div>
              <Textarea
                placeholder="Scene Description"
                value={formData.scene.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="bg-black/20 border-gray-700 text-lg"
                style={{ fontFamily: 'Future' }}
              />
              {errors.sceneDesc && (
                <span className="text-sm text-red-400" style={{ fontFamily: 'Future' }}>
                  {errors.sceneDesc}
                </span>
              )}
            </div>
            <div>
              <Textarea
                placeholder="Initial Plot Development"
                value={formData.scene.plotLine}
                onChange={(e) => handleChange('plotLine', e.target.value)}
                className="bg-black/20 border-gray-700 text-lg"
                style={{ fontFamily: 'Future' }}
              />
              {errors.plotLine && (
                <span className="text-sm text-red-400" style={{ fontFamily: 'Future' }}>
                  {errors.plotLine}
                </span>
              )}
            </div>
          </div>
  
          <Button 
            onClick={handleSubmit}
            className="w-full bg-white/10 hover:bg-white/20 text-gray-100 border border-gray-500/30 text-xl"
            style={{ fontFamily: 'Garamond' }}
          >
            Save Character Data
          </Button>
        </CardContent>
      </Card>
    );
};
  
export default SessionForm;