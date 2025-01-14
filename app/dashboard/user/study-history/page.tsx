'use client';

import { Card } from "@/components/ui/card";
import { History, Clock, TrendingUp } from "lucide-react";

export default function StudyHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Study History</h1>
        <p className="text-white/70">Track your learning journey and progress</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <History className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Past Sessions</h3>
              <p className="text-sm text-white/70 mt-1">Review your previous study sessions</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Study Time</h3>
              <p className="text-sm text-white/70 mt-1">Track your total study hours</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Progress Analytics</h3>
              <p className="text-sm text-white/70 mt-1">View detailed progress analytics</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
