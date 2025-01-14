'use client';

import { Card } from "@/components/ui/card";
import { Bot, Book, Target } from "lucide-react";

export default function AITutorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">AI Tutor</h1>
        <p className="text-white/70">Practice and learn with AI assistance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Bot className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Practice Questions</h3>
              <p className="text-sm text-white/70 mt-1">Get AI-generated practice questions tailored to your level</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Book className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Concept Explanations</h3>
              <p className="text-sm text-white/70 mt-1">Get detailed explanations of complex topics</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Target className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Personalized Learning</h3>
              <p className="text-sm text-white/70 mt-1">Adaptive learning path based on your progress</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
