
"use client"

import React from 'react';
import { Maximize, RotateCcw, HelpCircle, Box, MousePointer2, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { useViewerStore } from '@/store/use-viewer-store';

const Controls: React.FC = () => {
  const triggerFit = useViewerStore((state) => state.triggerFit);
  const triggerReset = useViewerStore((state) => state.triggerReset);

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-3 bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl" aria-label="Viewer Controls">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={triggerFit}
              className="hover:bg-primary/20 hover:text-primary rounded-xl"
              aria-label="Fit model to viewport"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="font-headline font-medium">Fit model to view</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={triggerReset}
              className="hover:bg-primary/20 hover:text-primary rounded-xl"
              aria-label="Reset camera orientation"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="font-headline font-medium">Reset orientation</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border/50 mx-1" role="separator" aria-hidden="true" />

        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-accent rounded-xl"
                  aria-label="Interaction shortcuts help"
                >
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="font-headline font-medium">Interaction Guide</TooltipContent>
          </Tooltip>
          <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-2xl border-border/40 rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl font-headline font-black tracking-tight">
                <HelpCircle className="w-6 h-6 text-primary" />
                Navigation Guide
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-body">
                Master the ModelVue 3D viewport with these simple gestures.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/20 transition-all hover:bg-muted/50">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <MousePointer2 className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold font-headline uppercase tracking-wider">Rotate View</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Hold <span className="text-primary font-bold">Left-Click</span> and drag to rotate the camera around the model.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/20 transition-all hover:bg-muted/50">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <Move className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold font-headline uppercase tracking-wider">Pan Camera</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Hold <span className="text-accent font-bold">Right-Click</span> and drag to slide the viewport horizontally or vertically.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/20 transition-all hover:bg-muted/50">
                <div className="p-3 bg-secondary rounded-xl">
                  <Box className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold font-headline uppercase tracking-wider">Zoom Control</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Use your <span className="font-bold">Mouse Wheel</span> or pinch gestures to zoom in and out of fine geometry.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </nav>
  );
};

export default Controls;
