import * as React from "react";
import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/useSound";
import { type ButtonProps } from "@/components/ui/button";

interface SoundButtonProps extends ButtonProps {
  soundType?: 'levelUp' | 'taskComplete' | 'taskFailed' | 'buttonClick' | 'modal';
  children?: React.ReactNode;
}

export function SoundButton({ soundType = 'modal', onClick, children, ...props }: SoundButtonProps) {
  const { playSound } = useSound();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Play the sound
    playSound(soundType);
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}