// Individual family member card component with pastel color-coded relationships

import React from 'react';

// Pastel color coding for different relationship types
const getRelationStyle = (relation) => {
  const r = (relation || '').toLowerCase();
  
  if (r.includes('self') || r === 'you') {
    return { border: 'border-emerald-200', bg: 'bg-emerald-50/50', text: 'text-emerald-600', ring: 'ring-emerald-100' };
  }
  if (r.includes('wife') || r.includes('husband') || r.includes('spouse')) {
    return { border: 'border-pink-200', bg: 'bg-pink-50/50', text: 'text-pink-600', ring: 'ring-pink-100' };
  }
  if (r.includes('father') || r.includes('mother') || r.includes('parent')) {
    return { border: 'border-sky-200', bg: 'bg-sky-50/50', text: 'text-sky-600', ring: 'ring-sky-100' };
  }
  if (r.includes('brother') || r.includes('sister') || r.includes('sibling')) {
    return { border: 'border-violet-200', bg: 'bg-violet-50/50', text: 'text-violet-600', ring: 'ring-violet-100' };
  }
  if (r.includes('son') || r.includes('daughter') || r.includes('child')) {
    return { border: 'border-amber-200', bg: 'bg-amber-50/50', text: 'text-amber-600', ring: 'ring-amber-100' };
  }
  if (r.includes('grand')) {
    return { border: 'border-indigo-200', bg: 'bg-indigo-50/50', text: 'text-indigo-600', ring: 'ring-indigo-100' };
  }
  if (r.includes('uncle') || r.includes('aunt')) {
    return { border: 'border-teal-200', bg: 'bg-teal-50/50', text: 'text-teal-600', ring: 'ring-teal-100' };
  }
  if (r.includes('cousin')) {
    return { border: 'border-cyan-200', bg: 'bg-cyan-50/50', text: 'text-cyan-600', ring: 'ring-cyan-100' };
  }
  if (r.includes('niece') || r.includes('nephew')) {
    return { border: 'border-orange-200', bg: 'bg-orange-50/50', text: 'text-orange-600', ring: 'ring-orange-100' };
  }
  if (r.includes('in-law')) {
    return { border: 'border-rose-200', bg: 'bg-rose-50/50', text: 'text-rose-600', ring: 'ring-rose-100' };
  }
  
  return { border: 'border-stone-200', bg: 'bg-stone-50/50', text: 'text-stone-500', ring: 'ring-stone-100' };
};

export function MemberCard({ member, onClick }) {
  const { id, name, relation } = member;
  const imageUrl = member.imageUrl || member.image_url;
  const style = getRelationStyle(relation);
  
  return (
    <div 
      id={`node-${id}`} 
      className="flex flex-col items-center w-32 md:w-40 cursor-pointer group"
      onClick={onClick}
    >
      {/* Avatar with soft colored ring */}
      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 ${style.border} shadow-sm overflow-hidden bg-white mb-2 group-hover:ring-4 ${style.ring} transition-all flex-shrink-0`}>
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
          className={`h-full w-full items-center justify-center text-stone-400 font-medium text-xl bg-gradient-to-br from-stone-50 to-stone-100 ${imageUrl ? 'hidden' : 'flex'}`}
        >
          {name?.[0] || '?'}
        </div>
      </div>
      
      {/* Info Card with soft colored background */}
      <div className={`${style.bg} px-3 py-2 rounded-lg border ${style.border} text-center w-full shadow-sm group-hover:shadow transition-all`}>
        <div className="font-semibold text-sm truncate text-stone-700">{name}</div>
        <div className={`text-[10px] font-medium uppercase tracking-wide ${style.text}`}>{relation}</div>
      </div>
    </div>
  );
}
