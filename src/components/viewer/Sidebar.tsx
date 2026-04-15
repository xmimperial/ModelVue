
"use client"

import React from 'react';
import { Box, Loader2, AlertCircle, Upload } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useViewerStore } from '@/store/use-viewer-store';
import ModelInfoPanel from './ModelInfoPanel';
import SceneControlsPanel from './SceneControlsPanel';

const Sidebar: React.FC = () => {
  const metadata = useViewerStore((state) => state.metadata);
  const isLoading = useViewerStore((state) => state.isLoading);
  const error = useViewerStore((state) => state.error);

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
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50">
                <TabsTrigger value="info" className="text-xs">Model Info</TabsTrigger>
                <TabsTrigger value="scene" className="text-xs">Viewport</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <ModelInfoPanel />
              </TabsContent>
              <TabsContent value="scene">
                <SceneControlsPanel />
              </TabsContent>
            </Tabs>
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
              {['FBX', 'GLTF', 'GLB', 'OBJ', 'STL', 'PLY'].map(fmt => (
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
