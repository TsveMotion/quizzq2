'use client';

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, Target, History } from "lucide-react";

export function UserOverview() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-white/70">
          Here's an overview of your learning progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-[#1a1b1e]/50 border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-white/70">Questions Attempted</p>
              <h3 className="text-2xl font-bold text-white">0</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1b1e]/50 border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Target className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-white/70">Accuracy Rate</p>
              <h3 className="text-2xl font-bold text-white">0%</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1b1e]/50 border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-white/70">AI Tutor Sessions</p>
              <h3 className="text-2xl font-bold text-white">0</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1b1e]/50 border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <History className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-white/70">Study Time</p>
              <h3 className="text-2xl font-bold text-white">0h</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-[#1a1b1e]/50 border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-white/50">
            No recent activity
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1b1e]/50 border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Learning Goals</h2>
          <div className="text-center py-8 text-white/50">
            No goals set
          </div>
        </Card>
      </div>
    </div>
  );
}
