import React from 'react';

interface StatCardProps {
  number: string;
  label: string;
}

export function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-white mb-2">{number}</div>
      <div className="text-white/70">{label}</div>
    </div>
  );
}
