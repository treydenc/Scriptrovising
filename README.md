# Strings

AI System for Tailored Real-time Interactive Narrative Generation and Scriptwriting

## Overview

Strings is a web application that helps writers generate dynamic character dialogue through two distinct modes:

### Normal Mode
- Quick scene setup
- Basic character descriptions
- Straightforward dialogue generation 
- Perfect for rapid story development

### Fine-Grain Mode
- Detailed character control
- Emotional state management
- Relationship dynamics 
- Response length control
- Advanced dialogue customization

## Technology Stack
- Next.js 14
- Tailwind CSS
- Framer Motion
- shadcn/ui 
- OpenAI API

## Features
- Real-time dialogue generation
- Character state management
- Scene context preservation
- Plot development tracking
- Responsive design
- Elegant animations
- Custom fonts and styling

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/treydenc/scriptrovising.git

Install dependencies:
bashCopycd scriptrovising
npm install

Set up environment variables:
Create a .env.local file with the following content:
CopyOPENAI_API_KEY=your_api_key_here

Run the development server:
bashCopynpm run dev


Project Structure
Copysrc/
├── app/
│   ├── page.js          # Landing page
│   ├── normal/          # Normal mode
│   └── fine-grain/      # Fine-grain mode
├── components/
│   ├── Header.js
│   └── CharacterPanel.js
├── services/
│   └── dialogueApi.js
└── lib/
    └── utils.js
Usage

Choose between Normal and Fine-Grain mode
Enter character descriptions
Set the scene context
Define plot development
Generate dialogue
Iterate and refine as needed