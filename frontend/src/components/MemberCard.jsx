// Individual family member card component

import React from 'react';

export function MemberCard({ member, onClick }) {
  const { id, name, relation, imageUrl } = member;
  
  return (
    <div 
      id={`node-${id}`} 
      className="flex flex-col items-center w-32 md:w-48 cursor-pointer group"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-stone-200 mb-2 group-hover:border-indigo-200 transition-colors">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            className="w-full h-full object-cover" 
            alt={name} 
          />
        ) : (
          <div className="h-full flex items-center justify-center text-stone-400 font-bold text-lg">
            {name[0]}
          </div>
        )}
      </div>
      
      {/* Info Card */}
      <div className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-center w-full shadow-sm group-hover:border-indigo-200 group-hover:shadow-md transition-all">
        <div className="font-bold text-xs truncate">{name}</div>
        <div className="text-[10px] text-indigo-600 uppercase">{relation}</div>
      </div>
    </div>
  );
}

