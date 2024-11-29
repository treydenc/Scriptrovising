// src/app/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Check if the component is mounted
const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
}, []);

return (
  <main className="min-h-screen relative">
    {mounted && (
      <div className="fixed inset-0 -z-10">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.2)' }}
        >
          <source src="/videos/theatre.mp4" type="video/mp4" />
        </video>
      </div>
    )}

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center"> 
        <div className="container mx-auto px-8">
          {/* Main Title */}
          <div className="text-center mb-16 space-y-6">
            <h1 className="font-['Garamond'] text-7xl font-light mb-4 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              STRINGS
            </h1>
            <p className="font-['Garamond'] text-2xl text-gray-400 max-w-2xl mx-auto italic">
            AI System for Tailored Real-time Interactive Narrative Generation and Scriptwriting
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Normal Mode */}
            <Card className="bg-black/30 border-gray-800/50 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
              <CardHeader className="space-y-4">
                <CardTitle className="font-['Caslon'] text-3xl text-gray-100">Normal Mode</CardTitle>
                <CardDescription className="font-['Garamond'] text-lg text-gray-300">
                  A streamlined approach to character dialogue, perfect for rapid story development and natural conversational flow.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <ul className="text-gray-300 space-y-4 font-['Garamond'] text-lg">
                  <li className="flex items-center space-x-3">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    <span>Scene-driven dialogue generation</span>
                  </li>
                </ul>
                <Link href="/normal" className="block">
                  <Button 
                    className="w-full group bg-white/10 hover:bg-white/20 text-gray-100 border border-gray-500/30 font-['Garamond'] text-lg h-12"
                  >
                    Normal Mode
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Fine Grain Mode */}
            <Card className="bg-black/30 border-gray-800/50 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
              <CardHeader className="space-y-4">
                <CardTitle className="font-['Caslon'] text-3xl text-gray-100">Fine Grain Mode</CardTitle>
                <CardDescription className="font-['Garamond'] text-lg text-gray-300">
                  An intricate approach to character development, offering precise control over personality and interaction.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <ul className="text-gray-300 space-y-4 font-['Garamond'] text-lg">
                  <li className="flex items-center space-x-3">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    <span>Precise character voice control</span>
                  </li>
                </ul>
                <Link href="/fine-grain" className="block">
                  <Button 
                    className="w-full group bg-white/10 hover:bg-white/20 text-gray-100 border border-gray-500/30 font-['Garamond'] text-lg h-12"
                  >
                    Fine Grain Mode
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}