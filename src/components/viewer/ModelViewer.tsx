
"use client"

import React, { useState, useCallback } from 'react';
import ThreeCanvas from './ThreeCanvas';
import DropOverlay from './DropOverlay';
import Sidebar from './Sidebar';
import Controls from './Controls';
import { Upload, ShieldCheck } from 'lucide-react';
import { validateFile, SUPPORTED_EXTENSIONS } from '@/lib/file-validation';

const ModelViewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fitTrigger, setFitTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleFileDrop = useCallback((droppedFile: File) => {
    const validation = validateFile(droppedFile);
    
    if (!validation.isValid) {
      setError(validation.error);
      setFile(null);
      setMetadata(null);
      return;
    }

    setFile(droppedFile);
    setError(null);
  }, []);

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileDrop(e.target.files[0]);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#21252C]">
      {/* Three.js Scene */}
      <ThreeCanvas 
        file={file} 
        onModelLoaded={setMetadata} 
        onLoading={setIsLoading} 
        onError={setError}
        fitToViewTrigger={fitTrigger}
        resetCameraTrigger={resetTrigger}
      />

      {/* Main UI Layer */}
      <Sidebar metadata={metadata} isLoading={isLoading} error={error} />
      
      {file && !isLoading && !error && (
        <Controls 
          onFitToView={() => setFitTrigger(prev => prev + 1)} 
          onResetCamera={() => setResetTrigger(prev => prev + 1)} 
        />
      )}

      {/* Full Screen Drop Zone */}
      <DropOverlay onFileDrop={handleFileDrop} />

      {/* Empty State / Initial Instructions */}
      {(!file || error) && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="max-w-xl text-center px-6">
            <div className="mb-8 inline-flex items-center justify-center p-6 rounded-3xl bg-primary/10 border border-primary/20 backdrop-blur-sm animate-pulse">
              <Upload className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-headline font-black mb-4 tracking-tight">
              Drag and drop 3D models here
            </h1>
            <p className="text-muted-foreground font-body text-lg mb-8">
              Professional browser-based inspection for modern engineering workflows.
            </p>
            
            <div className="relative pointer-events-auto flex flex-col items-center gap-4">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleInputFileChange}
                accept={SUPPORTED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
              />
              <label 
                htmlFor="file-upload" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold font-headline hover:bg-primary/90 transition-all cursor-pointer shadow-xl shadow-primary/20 active:scale-95"
              >
                Browse Files
              </label>
              
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 font-code uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Secure Sandbox Processing
              </div>
            </div>

            <p className="mt-12 text-[11px] font-code text-muted-foreground/60 uppercase tracking-widest leading-loose max-w-lg mx-auto">
              Supported formats: {SUPPORTED_EXTENSIONS.join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Background Aesthetic Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default ModelViewer;
