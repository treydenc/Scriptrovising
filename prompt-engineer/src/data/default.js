// src/data/defaults.js

export const defaultSceneData = {
    characters: {
      character1: {
        name: 'Harry Potter',
        description: 'A young wizard struggling with the weight of his destiny. Currently feeling conflicted about his latest encounter with dark magic.',
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
        name: 'Severus Snape',
        description: 'A complex character hiding his true motivations. Maintaining his stern exterior while internally conflicted about his role.',
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
      description: 'In the dimly lit potions classroom after hours. Tension hangs in the air as recent events at Hogwarts have put everyone on edge.',
      plotLine: 'Harry needs to confront Snape about information regarding Voldemort, but must navigate the complex dynamics of their relationship.',
      dialogueLines: []
    }
  };

  // Simplified version for normal mode
export const basicDefaultSceneData = {
  characters: {
    character1: {
      name: 'Harry Potter',
      description: 'A young wizard struggling with the weight of his destiny. Currently feeling conflicted about his latest encounter with dark magic.',
    },
    character2: {
      name: 'Severus Snape',
      description: 'A complex character hiding his true motivations. Maintaining his stern exterior while internally conflicted about his role.',
    }
  },
  scene: {
    description: 'In the dimly lit potions classroom after hours. Tension hangs in the air as recent events at Hogwarts have put everyone on edge.',
    plotLine: 'Harry needs to confront Snape about information regarding Voldemort, but must navigate the complex dynamics of their relationship.',
    dialogueLines: []
  }
}