import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalcButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: "normal" | "operation" | "equals";
}

export function CalcButton({ 
  children, 
  type = "normal", 
  className,
  ...props 
}: CalcButtonProps) {
  const baseClasses = "aspect-square bg-buttonbg hover:bg-buttonhover text-xl font-medium rounded-lg transition-colors flex items-center justify-center";
  
  const typeClasses = {
    normal: "text-gray-800",
    operation: "bg-secondary hover:bg-amber-500 text-white",
    equals: "bg-primary hover:bg-blue-600 text-white"
  };
  
  return (
    <button
      className={cn(baseClasses, typeClasses[type], className)}
      {...props}
    >
      {children}
    </button>
  );
}
