import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: 'red' | 'teal' | 'yellow' | 'none';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  accent = 'none',
  hover = false,
  onClick,
}) => {
  const accentStyles = {
    red: 'border-l-4 border-l-segro-red',
    teal: 'border-l-4 border-l-segro-teal-accent',
    yellow: 'border-l-4 border-l-yellow-500',
    none: '',
  };

  return (
    <div
      className={`
        bg-segro-offwhite rounded-2xl p-6 border border-segro-lightgray
        ${accentStyles[accent]}
        ${hover ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
