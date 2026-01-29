import React from 'react';
import { TaskStatus, CycleStatus } from '../types';

interface StatusPillProps {
  status: TaskStatus | CycleStatus | 'success' | 'warning' | 'error';
  label?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, label }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
      case 'current':
      case 'success':
        return 'bg-segro-teal-accent/10 text-segro-teal-accent border-segro-teal-accent/30';
      case 'in-progress':
        return 'bg-segro-teal/10 text-segro-teal border-segro-teal/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'attention':
      case 'stale':
      case 'error':
        return 'bg-segro-red/10 text-segro-red border-segro-red/30';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      default:
        return 'bg-segro-midgray/10 text-segro-midgray border-segro-midgray/30';
    }
  };

  const getStatusLabel = () => {
    if (label) return label;

    switch (status) {
      case 'in-progress':
        return 'In Progress';
      case 'attention':
        return 'Needs Attention';
      case 'current':
        return 'Current';
      case 'stale':
        return 'Stale';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles()}`}
    >
      {getStatusLabel()}
    </span>
  );
};
