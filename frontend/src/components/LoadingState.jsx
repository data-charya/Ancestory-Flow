// Loading state component

import React from 'react';

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-stone-600 animate-pulse">{message}</p>
      </div>
    </div>
  );
}

