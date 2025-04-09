interface CalcDisplayProps {
  value: string;
  hasError: boolean;
}

export function CalcDisplay({ value, hasError }: CalcDisplayProps) {
  return (
    <div className="w-full p-6 bg-display text-right transition-colors">
      <div className="text-xs text-error h-4 mb-1">
        {hasError && <span>Error</span>}
      </div>
      <div className="text-4xl font-bold tracking-tight text-white overflow-hidden text-ellipsis">
        {value}
      </div>
    </div>
  );
}
