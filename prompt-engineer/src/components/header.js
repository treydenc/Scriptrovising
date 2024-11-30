// src/components/Header.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HomeIcon } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Show header when scrolling up or at top
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setMounted(true);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!mounted) {
    return (
      <header className="bg-transparent h-16">
        <div className="container mx-auto px-4 py-2" />
      </header>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-sm"
        >
          <div className="container mx-auto px-8 py-4 flex items-center justify-between">
            <Link href="/">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Image 
                  src="/images/strings-logo.png" 
                  alt="Strings Logo" 
                  width={30} 
                  height={30}
                  className="object-contain"
                />
                <motion.h1 
                  className="font-['Garamond'] text-xl tracking-wider text-gray-200"
                  animate={{ opacity: isHovered ? 1 : 0.8 }}
                >
                  STRINGS
                </motion.h1>
              </motion.div>
            </Link>

            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-transparent transition-colors"
              >
                <HomeIcon className="w-5 h-5 text-gray-200 opacity-80" />
              </motion.div>
            </Link>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}