// Custom hook for presentation mode with auto-animation
// Handles scaling and centering to fit each generation in view

import { useState, useEffect, useCallback, useRef } from 'react';
import { ANIMATION_CONFIG } from '../config';

export function usePresentationMode(sortedGens, containerRef) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transform, setTransform] = useState({ scale: 1, translateY: 0 });
  const contentRef = useRef(null);

  // Set content ref from outside
  const setContentRef = useCallback((ref) => {
    contentRef.current = ref;
  }, []);

  // Auto-animate through generations
  useEffect(() => {
    if (!isPaused && sortedGens.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % sortedGens.length);
      }, ANIMATION_CONFIG.autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isPaused, sortedGens.length]);

  // Calculate transform to center and fit the active generation
  useEffect(() => {
    const activeGenKey = sortedGens[activeIndex];
    const rowEl = document.getElementById(`gen-row-${activeGenKey}`);
    const container = containerRef.current;
    
    if (!rowEl || !container) return;

    // Get dimensions
    const containerHeight = container.clientHeight - 120; // Account for header and controls
    const containerWidth = container.clientWidth - 60; // Padding
    const rowRect = rowEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate scale to fit the row
    const scaleX = containerWidth / rowRect.width;
    const scaleY = containerHeight / (rowRect.height + 100); // Extra space for comfort
    const scale = Math.min(scaleX, scaleY, 1.5); // Cap at 1.5x

    // Calculate Y translation to center the row
    const rowCenterY = rowRect.top - containerRect.top + rowRect.height / 2;
    const containerCenterY = containerHeight / 2 + 60; // Account for header
    const translateY = (containerCenterY - rowCenterY * scale) / scale;

    setTransform({ scale, translateY });
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
    setIsPaused(false);
    setTransform({ scale: 1, translateY: 0 });
  }, []);

  return {
    activeIndex,
    isPaused,
    transform,
    setContentRef,
    goToPrevious,
    goToNext,
    togglePause,
    reset,
    currentGen: sortedGens[activeIndex],
  };
}
