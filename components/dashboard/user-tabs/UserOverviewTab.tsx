'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Book, TrendingUp, Clock, Trophy, Brain, Target, LineChart, Lock, Loader2 } from "lucide-react";

interface OverviewData {
  stats: {
    totalQuizzes: number;
    successRate: number;
    timeSpent: number;
    totalScore: number;
  };
  recentActivity: {
    id: string;
    quizTitle: string;
    score: number | null;
    status: string;
    time: string;
  }[];
}

export function UserOverviewTab() {
  const { data: session } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch('/api/user/overview');
        if (!response.ok) throw new Error('Failed to fetch overview');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const stats = data ? [
    {
      title: "Quizzes Taken",
      value: data.stats.totalQuizzes.toString(),
      icon: Book,
      color: "text-blue-500"
    },
    {
      title: "Success Rate",
      value: `${data.stats.successRate}%`,
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Time Spent",
      value: `${data.stats.timeSpent}h`,
      icon: Clock,
      color: "text-orange-500"
    },
    {
      title: "Total Score",
      value: data.stats.totalScore.toString(),
      icon: Trophy,
      color: "text-purple-500"
    }
  ] : [];

  const premiumFeatures = [
    {
      title: "AI Tutor",
      description: "Get personalized help from our AI tutor",
      icon: Brain,
      color: "text-blue-500"
    },
    {
      title: "Learning Goals",
      description: "Set and track your learning goals",
      icon: Target,
      color: "text-green-500"
    },
    {
      title: "Advanced Analytics",
      description: "Detailed insights into your performance",
      icon: LineChart,
      color: "text-purple-500"
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            Welcome back, {user?.name || user?.email}!
          </h1>
          <p className="text-sm text-gray-400">Here's an overview of your learning progress</p>
        </div>
        {!user?.isPro && (
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9 px-4"
          >
            Upgrade to Premium
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 bg-gray-900/40 border-white/10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <h3 className="text-2xl font-semibold text-white">{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="flex-1 bg-gray-900/40 border-white/10 mb-4">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="p-4">
          {data?.recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {data?.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-blue-500">
                      <Book className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{activity.quizTitle}</h3>
                      <p className="text-xs text-gray-400">
                        {activity.status}
                        {activity.score !== null && ` with ${activity.score}%`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.time).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Premium Features */}
      {!user?.isPro && (
        <Card className="bg-gray-900/40 border-white/10">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Premium Features</h2>
          </div>
          <div className="p-4 grid grid-cols-3 gap-4">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="relative">
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <Card className="p-4 bg-white/5 border-white/10">
                  <div className={`p-2 rounded-lg bg-white/5 ${feature.color} w-fit mb-2`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
