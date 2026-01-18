// Error state component shown when backend connection fails

import React from 'react';
import { ServerOff } from 'lucide-react';

export function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
      <ServerOff size={48} className="text-stone-300 mb-4" />
      <h3 className="text-lg font-bold text-stone-700 mb-2">Connection Required</h3>
      <p className="text-stone-500 text-sm mb-6">{message}</p>
      <div className="bg-stone-800 text-stone-300 p-4 rounded-lg text-left text-xs font-mono w-full">
        <div className="text-stone-500 mb-2"># Steps to fix:</div>
        <div>1. Navigate to backend folder</div>
        <div>2. Run: <span className="text-green-400">npm start</span></div>
        <div>3. Refresh this page</div>
      </div>
    </div>
  );
}

