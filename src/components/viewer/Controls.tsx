
"use client"

import React from 'react';
import { Maximize, RotateCcw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useViewerStore } from '@/store/use-viewer-store';

const Controls: React.FC = () => {
  const triggerFit = useViewerStore((state) => state.triggerFit);
  const triggerReset = useViewerStore((state) => state.triggerReset);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-3 bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={triggerFit}
              className="hover:bg-primary/20 hover:text-primary rounded-xl"
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
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="font-headline font-medium">Reset orientation</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border/50 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-accent rounded-xl"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs space-y-1 font-body text-xs p-3">
            <p><span className="font-bold text-accent">Rotate:</span> Left-Click + Drag</p>
            <p><span className="font-bold text-accent">Pan:</span> Right-Click + Drag</p>
            <p><span className="font-bold text-accent">Zoom:</span> Scroll Mouse</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Controls;
