// src/hooks/useSessionData.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useSessionData = (mode) => {
  const router = useRouter();
  const [sceneData, setSceneData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for session data when component mounts
    const savedData = localStorage.getItem('originalSessionData');
    
    if (!savedData) {
      // If no session data exists, redirect to home
      router.push('/');
      return;
    }

    // Get the original session data
    const originalData = JSON.parse(savedData);

    // Get any mode-specific modifications if they exist
    const modeSpecificData = localStorage.getItem(`${mode}SessionData`);

    if (modeSpecificData) {
      // If we have mode-specific data, use that
      setSceneData(JSON.parse(modeSpecificData));
    } else {
      // Otherwise use the original data
      setSceneData(originalData);
    }

    setIsLoading(false);
  }, [router, mode]);

  // Save any modifications made in the current mode
  const updateSceneData = (newData) => {
    setSceneData(newData);
    // Save mode-specific modifications
    localStorage.setItem(`${mode}SessionData`, JSON.stringify(newData));
  };

  // Reset to original data
  const resetToOriginal = () => {
    const originalData = JSON.parse(localStorage.getItem('originalSessionData'));
    setSceneData(originalData);
    // Clear mode-specific data
    localStorage.removeItem(`${mode}SessionData`);
  };

  // Clear all session data
  const clearAllData = () => {
    localStorage.removeItem('originalSessionData');
    localStorage.removeItem('normalSessionData');
    localStorage.removeItem('fineGrainSessionData');
    router.push('/');
  };

  const clearModeAndReturn = () => {
    // Clear only the current mode's data
    localStorage.removeItem(`${mode}SessionData`);
    // Preserve original session data for other modes
    router.push('/');
  };

  return {
    sceneData,
    isLoading,
    updateSceneData,
    resetToOriginal,
    clearAllData,
    clearModeAndReturn
  };
};