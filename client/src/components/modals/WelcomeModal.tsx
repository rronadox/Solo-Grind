import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/useSound";
import { User } from "@shared/schema";

interface WelcomeModalProps {
  user: User;
  isNewUser: boolean;
  onClose: () => void;
}

export function WelcomeModal({ user, isNewUser, onClose }: WelcomeModalProps) {
  const [open, setOpen] = useState(true);
  const { playSound } = useSound();
  const displayName = user.displayName || user.username;

  // Play the modal sound when the component mounts
  useEffect(() => {
    try {
      playSound('modal');
    } catch (error) {
      console.error("Error playing welcome sound:", error);
      // Continue even if sound fails
    }
  }, [playSound]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isNewUser ? 'Welcome, my Liege' : 'Welcome back, my Liege'}
          </DialogTitle>
          <DialogDescription className="text-lg pt-2">
            {isNewUser 
              ? `${displayName}, your journey towards self-improvement begins now. Your quests await!` 
              : `${displayName}, it's good to see you again. Your quests await your attention.`
            }
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-4xl">👑</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            Begin Your Quest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}