
"use client"

import React, { useState, useCallback } from 'react';
import { Upload, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropOverlayProps {
  onFileDrop: (file: File) => void;
}

const DropOverlay: React.FC<DropOverlayProps> = ({ onFileDrop }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileDrop(files[0]);
    }
  }, [onFileDrop]);

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "fixed inset-0 z-50 transition-all duration-300 pointer-events-auto",
        isDragging 
          ? "bg-primary/20 backdrop-blur-sm border-4 border-dashed border-primary" 
          : "bg-transparent pointer-events-none"
      )}
    >
      {isDragging && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary animate-in fade-in zoom-in duration-300">
          <Upload className="w-16 h-16 mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold font-headline mb-2">Release to Load Model</h2>
          <p className="text-lg text-primary/80">ModelVue will process your 3D assets immediately</p>
        </div>
      )}
    </div>
  );
};

export default DropOverlay;
