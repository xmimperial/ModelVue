"use client"

import React from 'react';
import { Box, FileText, Info, Move3d, Layers, CloudUpload, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useViewerStore } from '@/store/use-viewer-store';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const MetadataSidebar: React.FC = () => {
  const metadata = useViewerStore((state) => state.metadata);
  const isLoading = useViewerStore((state) => state.isLoading);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    if (!user || !metadata || !db) return;
    
    setIsSaving(true);
    try {
      const modelId = crypto.randomUUID();
      const shareId = Math.random().toString(36).substring(2, 9);
      
      const modelData = {
        id: modelId,
        title: metadata.name,
        originalFileName: metadata.name,
        fileFormat: metadata.format.toLowerCase(),
        fileSize: parseFloat(metadata.size),
        fileUrl: "https://example.com/mock-storage/model.glb",
        uploadDate: new Date().toISOString(),
        shareId: shareId,
        isPublic: false,
        uploaderId: user.uid
      };

      await setDoc(doc(db, 'users', user.uid, 'models', modelId), modelData);
      
      toast({
        title: "Model Saved",
        description: "Your model metadata has been synced to your profile.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!metadata && !isLoading) return null;

  return (
    <aside className="fixed top-6 left-6 w-80 z-40 animate-in fade-in slide-in-from-left duration-500 ease-out" aria-label="Metadata Panel">
      <Card className="bg-card/60 backdrop-blur-xl border-border/40 shadow-2xl overflow-hidden">
        <CardHeader className="pb-3 flex flex-row items-center gap-3 bg-primary/5 border-b border-border/20">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Box className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-headline font-bold tracking-tight">Geometry Info</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
              <p className="text-sm font-medium text-muted-foreground animate-pulse">Analyzing Assets...</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60 flex items-center gap-2">
                   <FileText className="w-3 h-3" /> Resource Identifier
                </label>
                <p className="text-sm font-code truncate bg-muted/30 p-2 rounded-md border border-border/30" title={metadata?.name}>
                  {metadata?.name}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60 flex items-center gap-2">
                    <Info className="w-3 h-3" /> Format
                  </label>
                  <p className="text-sm font-code text-accent font-bold">{metadata?.format}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60 flex items-center gap-2">
                    <Layers className="w-3 h-3" /> Data Size
                  </label>
                  <p className="text-sm font-code">{metadata?.size}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60 flex items-center gap-2">
                  <Move3d className="w-3 h-3" /> Bounding Dimensions
                </label>
                <p className="text-sm font-code text-muted-foreground">{metadata?.dimensions}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60 flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Complex Count
                </label>
                <div className="flex items-baseline gap-1">
                  <p className="text-lg font-code font-bold text-foreground">{metadata?.polygons}</p>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">Tris</span>
                </div>
              </div>

              {user && (
                <div className="pt-2">
                  <Separator className="mb-6 bg-border/40" />
                  <Button 
                    className="w-full gap-2 rounded-xl h-11 shadow-lg shadow-primary/20 font-bold"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
                    Sync to Cloud
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
};

export default MetadataSidebar;
