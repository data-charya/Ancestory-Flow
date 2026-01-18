// Empty state component shown when no family members exist

import React from 'react';
import { User, Sparkles } from 'lucide-react';

export function EmptyState({ onAddMember, onLoadDemo }) {
  return (
    <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-stone-200">
      <User size={32} className="mx-auto mb-4 text-stone-400" />
      <h3 className="text-lg font-medium text-stone-600">PostgreSQL is ready</h3>
      <p className="text-stone-400 mt-1 mb-6">
        Database connected but no family members found.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button 
          onClick={onAddMember} 
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Add First Member
        </button>
        <button 
          onClick={onLoadDemo} 
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
        >
          <Sparkles size={18} />
          Load Demo Data
        </button>
      </div>
    </div>
  );
}

