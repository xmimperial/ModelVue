"use client"

import React from 'react';
import { Settings, Grid, Navigation, Activity, Eye, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useViewerStore } from '@/store/use-viewer-store';

const ControlsSidebar: React.FC = () => {
  const file = useViewerStore((state) => state.file);
  const showGrid = useViewerStore((state) => state.showGrid);
  const showAxes = useViewerStore((state) => state.showAxes);
  const wireframe = useViewerStore((state) => state.wireframe);
  
  const toggleGrid = useViewerStore((state) => state.toggleGrid);
  const toggleAxes = useViewerStore((state) => state.toggleAxes);
  const toggleWireframe = useViewerStore((state) => state.toggleWireframe);

  if (!file) return null;

  return (
    <aside className="fixed top-6 right-6 w-80 z-40 animate-in fade-in slide-in-from-right duration-500 ease-out" aria-label="Controls Panel">
      <Card className="bg-card/60 backdrop-blur-xl border-border/40 shadow-2xl">
        <CardHeader className="pb-3 flex flex-row items-center gap-3 bg-accent/5 border-b border-border/20">
          <div className="p-2 bg-accent/10 rounded-xl">
            <Settings className="w-5 h-5 text-accent" />
          </div>
          <CardTitle className="text-lg font-headline font-bold tracking-tight">Scene Config</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Grid className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="space-y-0.5">
                  <Label htmlFor="grid-toggle" className="text-sm font-medium cursor-pointer">Ground Plane</Label>
                  <p className="text-[10px] text-muted-foreground font-medium">Toggle reference grid</p>
                </div>
              </div>
              <Switch id="grid-toggle" checked={showGrid} onCheckedChange={toggleGrid} />
            </div>

            <Separator className="bg-border/20" />

            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Navigation className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="space-y-0.5">
                  <Label htmlFor="axes-toggle" className="text-sm font-medium cursor-pointer">World Gizmo</Label>
                  <p className="text-[10px] text-muted-foreground font-medium">Show X, Y, Z axes</p>
                </div>
              </div>
              <Switch id="axes-toggle" checked={showAxes} onCheckedChange={toggleAxes} />
            </div>

            <Separator className="bg-border/20" />

            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="space-y-0.5">
                  <Label htmlFor="wire-toggle" className="text-sm font-medium cursor-pointer">Wireframe Mode</Label>
                  <p className="text-[10px] text-muted-foreground font-medium">View polygon structure</p>
                </div>
              </div>
              <Switch id="wire-toggle" checked={wireframe} onCheckedChange={toggleWireframe} />
            </div>
          </div>

          <div className="p-4 bg-muted/40 rounded-2xl border border-border/40 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent/80">Active Optimizations</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>Frustum Culling Enabled</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Activity className="w-3 h-3" />
              <span>High-Performance GPU Profile</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default ControlsSidebar;
