'use client';

import { useState } from 'react';

interface StyleOptionsProps {
  onStyleChange: (styles: {
    titleColor: string;
    titleFont: string;
    backgroundColor: string;
    chartColor: string;
    chartBackground: string;
  }) => void;
}

const fontOptions = [
  'Inter',
  'Roboto',
  'Montserrat',
  'Open Sans',
  'Poppins'
];

export default function StyleOptions({ onStyleChange }: StyleOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [styles, setStyles] = useState({
    titleColor: '#E5E7EB',
    titleFont: 'Inter',
    backgroundColor: '#111827',
    chartColor: '#10B981',
    chartBackground: '#1F2937'
  });

  const handleStyleChange = (key: keyof typeof styles, value: string) => {
    const newStyles = { ...styles, [key]: value };
    setStyles(newStyles);
    onStyleChange(newStyles);
  };

  return (
    <div className="w-[300px] border-l border-gray-800 bg-[#0F1218] overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-gray-100 hover:bg-gray-800/30 transition-colors"
      >
        <span className="font-medium">Style Options</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`space-y-6 p-4 ${isOpen ? 'block' : 'hidden'}`}>
        {/* Title Color */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Title Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={styles.titleColor}
              onChange={(e) => handleStyleChange('titleColor', e.target.value)}
              className="w-8 h-8 rounded border border-gray-700 bg-[#1A1F27] cursor-pointer"
            />
            <input
              type="text"
              value={styles.titleColor}
              onChange={(e) => handleStyleChange('titleColor', e.target.value)}
              className="flex-1 px-3 py-1 bg-[#1A1F27] border border-gray-700 rounded text-gray-100 text-sm"
            />
          </div>
        </div>

        {/* Title Font */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Title Font</label>
          <select
            value={styles.titleFont}
            onChange={(e) => handleStyleChange('titleFont', e.target.value)}
            className="w-full px-3 py-2 bg-[#1A1F27] border border-gray-700 rounded text-gray-100 text-sm"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={styles.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-8 h-8 rounded border border-gray-700 bg-[#1A1F27] cursor-pointer"
            />
            <input
              type="text"
              value={styles.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-1 bg-[#1A1F27] border border-gray-700 rounded text-gray-100 text-sm"
            />
          </div>
        </div>

        {/* Chart Color */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Chart Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={styles.chartColor}
              onChange={(e) => handleStyleChange('chartColor', e.target.value)}
              className="w-8 h-8 rounded border border-gray-700 bg-[#1A1F27] cursor-pointer"
            />
            <input
              type="text"
              value={styles.chartColor}
              onChange={(e) => handleStyleChange('chartColor', e.target.value)}
              className="flex-1 px-3 py-1 bg-[#1A1F27] border border-gray-700 rounded text-gray-100 text-sm"
            />
          </div>
        </div>

        {/* Chart Background */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Chart Background</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={styles.chartBackground}
              onChange={(e) => handleStyleChange('chartBackground', e.target.value)}
              className="w-8 h-8 rounded border border-gray-700 bg-[#1A1F27] cursor-pointer"
            />
            <input
              type="text"
              value={styles.chartBackground}
              onChange={(e) => handleStyleChange('chartBackground', e.target.value)}
              className="flex-1 px-3 py-1 bg-[#1A1F27] border border-gray-700 rounded text-gray-100 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}