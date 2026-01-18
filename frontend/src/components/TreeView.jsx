// Family tree visualization component

import React, { useRef, useMemo, useEffect } from 'react';
import { MemberCard } from './MemberCard';
import { PresentationControls } from './PresentationControls';
import { useTreeLines } from '../hooks/useTreeLines';
import { usePresentationMode } from '../hooks/usePresentationMode';
import { getGenerationName } from '../config';


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


  // Fullscreen presentation mode
  if (isFullscreen) {
    const { scale, translateY } = presentation.transform;
    
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex flex-col overflow-hidden"
      >
        {/* Title */}
        <div className="text-center py-4 flex-shrink-0 z-10">
          <h1 className="text-3xl font-serif font-bold text-white/90">Family Tree</h1>
          <p className="text-indigo-300 text-lg mt-1 font-medium">
            {getGenerationName(presentation.currentGen)}
          </p>
        </div>

        {/* Tree Content - No scroll, transform to fit */}
        <div className="flex-1 overflow-hidden relative">
          <div 
            ref={contentRef} 
            className="absolute inset-0 flex flex-col items-center justify-start transition-transform duration-700 ease-out"
            style={{ 
              transform: `translateY(${translateY}px) scale(${scale})`,
              transformOrigin: 'top center'
            }}
          >
            {/* Connection Lines - subtle */}
            <svg 
              className="absolute inset-0 pointer-events-none" 
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              {lines.map(line => (
                <path 
                  key={line.id} 
                  d={line.path} 
                  stroke="#a1a1aa"
                  strokeWidth={1}
                  strokeLinecap="round"
                  fill="none"
                  opacity={0.3}
                />
              ))}
            </svg>

            {/* Generation Rows - extra gap for lines */}
            <div className="flex flex-col gap-16 items-center py-8">
              {sortedGens.map(gen => (
                <div 
                  key={gen} 
                  className="transition-all duration-500"
                  style={{ 
                    opacity: gen !== presentation.currentGen ? 0.1 : 1,
                    transform: gen !== presentation.currentGen ? 'scale(0.85)' : 'scale(1)',
                  }}
                >
                  <div 
                    id={`gen-row-${gen}`} 
                    className="flex justify-center gap-4"
                  >
                    {grouped[gen].map(member => (
                      <PresentationMemberCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="pb-6 flex-shrink-0 z-10">
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
      className="relative w-full h-full bg-gradient-to-b from-stone-50 to-stone-100 rounded-xl border border-stone-200 overflow-auto shadow-inner"
    >
      <div 
        ref={contentRef} 
        className="relative min-w-full p-12 min-h-max pb-24"
      >
        {/* Connection Lines - subtle and minimal */}
        <svg 
          className="absolute inset-0 pointer-events-none" 
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          {lines.map(line => (
            <path 
              key={line.id} 
              d={line.path} 
              stroke="#d4d4d8"
              strokeWidth={1}
              strokeLinecap="round"
              fill="none"
              opacity={0.5}
            />
          ))}
        </svg>

        {/* Generation Rows - extra gap for lines */}
        <div className="flex flex-col gap-20 items-center">
          {sortedGens.map(gen => (
            <div key={gen} className="w-full">
              {/* Generation Label */}
              <div className="text-center mb-4">
                <span className="text-xs font-medium text-stone-400 uppercase tracking-wider bg-stone-100 px-3 py-1 rounded-full">
                  {getGenerationName(gen)}
                </span>
              </div>
              {/* Members */}
              <div 
                id={`gen-row-${gen}`} 
                className="flex justify-center gap-4 flex-wrap"
              >
                {grouped[gen].map(member => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onClick={() => onEdit(member)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Presentation mode member card
function PresentationMemberCard({ member }) {
  const { id, name, relation } = member;
  const imageUrl = member.imageUrl || member.image_url;
  
  return (
    <div id={`node-${id}`} className="flex flex-col items-center w-36 md:w-44">
      {/* Avatar */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-3 border-white/30 shadow-xl overflow-hidden bg-stone-700 mb-2 flex-shrink-0 ring-2 ring-purple-400/20 ring-offset-2 ring-offset-transparent">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            className="w-full h-full object-cover" 
            alt={name}
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`h-full w-full items-center justify-center text-white/70 font-bold text-2xl bg-gradient-to-br from-stone-600 to-stone-700 ${imageUrl ? 'hidden' : 'flex'}`}
        >
          {name?.[0] || '?'}
        </div>
      </div>
      
      {/* Info */}
      <div className="text-center px-2">
        <div className="font-semibold text-base text-white truncate max-w-full">{name}</div>
        <div className="text-xs text-indigo-300/80 uppercase tracking-wider">{relation}</div>
      </div>
    </div>
  );
}
