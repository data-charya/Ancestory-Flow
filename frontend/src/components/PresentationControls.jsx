// Presentation mode navigation controls

import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

export function PresentationControls({
  currentGen,
  isPaused,
  onPrevious,
  onNext,
  onTogglePause,
  onExit,
  isFullscreen = false,
}) {
  if (isFullscreen) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
          {/* Previous Generation */}
          <button 
            onClick={onPrevious} 
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            title="Previous generation"
          >
            <ChevronLeft size={24} />
          </button>
          
          {/* Play/Pause Toggle */}
          <button 
            onClick={onTogglePause} 
            className={`p-4 rounded-full transition-colors ${
              isPaused 
                ? 'bg-green-500/80 text-white hover:bg-green-500' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
          >
            {isPaused ? (
              <Play size={24} />
            ) : (
              <span className="w-6 h-6 flex items-center justify-center font-bold">❚❚</span>
            )}
          </button>
          
          {/* Current Generation Indicator */}
          <div className="px-6 text-center">
            <div className="text-white/50 text-xs uppercase tracking-widest">Generation</div>
            <div className="text-white text-2xl font-bold">{currentGen}</div>
          </div>
          
          {/* Next Generation */}
          <button 
            onClick={onNext} 
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            title="Next generation"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Divider */}
          <div className="w-px h-8 bg-white/20 mx-2" />
          
          {/* Exit Button */}
          <button 
            onClick={onExit} 
            className="p-3 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-200 rounded-full transition-colors"
            title="Exit presentation (ESC)"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Keyboard hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/30 text-xs">
          Press ESC to exit
        </div>
      </div>
    );
  }

  // Default non-fullscreen controls (kept for backwards compatibility)
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg border border-indigo-100">
      <button 
        onClick={onPrevious} 
        className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors"
        title="Previous generation"
      >
        <ChevronUp size={20} />
      </button>
      
      <button 
        onClick={onTogglePause} 
        className={`p-3 rounded-full transition-colors ${
          isPaused 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
        }`}
        title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
      >
        {isPaused ? (
          <Play size={20} />
        ) : (
          <span className="w-5 h-5 flex items-center justify-center font-bold text-xs">❚❚</span>
        )}
      </button>
      
      <span className="text-xs font-bold uppercase text-stone-400 px-2 tracking-widest min-w-[100px] text-center">
        Gen {currentGen}
      </span>
      
      <button 
        onClick={onNext} 
        className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors"
        title="Next generation"
      >
        <ChevronDown size={20} />
      </button>
      
      <button 
        onClick={onExit} 
        className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-full ml-2 transition-colors"
        title="Exit presentation"
      >
        <X size={20} />
      </button>
    </div>
  );
}
