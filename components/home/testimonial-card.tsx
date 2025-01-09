import React from 'react';
import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <Card className="p-6 border-0 bg-white/5 backdrop-blur-lg">
      <p className="text-lg text-white/90 mb-4">{quote}</p>
      <div>
        <div className="font-semibold text-white">{author}</div>
        <div className="text-white/70">{role}</div>
      </div>
    </Card>
  );
}
