import React from 'react';
import { Market } from '../types';

interface MarketBadgeProps {
  market: Market;
  size?: 'sm' | 'md';
}

export const MarketBadge: React.FC<MarketBadgeProps> = ({ market, size = 'md' }) => {
  const sizeStyles = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';

  return (
    <div
      className={`bg-segro-teal ${sizeStyles} rounded-full flex items-center justify-center text-white font-bold`}
      title={market}
    >
      {market}
    </div>
  );
};
