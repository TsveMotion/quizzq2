'use client';

import { Card } from "@/components/ui/card";
import { Target, Flag, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GoalsPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Learning Goals</h1>
        <p className="text-white/70 mt-1">Set and track your learning objectives</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
          <Card className="w-full p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                <Target className="h-6 w-6 text-rose-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Current Goals</h3>
                <p className="text-sm text-white/70 mt-1">View and manage your active learning goals</p>
              </div>
            </div>
          </Card>
        </Button>

        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
          <Card className="w-full p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <Flag className="h-6 w-6 text-amber-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Milestones</h3>
                <p className="text-sm text-white/70 mt-1">Track your progress milestones</p>
              </div>
            </div>
          </Card>
        </Button>

        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
          <Card className="w-full p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                <Trophy className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Achievements</h3>
                <p className="text-sm text-white/70 mt-1">View your completed goals and achievements</p>
              </div>
            </div>
          </Card>
        </Button>
      </div>
    </div>
  );
}
