import { Coins } from 'lucide-react';

interface CoinDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function CoinDisplay({ amount, size = 'md', showLabel = false }: CoinDisplayProps) {
  const sizes = {
    sm: {
      icon: 16,
      text: 'text-sm',
    },
    md: {
      icon: 20,
      text: 'text-base',
    },
    lg: {
      icon: 24,
      text: 'text-xl',
    },
  };

  return (
    <div className="flex items-center gap-2">
      <Coins size={sizes[size].icon} className="text-warning" />
      <span className={`${sizes[size].text} text-warning font-medium`}>
        {amount.toLocaleString()}
      </span>
      {showLabel && <span className="text-sm text-muted-foreground">moedas</span>}
    </div>
  );
}
