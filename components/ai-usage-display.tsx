import React from 'react';
import { Progress } from '@/components/ui/progress';

type Limit = {
  value: number;
  label: string;
};

interface AIUsageDisplayProps {
  used: number;
  plan: 'free' | 'pro' | 'forever';
}

const limits: Record<string, Limit> = {
  free: { value: 10, label: 'daily' },
  pro: { value: 1000, label: 'monthly' },
  forever: { value: Infinity, label: 'unlimited' }
};

export const AIUsageDisplay: React.FC<AIUsageDisplayProps> = ({ used, plan }) => {
  const limit = limits[plan];
  const percentage = limit.value === Infinity ? 0 : (used / limit.value) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">
          {used} / {limit.value === Infinity ? '∞' : limit.value} {limit.label} credits used
        </span>
        <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
      </div>
      <Progress
        value={percentage}
        className={percentage >= 90 ? 'bg-red-200' : 'bg-gray-200'}
      />
    </div>
  );
};
