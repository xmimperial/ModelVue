
"use client"

import React from 'react';
import { FileText, Boxes, Info, Move3d, Layers, CloudUpload, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useViewerStore } from '@/store/use-viewer-store';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const ModelInfoPanel: React.FC = () => {
  const metadata = useViewerStore((state) => state.metadata);
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
        fileSize: parseFloat(metadata.size), // Simplified for prototype
        fileUrl: "https://example.com/mock-storage/model.glb", // Mock URL
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

  if (!metadata) return null;

  return (
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
          <Layers className="w-3 h-3" /> Polygons
        </label>
        <p className="text-sm font-code">{metadata.polygons}</p>
      </div>

      {user && (
        <>
          <Separator className="bg-border/30" />
          <Button 
            variant="outline" 
            className="w-full gap-2 border-primary/20 hover:bg-primary/10 text-xs h-9"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
            Save to Profile
          </Button>
        </>
      )}
    </div>
  );
};

export default ModelInfoPanel;
