// Custom hook for presentation mode with auto-animation

import { useState, useEffect, useCallback } from 'react';
import { ANIMATION_CONFIG } from '../config';

export function usePresentationMode(sortedGens, containerRef) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-animate through generations
  useEffect(() => {
    if (!isPaused && sortedGens.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % sortedGens.length);
      }, ANIMATION_CONFIG.autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isPaused, sortedGens.length]);

  // Scroll to center the active generation
  useEffect(() => {
    const activeGenKey = sortedGens[activeIndex];
    const rowEl = document.getElementById(`gen-row-${activeGenKey}`);
    
    if (rowEl) {
      rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeIndex, sortedGens]);

  const goToPrevious = useCallback(() => {
    setIsPaused(true);
    setActiveIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setIsPaused(true);
    setActiveIndex(prev => Math.min(sortedGens.length - 1, prev + 1));
  }, [sortedGens.length]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setActiveIndex(0);
    setIsPaused(false);
  }, []);

  return {
    activeIndex,
    isPaused,
    goToPrevious,
    goToNext,
    togglePause,
    reset,
    currentGen: sortedGens[activeIndex],
  };
}
