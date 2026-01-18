// Individual family member card component

import React from 'react';

export function MemberCard({ member, onClick }) {
  const { id, name, relation } = member;
  // Handle both camelCase and snake_case from API
  const imageUrl = member.imageUrl || member.image_url;
  
  return (
    <div 
      id={`node-${id}`} 
      className="flex flex-col items-center w-32 md:w-48 cursor-pointer group"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-stone-200 mb-2 group-hover:border-indigo-200 transition-colors flex-shrink-0">
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
          className={`h-full w-full items-center justify-center text-stone-400 font-bold text-xl bg-gradient-to-br from-stone-200 to-stone-300 ${imageUrl ? 'hidden' : 'flex'}`}
        >
          {name?.[0] || '?'}
        </div>
      </div>
      
      {/* Info Card */}
      <div className="bg-white px-3 py-2 rounded-lg border border-stone-200 text-center w-full shadow-sm group-hover:border-indigo-200 group-hover:shadow-md transition-all">
        <div className="font-bold text-sm truncate">{name}</div>
        <div className="text-xs text-indigo-600 uppercase">{relation}</div>
      </div>
    </div>
  );
}
