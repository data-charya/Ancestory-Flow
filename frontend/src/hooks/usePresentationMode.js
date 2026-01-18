// Custom hook for presentation mode with auto-animation

import { useState, useEffect, useCallback } from 'react';
import { ANIMATION_CONFIG } from '../config';

export function usePresentationMode(sortedGens, containerRef) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [scale, setScale] = useState(1);
  const [translateY, setTranslateY] = useState(0);

  // Auto-animate through generations
  useEffect(() => {
    if (!isPaused && sortedGens.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % sortedGens.length);
      }, ANIMATION_CONFIG.autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isPaused, sortedGens.length]);

  // Calculate transform for current generation
  useEffect(() => {
    const activeGenKey = sortedGens[activeIndex];
    const rowEl = document.getElementById(`gen-row-${activeGenKey}`);
    
    if (rowEl && containerRef.current) {
      const targetScale = ANIMATION_CONFIG.presentationScale;
      const centerOffset = (containerRef.current.clientHeight / 2) - 
        ((rowEl.offsetTop + rowEl.offsetHeight / 2) * targetScale);
      setScale(targetScale);
      setTranslateY(centerOffset);
    }
  }, [activeIndex, sortedGens, containerRef]);

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
    setScale(1);
    setTranslateY(0);
    setIsPaused(false);
  }, []);

  return {
    activeIndex,
    isPaused,
    scale,
    translateY,
    goToPrevious,
    goToNext,
    togglePause,
    reset,
    currentGen: sortedGens[activeIndex],
  };
}

