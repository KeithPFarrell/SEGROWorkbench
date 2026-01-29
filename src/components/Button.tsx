import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  icon,
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-segro-red text-white hover:bg-segro-red-dark disabled:bg-segro-midgray/30',
    secondary: 'bg-segro-teal text-white hover:bg-segro-teal-accent disabled:bg-segro-midgray/30',
    outline: 'bg-transparent border-2 border-segro-red text-segro-red hover:bg-segro-red hover:text-white disabled:border-segro-midgray/30 disabled:text-segro-midgray/30',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-segro-midgray/30',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};
