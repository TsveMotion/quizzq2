'use client';

import { useState } from "react";
import { BookOpen, MessageSquare } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function OverviewTab() {
  const [currentUser] = useState({ name: "Grace" });
  const [stats] = useState({
    performance: {
      lastSixMonths: [95.4, 92.1, 93.5, 94.2, 95.1, 95.4],
      metrics: {
        progress: 82,
        impact: 85,
        engagement: 88,
        teaching: 90,
        learning: 87,
        behavior: 93
      }
    },
    linkedTeachers: [
      { id: 1, name: "Mary Johnson", role: "Teacher", avatar: "/avatars/mary.jpg", online: true },
      { id: 2, name: "James Brown", role: "Assistant Teacher", avatar: "/avatars/james.jpg", online: true }
    ],
    upcomingEvents: [
      { 
        id: 1, 
        title: "Electronics lesson", 
        time: "9:30 AM", 
        date: "Today", 
        icon: BookOpen,
        color: "blue" 
      },
      { 
        id: 2, 
        title: "Robotics lesson", 
        time: "11:00 AM", 
        date: "Today",
        icon: BookOpen,
        color: "purple"
      }
    ]
  });

  return (
    <div className="h-full p-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold text-blue-50">
            Hello {currentUser.name}!
          </h1>
          <p className="text-sm text-blue-200">You have 5 new tasks for today! let's start!</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12 gap-6 mt-6 h-[calc(100%-4rem)]">
        {/* Performance Section */}
        <div className="col-span-8">
          <div className="bg-[#0a1d3b] rounded-lg p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-blue-50">Performance</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 font-medium">Standard</button>
                <button className="px-3 py-1 text-xs rounded-full text-blue-300 hover:bg-blue-500/10">My unit</button>
                <button className="px-3 py-1 text-xs rounded-full text-blue-300 hover:bg-blue-500/10">Standard</button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-50">95.4</span>
                <span className="text-sm text-blue-300">The best lessons</span>
              </div>
              <div className="h-48 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.performance.lastSixMonths.map((value, index) => ({
                    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index],
                    value
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e40af" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#60a5fa', fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[80, 100]} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#60a5fa', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#0f2850',
                        border: '1px solid #1e40af',
                        borderRadius: '0.5rem',
                        color: '#60a5fa'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#60a5fa" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(stats.performance.metrics).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center">
                  <div className="relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        className="text-blue-900/50"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="32"
                        cx="40"
                        cy="40"
                      />
                      <circle
                        className="text-blue-500"
                        strokeWidth="6"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="32"
                        cx="40"
                        cy="40"
                        strokeDasharray={`${value * 2} 200`}
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="text-base font-semibold text-blue-50">{value}%</span>
                    </div>
                  </div>
                  <span className="mt-2 text-xs text-blue-200 capitalize">{key} rate</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          {/* Calendar */}
          <div className="bg-[#0a1d3b] rounded-lg shadow-lg shadow-black/10 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-blue-50">Calendar</h2>
              <button className="text-xs text-blue-300 hover:text-blue-200">Today</button>
            </div>
            <div className="space-y-3">
              {stats.upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-blue-900/30">
                  <div className="p-1.5 rounded-lg bg-blue-500/20">
                    <event.icon className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-50">{event.title}</p>
                    <p className="text-xs text-blue-300">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Teachers */}
          <div className="bg-[#0a1d3b] rounded-lg shadow-lg shadow-black/10 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-blue-50">Linked Teachers</h2>
              <button className="text-xs text-blue-400 hover:text-blue-300">See all</button>
            </div>
            <div className="space-y-3">
              {stats.linkedTeachers.map(teacher => (
                <div key={teacher.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {teacher.online && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-[#0a1d3b]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-50">{teacher.name}</p>
                      <p className="text-xs text-blue-300">{teacher.role}</p>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-blue-800/50 rounded-full transition-colors">
                    <MessageSquare className="w-4 h-4 text-blue-300" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
