import React from 'react';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = () => {
    if (value >= 90) return '#00AAA5'; // segro-teal-accent
    if (value >= 75) return '#73AFB6'; // segro-teal
    if (value >= 60) return '#EAB308'; // yellow
    return '#C8191F'; // segro-red
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EAEAEA"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-segro-charcoal">{value}</span>
        <span className="text-sm text-segro-midgray">%</span>
      </div>
      {label && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-segro-charcoal whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
};
