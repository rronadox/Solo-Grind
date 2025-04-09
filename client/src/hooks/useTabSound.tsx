import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

/**
 * A specialized hook for tab navigation sounds
 * This is completely separate from the main useSound hook to avoid conflicts
 */
export function useTabSound() {
  // Direct reference to the sound instance
  const soundRef = useRef<Howl | null>(null);
  
  // Initialize the sound on component mount
  useEffect(() => {
    // Create a new Howl instance specifically for tab clicks
    soundRef.current = new Howl({
      src: ['/Solo Grind tabs.mp3'],
      preload: true,
      volume: 0.5
    });
    
    // Clean up on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);
  
  // Function to play the tab sound
  const playTabSound = () => {
    if (soundRef.current) {
      // Stop any currently playing instances first
      soundRef.current.stop();
      // Play the sound
      soundRef.current.play();
    }
  };

  return { playTabSound };
}