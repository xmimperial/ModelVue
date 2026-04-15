
"use client"

import React from 'react';
import { Grid, Navigation, Activity } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useViewerStore } from '@/store/use-viewer-store';

const SceneControlsPanel: React.FC = () => {
  const showGrid = useViewerStore((state) => state.showGrid);
  const showAxes = useViewerStore((state) => state.showAxes);
  const wireframe = useViewerStore((state) => state.wireframe);
  
  const toggleGrid = useViewerStore((state) => state.toggleGrid);
  const toggleAxes = useViewerStore((state) => state.toggleAxes);
  const toggleWireframe = useViewerStore((state) => state.toggleWireframe);

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
      <label className="text-[10px] uppercase font-bold text-primary/70">Scene Settings</label>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid className="w-3.5 h-3.5 text-muted-foreground" />
          <Label htmlFor="grid-toggle" className="text-xs">Ground Grid</Label>
        </div>
        <Switch id="grid-toggle" checked={showGrid} onCheckedChange={toggleGrid} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
          <Label htmlFor="axes-toggle" className="text-xs">World Axes</Label>
        </div>
        <Switch id="axes-toggle" checked={showAxes} onCheckedChange={toggleAxes} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-muted-foreground" />
          <Label htmlFor="wire-toggle" className="text-xs">Wireframe</Label>
        </div>
        <Switch id="wire-toggle" checked={wireframe} onCheckedChange={toggleWireframe} />
      </div>
    </div>
  );
};

export default SceneControlsPanel;
