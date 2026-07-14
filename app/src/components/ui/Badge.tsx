import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'primary', size = 'sm', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';
    
    const variants = {
      primary: 'bg-primary-100 text-primary-700',
      success: 'bg-success-100 text-success-700',
      warning: 'bg-warning-100 text-warning-700',
      danger: 'bg-danger-100 text-danger-700',
      gray: 'bg-gray-100 text-gray-700'
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm'
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
