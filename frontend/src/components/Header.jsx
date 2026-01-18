// Application header with navigation and actions

import React from 'react';
import { Plus, Play, RotateCcw, Network, Database } from 'lucide-react';

export function Header({ 
  viewMode, 
  setViewMode, 
  onAddMember, 
  onReset, 
  hasMembers 
}) {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Database size={20} />
          </div>
          <h1 className="text-xl font-serif font-bold text-stone-800 hidden md:block">
            Ancestry Flow{' '}
            <span className="text-xs font-sans font-normal text-stone-400">PostgreSQL</span>
          </h1>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onAddMember} 
            className="hidden md:flex items-center gap-2 text-stone-600 hover:text-stone-900 font-medium px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm">Add Member</span>
          </button>
          
          {hasMembers && (
            <button 
              onClick={onReset} 
              className="hidden md:flex items-center gap-2 text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw size={16} />
              <span className="text-sm">Reset</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button 
              onClick={() => setViewMode('tree')} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'tree' 
                  ? 'bg-white text-stone-800 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Network size={14} /> 
              <span className="hidden sm:inline">Tree View</span>
            </button>
            <button 
              onClick={() => hasMembers ? setViewMode('presentation') : alert("No data")} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'presentation' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Play size={14} /> 
              <span className="hidden sm:inline">Presentation</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

