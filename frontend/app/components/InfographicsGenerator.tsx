'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { generateFromTextInfographic, generateFromFileInfographic, renderVideo } from '../services/api';

interface InfographicsGeneratorProps {
  onApiResponse?: (response: any) => void;
  inputProps?: any;
}

export default function InfographicsGenerator({ onApiResponse, inputProps }: InfographicsGeneratorProps) {
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileMessage, setFileMessage] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  // Log inputProps for debugging
  useEffect(() => {
    console.log('InfographicsGenerator inputProps:', inputProps);
  }, [inputProps]);

  const handleTextSubmit = async () => {
    if (file) return;  
    setLoading(true);
    setError(null);

    try {
      const response = await generateFromTextInfographic(text);
      if (onApiResponse) {
        onApiResponse(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async () => {
    if (!file || text) return;  

    setLoading(true);
    setError(null);

    try {
      const response = await generateFromFileInfographic(file);
      if (onApiResponse) {
        onApiResponse(response);
      }
      setFileMessage('File uploaded and processed successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      await handleFileSubmit();
    } else if (text) {
      await handleTextSubmit();
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (file) setFile(null);  
    setFileMessage(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && !selectedFile.name.match(/\.(csv|txt)$/i)) {
      setError('Only CSV or TXT files are allowed.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setFileMessage(selectedFile ? `Uploaded: ${selectedFile.name}` : null);
    if (text) setText('');  
  };

  const handleClearFile = () => {
    setFile(null);
    setFileMessage(null);
  };

  const handleDownload = async () => {
    if (!inputProps) {
      setError('No input properties provided for rendering');
      return;
    }
    
    setDownloadLoading(true);
    setError(null);

    try {
      await renderVideo(inputProps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download video');
      console.error('Download error:', err);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex items-center gap-2">
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".csv,.txt"
            disabled={!!text}  
          />
          <button
            type="button"
            className={`p-2 rounded-lg border transition-colors ${
              file 
                ? 'bg-emerald-600/20 border-emerald-600/30 hover:bg-emerald-600/30' 
                : 'bg-[#1A1F27] border-gray-700 hover:bg-[#242936]'
            }`}
            title={file ? 'File uploaded' : 'Upload file'}
            disabled={!!text}  
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-colors ${file ? 'text-emerald-500' : 'text-gray-400'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
        </div>
        {file && (
          <button
            type="button"
            onClick={handleClearFile}
            className="p-2 rounded-lg bg-[#1A1F27] border border-gray-700 hover:bg-[#242936] transition-colors"
            title="Clear file"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          className="flex-1 px-4 py-2 bg-[#1A1F27] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          placeholder="Enter your text or upload a file to generate an infographic..."
          disabled={!!file}  
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
        <button
          type="button"
          onClick={handleDownload}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          disabled={loading || downloadLoading || !inputProps}
        >
          {downloadLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Video</span>
            </>
          )}
        </button>
      </form>

      {fileMessage && <p className="absolute bottom-full left-0 right-0 p-3 mb-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">{fileMessage}</p>}
      {error && (
        <div className="absolute bottom-full left-0 right-0 p-3 mb-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
