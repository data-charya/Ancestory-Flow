// Family tree visualization component

import React, { useRef, useMemo, useEffect } from 'react';
import { MemberCard } from './MemberCard';
import { PresentationControls } from './PresentationControls';
import { useTreeLines } from '../hooks/useTreeLines';
import { usePresentationMode } from '../hooks/usePresentationMode';
import { LINE_STYLE } from '../config';

export function TreeView({ 
  members, 
  onEdit, 
  presentationMode, 
  onExitPresentation 
}) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // Group members by generation
  const grouped = useMemo(() => {
    const groups = {};
    members.forEach(m => {
      const gen = m.generation ?? 0;
      if (!groups[gen]) groups[gen] = [];
      groups[gen].push(m);
    });
    return groups;
  }, [members]);

  // Get sorted generation keys (descending - oldest first)
  const sortedGens = useMemo(() => 
    Object.keys(grouped).map(Number).sort((a, b) => b - a), 
    [grouped]
  );

  // Presentation mode state
  const presentation = usePresentationMode(sortedGens, containerRef);
  
  // Calculate connection lines
  const lines = useTreeLines(
    members, 
    contentRef, 
    presentationMode ? presentation.scale : 1
  );

  // Reset presentation when exiting
  useEffect(() => {
    if (!presentationMode) {
      presentation.reset();
    }
  }, [presentationMode, presentation]);

  // Determine transform based on mode
  const transform = presentationMode 
    ? `translateY(${presentation.translateY}px) scale(${presentation.scale})`
    : 'none';

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-stone-50 rounded-xl border border-stone-200 ${
        presentationMode ? 'overflow-hidden' : 'overflow-auto'
      }`}
    >
      {/* Presentation Controls */}
      {presentationMode && (
        <PresentationControls
          currentGen={presentation.currentGen}
          isPaused={presentation.isPaused}
          onPrevious={presentation.goToPrevious}
          onNext={presentation.goToNext}
          onTogglePause={presentation.togglePause}
          onExit={onExitPresentation}
        />
      )}

      {/* Tree Content */}
      <div 
        ref={contentRef} 
        className={`min-w-full p-12 transition-transform duration-700 ease-in-out origin-top ${
          presentationMode ? '' : 'min-h-max pb-24'
        }`}
        style={{ transform }}
      >
        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {lines.map(line => (
            <path 
              key={line.id} 
              d={line.path} 
              stroke={LINE_STYLE.stroke}
              strokeWidth={LINE_STYLE.strokeWidth}
              strokeDasharray={LINE_STYLE.strokeDasharray}
              fill="none" 
            />
          ))}
        </svg>

        {/* Generation Rows */}
        <div className="flex flex-col gap-24 items-center">
          {sortedGens.map(gen => (
            <div 
              key={gen} 
              id={`gen-row-${gen}`} 
              className="flex justify-center gap-8 transition-opacity duration-700"
              style={{ 
                opacity: presentationMode && gen !== presentation.currentGen ? 0.1 : 1 
              }}
            >
              {grouped[gen].map(member => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onClick={() => onEdit(member)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

