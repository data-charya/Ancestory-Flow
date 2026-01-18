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


  // Fullscreen presentation mode - shows ONE generation at a time
  if (isFullscreen) {
    const currentGenMembers = grouped[presentation.currentGen] || [];
    
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex flex-col overflow-hidden presentation-bg"
      >
        {/* Floating dust particles */}
        <div className="dust-particle dust-1"></div>
        <div className="dust-particle dust-2"></div>
        <div className="dust-particle dust-3"></div>
        <div className="dust-particle dust-4"></div>
        <div className="dust-particle dust-5"></div>
        <div className="dust-particle dust-6"></div>
        <div className="dust-particle dust-7"></div>
        <div className="dust-particle dust-8"></div>
        <div className="dust-particle dust-9"></div>
        <div className="dust-particle dust-10"></div>
        <div className="dust-particle dust-11"></div>
        <div className="dust-particle dust-12"></div>
        
        {/* Shimmer particles */}
        <div className="shimmer-particle shimmer-1"></div>
        <div className="shimmer-particle shimmer-2"></div>
        <div className="shimmer-particle shimmer-3"></div>
        <div className="shimmer-particle shimmer-4"></div>
        <div className="shimmer-particle shimmer-5"></div>
        <div className="shimmer-particle shimmer-6"></div>

        {/* Title */}
        <div className="text-center py-8 flex-shrink-0 z-10">
          <h1 className="text-4xl font-serif font-bold text-stone-200 mb-3 drop-shadow-lg">Family Tree</h1>
          <p className="text-amber-200/80 text-2xl font-medium">
            {getGenerationName(presentation.currentGen)}
          </p>
          <p className="text-stone-400 text-sm mt-2">
            {presentation.activeIndex + 1} of {presentation.totalGens} generations
          </p>
        </div>

        {/* Current Generation - Centered */}
        <div 
          ref={contentRef}
          className="flex-1 flex items-center justify-center px-8 z-10"
        >
          <div 
            key={presentation.currentGen}
            className="flex justify-center gap-8 flex-wrap animate-fade-in"
          >
            {currentGenMembers.map(member => (
              <PresentationMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="pb-8 flex-shrink-0 z-10">
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
      {/* Color Legend - pastel colors */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-stone-100 px-4 py-2">
        <div className="flex flex-wrap justify-center gap-4 text-[10px] text-stone-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-200 border border-emerald-300"></span> Self</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-200 border border-pink-300"></span> Spouse</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-200 border border-sky-300"></span> Parents</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-200 border border-violet-300"></span> Siblings</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-200 border border-indigo-300"></span> Grandparents</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-200 border border-teal-300"></span> Aunts/Uncles</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-300"></span> Children</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-200 border border-rose-300"></span> In-Laws</span>
        </div>
      </div>

      <div 
        ref={contentRef} 
        className="relative min-w-full p-8 min-h-max pb-24"
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

// Warm pastel colors for presentation mode
const getRelationColor = (relation) => {
  const r = (relation || '').toLowerCase();
  if (r.includes('self') || r === 'you') return 'ring-amber-200/50 border-amber-300';
  if (r.includes('wife') || r.includes('husband') || r.includes('spouse')) return 'ring-rose-200/50 border-rose-300';
  if (r.includes('father') || r.includes('mother') || r.includes('parent')) return 'ring-orange-200/50 border-orange-300';
  if (r.includes('brother') || r.includes('sister') || r.includes('sibling')) return 'ring-yellow-200/50 border-yellow-300';
  if (r.includes('son') || r.includes('daughter') || r.includes('child')) return 'ring-lime-200/50 border-lime-300';
  if (r.includes('grand')) return 'ring-stone-200/50 border-stone-300';
  if (r.includes('uncle') || r.includes('aunt')) return 'ring-amber-100/50 border-amber-200';
  if (r.includes('cousin')) return 'ring-orange-100/50 border-orange-200';
  if (r.includes('niece') || r.includes('nephew')) return 'ring-yellow-100/50 border-yellow-200';
  if (r.includes('in-law')) return 'ring-rose-100/50 border-rose-200';
  return 'ring-stone-300/30 border-stone-400';
};

// Presentation mode member card with warm styling
function PresentationMemberCard({ member }) {
  const { id, name, relation } = member;
  const imageUrl = member.imageUrl || member.image_url;
  const colorClass = getRelationColor(relation);
  
  return (
    <div id={`node-${id}`} className="flex flex-col items-center w-40 md:w-48">
      {/* Avatar with soft glow */}
      <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-3 ${colorClass} shadow-2xl overflow-hidden bg-stone-800 mb-3 flex-shrink-0 ring-4 ring-offset-4 ring-offset-stone-900/50`}>
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
        <div className="font-semibold text-lg text-stone-100 truncate max-w-full drop-shadow">{name}</div>
        <div className="text-xs text-amber-200/70 uppercase tracking-wider font-medium">{relation}</div>
      </div>
    </div>
  );
}
