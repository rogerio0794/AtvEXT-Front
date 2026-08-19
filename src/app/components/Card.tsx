interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-border rounded-xl p-6 ${
        hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
