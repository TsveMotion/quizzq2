import React from 'react';

interface ExampleFeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function ExampleFeature({ title, description, icon }: ExampleFeatureProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </div>
  );
}
