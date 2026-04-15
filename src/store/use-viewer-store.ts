
'use client';

import { create } from 'zustand';

export interface ModelMetadata {
  name: string;
  size: string;
  dimensions: string;
  polygons: string;
  format: string;
}

interface ViewerState {
  // Core State
  file: File | null;
  metadata: ModelMetadata | null;
  isLoading: boolean;
  error: string | null;
  
  // Interaction Triggers
  fitTrigger: number;
  resetTrigger: number;
  
  // Scene Settings
  showGrid: boolean;
  showAxes: boolean;
  wireframe: boolean;
  
  // Actions
  setFile: (file: File | null) => void;
  setMetadata: (metadata: ModelMetadata | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  triggerFit: () => void;
  triggerReset: () => void;
  
  // Settings Actions
  toggleGrid: () => void;
  toggleAxes: () => void;
  toggleWireframe: () => void;
}

/**
 * Scalable State Management for ModelVue
 * Centralizes model data and viewer preferences while minimizing re-renders via selective selection.
 */
export const useViewerStore = create<ViewerState>((set) => ({
  file: null,
  metadata: null,
  isLoading: false,
  error: null,
  fitTrigger: 0,
  resetTrigger: 0,
  showGrid: true,
  showAxes: true,
  wireframe: false,

  setFile: (file) => set({ 
    file, 
    error: null, 
    metadata: null, 
    isLoading: !!file 
  }),
  setMetadata: (metadata) => set({ metadata, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  triggerFit: () => set((state) => ({ fitTrigger: state.fitTrigger + 1 })),
  triggerReset: () => set((state) => ({ resetTrigger: state.resetTrigger + 1 })),
  
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleAxes: () => set((state) => ({ showAxes: !state.showAxes })),
  toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),
}));
