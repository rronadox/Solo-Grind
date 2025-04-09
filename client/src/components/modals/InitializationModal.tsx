import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface InitializationModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function InitializationModal({ isOpen, onComplete }: InitializationModalProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isOpen) {
      // Reset progress when modal opens
      setProgress(0);
      
      // Create a progressive loading effect
      const interval = setInterval(() => {
        setProgress(prev => {
          // Slow down progress as it gets closer to 100%
          const increment = Math.max(1, 10 - Math.floor(prev / 10));
          const newProgress = prev + increment;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            // Add a small delay after reaching 100% before calling onComplete
            timeoutId = setTimeout(() => {
              onComplete();
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 180); // Adjust interval speed for a nice animation
      
      return () => {
        clearInterval(interval);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [isOpen, onComplete]);
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showClose={false}>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="text-center">
              <h3 className="text-xl font-bold tracking-tight mb-2">Loading your dashboard</h3>
              <p className="text-muted-foreground mb-4">Please wait while we initialize your experience</p>
            </div>
            
            <div className="w-full max-w-sm">
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="text-sm mt-2 text-muted-foreground">
              {progress < 30 && "Loading your quests..."}
              {progress >= 30 && progress < 60 && "Syncing your achievements..."}
              {progress >= 60 && progress < 90 && "Preparing dashboard..."}
              {progress >= 90 && "Almost there..."}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}