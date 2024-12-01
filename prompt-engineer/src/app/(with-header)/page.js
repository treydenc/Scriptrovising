// src/app/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { motion } from "framer-motion";
import SessionForm from '@/components/SessionForm';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Check for existing session data
    const savedData = localStorage.getItem('originalSessionData');
    if (savedData) {
      setSessionData(JSON.parse(savedData));
      setShowForm(false);
    }
  }, []);

  const handleSessionComplete = (data) => {
    setSessionData(data);
    setShowForm(false);
  };

  const handleReset = () => {
    localStorage.removeItem('originalSessionData');
    setSessionData(null);
    setShowForm(true);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative">
      {/* Video Background */}
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
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center py-16">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <Image 
              src="/images/strings-logo.png" 
              alt="Strings Logo" 
              width={90} 
              height={90}
              className="object-contain mb-8 mx-auto"
            />
            <h1 className="font-['Garamond'] text-6xl md:text-7xl font-light mb-6 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              STRINGS
            </h1>
            <p className="font-['Garamond'] text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto italic leading-relaxed">
              AI System for Tailored Real-time Interactive Narrative
              <br />Generation and Scriptwriting
            </p>
          </motion.div>

          {showForm ? (
            <SessionForm onComplete={handleSessionComplete} />
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 max-w-7xl mx-auto">
              {/* Characters Column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <h2 className="font-['Garamond'] text-4xl text-gray-100 text-center mb-8">
                  Current Characters
                </h2>
                
                <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm hover:bg-black/50 transition-all duration-500">
                  <CardHeader className="p-8">
                    <CardTitle className="font-['Garamond'] text-3xl text-gray-100 mb-4">
                      {sessionData.characters.character1.name}
                    </CardTitle>
                    <CardDescription className="font-['Future'] text-lg text-gray-300 leading-relaxed">
                      {sessionData.characters.character1.description}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm hover:bg-black/50 transition-all duration-500">
                  <CardHeader className="p-8">
                    <CardTitle className="font-['Garamond'] text-3xl text-gray-100 mb-4">
                      {sessionData.characters.character2.name}
                    </CardTitle>
                    <CardDescription className="font-['Future'] text-lg text-gray-300 leading-relaxed">
                      {sessionData.characters.character2.description}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Button 
                  onClick={handleReset}
                  variant="outline" 
                  className="w-full bg-black/40 hover:bg-black/60 text-gray-100 border border-gray-500/30 font-['Garamond'] text-lg h-14 transition-all duration-300"
                >
                  Reset Characters
                </Button>
              </motion.div>

              {/* Script Modes Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-8"
              >
                <h2 className="font-['Garamond'] text-4xl text-gray-100 text-center mb-8">
                  Script Modes
                </h2>

                <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm hover:bg-black/50 transition-all duration-500">
                  <CardHeader className="p-8">
                    <CardTitle className="font-['Garamond'] text-3xl text-gray-100 mb-4">
                      Script Mode 1
                    </CardTitle>
                    <CardDescription className="font-['Future'] text-lg text-gray-300 leading-relaxed mb-8">
                      A streamlined approach to character dialogue, perfect for rapid story development.
                    </CardDescription>
                    <Link href="/normal" className="block">
                      <Button 
                        className="w-full group bg-black/40 hover:bg-black/60 text-gray-100 border border-gray-500/30 font-['Garamond'] text-lg h-14 transition-all duration-300"
                      >
                        Mode 1
                        <ArrowRight className="ml-3 opacity-70 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </CardHeader>
                </Card>

                <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm hover:bg-black/50 transition-all duration-500">
                  <CardHeader className="p-8">
                    <CardTitle className="font-['Garamond'] text-3xl text-gray-100 mb-4">
                      Script Mode 2
                    </CardTitle>
                    <CardDescription className="font-['Future'] text-lg text-gray-300 leading-relaxed mb-8">
                      An intricate approach to character development with precise control.
                    </CardDescription>
                    <Link href="/fine-grain" className="block">
                      <Button 
                        className="w-full group bg-black/40 hover:bg-black/60 text-gray-100 border border-gray-500/30 font-['Garamond'] text-lg h-14 transition-all duration-300"
                      >
                        Mode 2
                        <ArrowRight className="ml-3 opacity-70 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
