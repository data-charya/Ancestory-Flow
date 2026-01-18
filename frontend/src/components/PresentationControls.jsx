// Presentation mode navigation controls

import React from 'react';
import { ChevronUp, ChevronDown, Play, X } from 'lucide-react';

export function PresentationControls({
  currentGen,
  isPaused,
  onPrevious,
  onNext,
  onTogglePause,
  onExit,
}) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg border border-indigo-100">
      {/* Previous Generation */}
      <button 
        onClick={onPrevious} 
        className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors"
        title="Previous generation"
      >
        <ChevronUp size={20} />
      </button>
      
      {/* Play/Pause Toggle */}
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
      
      {/* Current Generation Indicator */}
      <span className="text-xs font-bold uppercase text-stone-400 px-2 tracking-widest min-w-[100px] text-center">
        Gen {currentGen}
      </span>
      
      {/* Next Generation */}
      <button 
        onClick={onNext} 
        className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors"
        title="Next generation"
      >
        <ChevronDown size={20} />
      </button>
      
      {/* Exit Button */}
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

