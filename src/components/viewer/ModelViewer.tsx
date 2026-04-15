"use client"

import React, { useCallback } from 'react';
import ThreeCanvas from './ThreeCanvas';
import DropOverlay from './DropOverlay';
import Sidebar from './Sidebar';
import Controls from './Controls';
import { Upload, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';
import { validateFile, SUPPORTED_EXTENSIONS } from '@/lib/file-validation';
import { useViewerStore } from '@/store/use-viewer-store';
import { Button } from '@/components/ui/button';

const ModelViewer = () => {
  const { 
    file, 
    isLoading, 
    error, 
    setFile, 
    setError,
    reset
  } = useViewerStore();

  const handleFileDrop = useCallback((droppedFile: File) => {
    const validation = validateFile(droppedFile);
    
    if (!validation.isValid) {
      setError(validation.error);
      setFile(null);
      return;
    }

    setFile(droppedFile);
  }, [setFile, setError]);

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileDrop(e.target.files[0]);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#21252C]" role="main" aria-label="ModelVue 3D Viewer Application">
      {/* Three.js Scene */}
      <ThreeCanvas />

      {/* Main UI Layer */}
      <Sidebar />
      
      {file && !isLoading && !error && <Controls />}

      {/* Full Screen Drop Zone */}
      <DropOverlay onFileDrop={handleFileDrop} />

      {/* Error State */}
      {error && !isLoading && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 bg-[#21252C]/40 backdrop-blur-[2px]"
          role="alert"
          aria-live="assertive"
        >
           <div className="max-w-md text-center px-6 animate-in fade-in zoom-in duration-300">
            <div className="mb-6 inline-flex items-center justify-center p-6 rounded-3xl bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-12 h-12 text-destructive" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-headline font-black mb-4 tracking-tight text-destructive uppercase">
              Failed to load model
            </h2>
            <p className="text-muted-foreground font-body text-sm mb-8 leading-relaxed">
              {error}
            </p>
            <div className="pointer-events-auto">
              <Button 
                onClick={reset}
                className="bg-primary hover:bg-primary/90 rounded-xl gap-2 px-8 font-bold"
                aria-label="Return to Home and clear error"
              >
                <RefreshCcw className="w-4 h-4" />
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State / Initial Instructions */}
      {!file && !error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="max-w-xl text-center px-6">
            <div className="mb-8 inline-flex items-center justify-center p-6 rounded-3xl bg-primary/10 border border-primary/20 backdrop-blur-sm animate-pulse">
              <Upload className="w-12 h-12 text-primary" aria-hidden="true" />
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
                aria-label="Upload 3D Model file"
              />
              <label 
                htmlFor="file-upload" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold font-headline hover:bg-primary/90 transition-all cursor-pointer shadow-xl shadow-primary/20 active:scale-95"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('file-upload')?.click() }}
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50 bg-[#21252C]/20 backdrop-blur-[2px]" role="status" aria-live="polite">
          <div className="text-center">
            <RefreshCcw className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg font-bold">Analyzing geometry...</p>
          </div>
        </div>
      )}

      {/* Background Aesthetic Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
    </div>
  );
};

export default ModelViewer;