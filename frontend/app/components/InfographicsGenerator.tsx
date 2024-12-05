'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { generateFromText, generateFromFile } from '../services/api';

export default function InfographicsGenerator() {
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const blob = await generateFromText(text);
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'infographic.mp4';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const blob = await generateFromFile(file);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'infographic.mp4';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".txt,.pdf,.doc,.docx"
        />
        <button
          className="p-2 rounded-lg bg-[#1A1F27] border border-gray-700 hover:bg-[#242936] transition-colors"
          title="Upload file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#1A1F27] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          placeholder="Enter your text or upload a file to generate an infographic..."
        />
        <button
          type="submit"
          disabled={loading || (!text && !file)}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            'Generate'
          )}
        </button>
      </form>
      {error && (
        <div className="absolute bottom-full left-0 right-0 p-3 mb-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
