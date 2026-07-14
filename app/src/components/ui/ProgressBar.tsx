interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'primary' | 'success' | 'warning';
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  variant = 'primary',
  className = ''
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variants = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progreso</span>
          <span className="font-medium text-gray-800">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div 
          className={`${variants[variant]} ${sizes[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
