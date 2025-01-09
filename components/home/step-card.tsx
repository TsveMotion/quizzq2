import React from 'react';
import { Card } from "@/components/ui/card";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <Card className="p-6 border-0 bg-white/5 backdrop-blur-lg">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4 text-white font-semibold">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/70">{description}</p>
    </Card>
  );
}
