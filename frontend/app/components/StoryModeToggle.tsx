'use client';

import { useState } from 'react';

interface StoryModeToggleProps {
  onChange?: (isEnabled: boolean) => void;
}

export default function StoryModeToggle({ onChange }: StoryModeToggleProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="w-[300px] border-l border-gray-800 bg-[#0F1218]">
      <button
        onClick={handleToggle}
        className="w-full p-4 flex items-center justify-between text-gray-100 hover:bg-gray-800/30 transition-colors"
      >
        <span className="font-medium">Story Mode</span>
        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isEnabled ? 'bg-green-500' : 'bg-gray-700'
        }`}>
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </div>
      </button>
    </div>
  );
}
