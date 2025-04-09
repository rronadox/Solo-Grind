import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

type SoundType = 'levelUp' | 'taskComplete' | 'taskFailed' | 'buttonClick' | 'modal';

export function useSound() {
  // Create refs for each sound type to prevent recreating them on each render
  const levelUpSoundRef = useRef<Howl | null>(null);
  const taskCompleteSoundRef = useRef<Howl | null>(null);
  const taskFailedSoundRef = useRef<Howl | null>(null);
  const buttonClickSoundRef = useRef<Howl | null>(null);
  const modalSoundRef = useRef<Howl | null>(null);
  
  // Initialize sounds on component mount
  useEffect(() => {
    try {
      // Level Up Sound - for leveling up and achievements
      levelUpSoundRef.current = new Howl({
        src: ['/sounds/Solo Grind levelup.mp3'],
        preload: true,
        volume: 0.7
      });
      
      // Task Complete Sound - for completing tasks
      taskCompleteSoundRef.current = new Howl({
        src: ['/sounds/Solo Grind modal.mp3'], // Using modal sound for now
        preload: true,
        volume: 0.5
      });
      
      // Task Failed Sound - for failing tasks
      taskFailedSoundRef.current = new Howl({
        src: ['/sounds/Solo Grind modal.mp3'], // Using modal sound for now
        preload: true,
        volume: 0.5
      });
      
      // Button Click Sound - for regular button clicks
      buttonClickSoundRef.current = new Howl({
        src: ['/sounds/Solo Grind modal.mp3'], // Using modal sound for button clicks as requested
        preload: true,
        volume: 0.4
      });
      
      // Modal Sound - for opening/closing modals and other UI elements
      modalSoundRef.current = new Howl({
        src: ['/sounds/Solo Grind modal.mp3'],
        preload: true,
        volume: 0.5
      });
    } catch (error) {
      console.error("Error initializing sounds:", error);
    }
    
    // Clean up on unmount
    return () => {
      if (levelUpSoundRef.current) levelUpSoundRef.current.unload();
      if (taskCompleteSoundRef.current) taskCompleteSoundRef.current.unload();
      if (taskFailedSoundRef.current) taskFailedSoundRef.current.unload();
      if (buttonClickSoundRef.current) buttonClickSoundRef.current.unload();
      if (modalSoundRef.current) modalSoundRef.current.unload();
    };
  }, []);
  
  // Function to play a sound based on type
  const playSound = useCallback((type: SoundType) => {
    try {
      let sound: Howl | null = null;
      
      // Get the appropriate sound based on type
      switch (type) {
        case 'levelUp':
          sound = levelUpSoundRef.current;
          break;
        case 'taskComplete':
          sound = taskCompleteSoundRef.current;
          break;
        case 'taskFailed':
          sound = taskFailedSoundRef.current;
          break;
        case 'buttonClick':
          sound = buttonClickSoundRef.current;
          break;
        case 'modal':
          sound = modalSoundRef.current;
          break;
        default:
          sound = buttonClickSoundRef.current;
      }
      
      // Play the sound if it exists
      if (sound) {
        // Stop any currently playing instances first to prevent overlaps
        sound.stop();
        sound.play();
      }
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error);
      // Continue execution even if sound fails
    }
  }, []);

  return { playSound };
}