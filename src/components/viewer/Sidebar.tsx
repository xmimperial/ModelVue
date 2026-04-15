"use client"

import React from 'react';
import { Box, Loader2, AlertCircle, Upload, RefreshCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useViewerStore } from '@/store/use-viewer-store';
import ModelInfoPanel from './ModelInfoPanel';
import SceneControlsPanel from './SceneControlsPanel';

const Sidebar: React.FC = () => {
  const metadata = useViewerStore((state) => state.metadata);
  const isLoading = useViewerStore((state) => state.isLoading);
  const error = useViewerStore((state) => state.error);
  const reset = useViewerStore((state) => state.reset);

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
              <p className="text-sm text-muted-foreground animate-pulse font-medium">Analyzing geometry...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-6 text-center space-y-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <p className="font-bold text-sm text-destructive uppercase tracking-wider">Processing Error</p>
                <p className="text-xs text-muted-foreground mt-2 px-2 leading-relaxed">{error}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={reset}
                className="gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive text-xs"
              >
                <RefreshCcw className="w-3 h-3" />
                Clear and Retry
              </Button>
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
              <p className="text-xs text-muted-foreground leading-relaxed px-4">
                Drop your 3D assets here to inspect geometry and metadata.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {!metadata && !isLoading && !error && (
        <Card className="bg-card/40 border-none shadow-none">
          <CardContent className="pt-6">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-3 tracking-widest">Available Formats</p>
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
