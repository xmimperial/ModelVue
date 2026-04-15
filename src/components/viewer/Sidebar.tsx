
"use client"

import React from 'react';
import { Info, Loader2, FileText, Move3d, Layers, Boxes, AlertCircle, Box, Upload, Grid, Navigation, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useViewerStore } from '@/store/use-viewer-store';

const Sidebar: React.FC = () => {
  const metadata = useViewerStore((state) => state.metadata);
  const isLoading = useViewerStore((state) => state.isLoading);
  const error = useViewerStore((state) => state.error);
  
  const showGrid = useViewerStore((state) => state.showGrid);
  const showAxes = useViewerStore((state) => state.showAxes);
  const wireframe = useViewerStore((state) => state.wireframe);
  
  const toggleGrid = useViewerStore((state) => state.toggleGrid);
  const toggleAxes = useViewerStore((state) => state.toggleAxes);
  const toggleWireframe = useViewerStore((state) => state.toggleWireframe);

  return (
    <div className="fixed top-6 left-6 w-80 z-40 space-y-4">
      <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-2xl">
        <CardHeader className="pb-3 flex flex-row items-center gap-2">
          <Box className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-headline font-bold">ModelVue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center py-8 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground animate-pulse">Parsing geometry...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-6 text-center space-y-3 text-destructive">
              <AlertCircle className="w-10 h-10" />
              <div>
                <p className="font-semibold text-sm">Loading Error</p>
                <p className="text-xs opacity-80 mt-1">{error}</p>
              </div>
            </div>
          ) : metadata ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-primary/70 flex items-center gap-1">
                   <FileText className="w-3 h-3" /> File Name
                </label>
                <p className="text-sm font-code truncate" title={metadata.name}>{metadata.name}</p>
              </div>
              
              <Separator className="bg-border/30" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-primary/70 flex items-center gap-1">
                    <Boxes className="w-3 h-3" /> Format
                  </label>
                  <p className="text-sm font-code text-accent">{metadata.format}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-primary/70 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Size
                  </label>
                  <p className="text-sm font-code">{metadata.size}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-primary/70 flex items-center gap-1">
                  <Move3d className="w-3 h-3" /> Dimensions
                </label>
                <p className="text-sm font-code">{metadata.dimensions}</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-primary/70 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Polygon Count
                </label>
                <p className="text-sm font-code">{metadata.polygons}</p>
              </div>

              <Separator className="bg-border/30" />
              
              <div className="space-y-3">
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
                    <Label htmlFor="wire-toggle" className="text-xs">Wireframe Mode</Label>
                  </div>
                  <Switch id="wire-toggle" checked={wireframe} onCheckedChange={toggleWireframe} />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="text-primary w-6 h-6" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Drag and drop 3D models here to begin analysis.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {!metadata && !isLoading && !error && (
        <Card className="bg-card/40 border-none shadow-none">
          <CardContent className="pt-6">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-3">Supported Formats</p>
            <div className="flex flex-wrap gap-1.5">
              {['3DM', '3DS', '3MF', 'FBX', 'GLTF', 'GLB', 'OBJ', 'STL', 'PLY', 'STEP'].map(fmt => (
                <span key={fmt} className="px-2 py-0.5 rounded bg-secondary/50 text-[9px] font-code text-muted-foreground border border-border/30">
                  .{fmt.toLowerCase()}
                </span>
              ))}
              <span className="text-[9px] text-muted-foreground/60 italic self-center ml-1">+ more</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Sidebar;
