import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTabSound } from '@/hooks/useTabSound';

interface TabLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export function TabLink({ href, children, isActive = false }: TabLinkProps) {
  const { playTabSound } = useTabSound();
  const [location] = useLocation();
  
  const handleClick = () => {
    // Only play the sound when switching to a different tab
    if (location !== href) {
      playTabSound();
    }
  };
  
  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Link href={href}>
        {children}
      </Link>
    </div>
  );
}