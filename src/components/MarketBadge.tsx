import React from 'react';
import { Market } from '../types';

interface MarketBadgeProps {
  market: Market;
  size?: 'sm' | 'md';
}

const marketColors: Record<Market, string> = {
  UK: 'bg-green-500',
  CZ: 'bg-blue-500',
  DE: 'bg-yellow-500',
  ES: 'bg-red-500',
  FR: 'bg-purple-500',
  IT: 'bg-pink-500',
  NL: 'bg-orange-500',
  PL: 'bg-indigo-500',
};

export const MarketBadge: React.FC<MarketBadgeProps> = ({ market, size = 'md' }) => {
  const sizeStyles = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';

  return (
    <div
      className={`${marketColors[market]} ${sizeStyles} rounded-full flex items-center justify-center text-white font-bold`}
      title={market}
    >
      {market}
    </div>
  );
};
