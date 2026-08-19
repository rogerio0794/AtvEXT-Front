interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  showLabel = false,
  className = ''
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  const colors = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-destructive',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${colors[color]} transition-all duration-300 rounded-full`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-muted-foreground mt-1">
          {value} / {max}
        </p>
      )}
    </div>
  );
}
