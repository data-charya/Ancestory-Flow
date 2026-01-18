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
  onExitPresentation,
  isFullscreen = false
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
  const lines = useTreeLines(members, contentRef);

  // Reset presentation when exiting
  useEffect(() => {
    if (!presentationMode) {
      presentation.reset();
    }
  }, [presentationMode, presentation]);

  // Fullscreen presentation mode styles
  if (isFullscreen) {
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex flex-col"
      >
        {/* Title */}
        <div className="text-center py-4 flex-shrink-0">
          <h1 className="text-3xl font-serif font-bold text-white/90">Family Tree</h1>
          <p className="text-white/50 text-sm mt-1">Generation {presentation.currentGen}</p>
        </div>

        {/* Tree Content - Scrollable */}
        <div className="flex-1 overflow-auto px-8 py-4">
          <div 
            ref={contentRef} 
            className="relative min-w-full"
          >
            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {lines.map(line => (
                <path 
                  key={line.id} 
                  d={line.path} 
                  stroke={line.type === 'spouse' ? '#f472b6' : line.type === 'sibling' ? '#60a5fa' : LINE_STYLE.stroke}
                  strokeWidth={line.type === 'spouse' ? 3 : line.type === 'sibling' ? 2 : LINE_STYLE.strokeWidth}
                  strokeDasharray={line.type === 'spouse' ? 'none' : LINE_STYLE.strokeDasharray}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="opacity-50"
                />
              ))}
            </svg>

            {/* Generation Rows */}
            <div className="flex flex-col gap-16 items-center py-8">
              {sortedGens.map(gen => (
                <div 
                  key={gen} 
                  id={`gen-row-${gen}`} 
                  className="flex justify-center gap-8 transition-all duration-500"
                  style={{ 
                    opacity: gen !== presentation.currentGen ? 0.2 : 1,
                  }}
                >
                  {grouped[gen].map(member => (
                    <PresentationMemberCard key={member.id} member={member} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls at Bottom */}
        <div className="pb-6 flex-shrink-0">
          <PresentationControls
            currentGen={presentation.currentGen}
            isPaused={presentation.isPaused}
            onPrevious={presentation.goToPrevious}
            onNext={presentation.goToNext}
            onTogglePause={presentation.togglePause}
            onExit={onExitPresentation}
            isFullscreen={true}
          />
        </div>
      </div>
    );
  }

  // Normal tree view mode
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-stone-50 rounded-xl border border-stone-200 overflow-auto"
    >
      {/* Tree Content */}
      <div 
        ref={contentRef} 
        className="relative min-w-full p-12 min-h-max pb-24"
      >
        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none z-0" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {lines.map(line => (
            <path 
              key={line.id} 
              d={line.path} 
              stroke={line.type === 'spouse' ? '#f472b6' : line.type === 'sibling' ? '#60a5fa' : LINE_STYLE.stroke}
              strokeWidth={line.type === 'spouse' ? 3 : line.type === 'sibling' ? 2 : LINE_STYLE.strokeWidth}
              strokeDasharray={line.type === 'spouse' ? 'none' : LINE_STYLE.strokeDasharray}
              strokeLinecap="round"
              strokeLinejoin="round"
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
              className="flex justify-center gap-8"
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

// Special member card for presentation mode
function PresentationMemberCard({ member }) {
  const { id, name, relation } = member;
  // Handle both camelCase and snake_case from API
  const imageUrl = member.imageUrl || member.image_url;
  
  return (
    <div id={`node-${id}`} className="flex flex-col items-center w-40 md:w-56">
      {/* Avatar */}
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-stone-700 mb-3 flex-shrink-0">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            className="w-full h-full object-cover" 
            alt={name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`h-full w-full items-center justify-center text-white/60 font-bold text-3xl bg-gradient-to-br from-stone-600 to-stone-700 ${imageUrl ? 'hidden' : 'flex'}`}
        >
          {name?.[0] || '?'}
        </div>
      </div>
      
      {/* Info */}
      <div className="text-center">
        <div className="font-bold text-lg text-white">{name}</div>
        <div className="text-sm text-indigo-300 uppercase tracking-wide">{relation}</div>
      </div>
    </div>
  );
}
