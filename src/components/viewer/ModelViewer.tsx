"use client"

import React, { useCallback } from 'react';
import ThreeCanvas from './ThreeCanvas';
import DropOverlay from './DropOverlay';
import MetadataSidebar from './MetadataSidebar';
import ControlsSidebar from './ControlsSidebar';
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
    <div className="relative w-full h-screen overflow-hidden bg-background" role="main" aria-label="ModelVue 3D Viewer Application">
      {/* Three.js Scene - Layer 0 */}
      <ThreeCanvas />

      {/* Persistent UI Layer - Layer 1 */}
      <MetadataSidebar />
      <ControlsSidebar />
      
      {file && !isLoading && !error && <Controls />}

      {/* Drop Interaction Layer - Layer 2 */}
      <DropOverlay onFileDrop={handleFileDrop} />

      {/* Critical Feedback Overlays - Layer 3 */}
      {error && !isLoading && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50 bg-background/60 backdrop-blur-md"
          role="alert"
          aria-live="assertive"
        >
           <div className="max-w-md text-center px-8 py-12 bg-card rounded-[2rem] border border-destructive/20 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300">
            <div className="mb-8 inline-flex items-center justify-center p-6 rounded-3xl bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-12 h-12 text-destructive" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-headline font-black mb-4 tracking-tight text-destructive uppercase">
              Processing Error
            </h2>
            <p className="text-muted-foreground font-body text-base mb-10 leading-relaxed">
              {error}
            </p>
            <Button 
              onClick={reset}
              variant="destructive"
              className="rounded-2xl h-14 px-10 font-bold text-lg gap-3 shadow-xl shadow-destructive/20 active:scale-95 transition-all"
              aria-label="Return to Home and clear error"
            >
              <RefreshCcw className="w-5 h-5" />
              Reset Viewer
            </Button>
          </div>
        </div>
      )}

      {/* Initial Landing State */}
      {!file && !error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="max-w-2xl text-center px-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-10 inline-flex items-center justify-center p-8 rounded-[2.5rem] bg-primary/10 border border-primary/20 backdrop-blur-xl shadow-2xl">
              <Upload className="w-16 h-16 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-5xl font-headline font-black mb-6 tracking-tighter leading-none bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
              Elevate your 3D assets
            </h1>
            <p className="text-muted-foreground font-body text-xl mb-12 leading-relaxed max-w-lg mx-auto">
              Professional, browser-native model inspection with sub-millisecond geometry analysis.
            </p>
            
            <div className="relative pointer-events-auto flex flex-col items-center gap-6">
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
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-[1.5rem] text-lg font-black font-headline hover:bg-primary/90 transition-all cursor-pointer shadow-2xl shadow-primary/30 active:scale-95 hover:translate-y-[-2px]"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('file-upload')?.click() }}
              >
                Inspect New Model
              </label>
              
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground/40 font-code uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <ShieldCheck className="w-3 h-3 text-accent" />
                Zero-Knowledge Privacy Sandbox
              </div>
            </div>

            <p className="mt-16 text-[10px] font-code text-muted-foreground/30 uppercase tracking-[0.2em] leading-loose max-w-md mx-auto">
              Industrial grade support: {SUPPORTED_EXTENSIONS.slice(0, 10).join(', ')} ...
            </p>
          </div>
        </div>
      )}

      {/* Global Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
    </div>
  );
};

export default ModelViewer;
