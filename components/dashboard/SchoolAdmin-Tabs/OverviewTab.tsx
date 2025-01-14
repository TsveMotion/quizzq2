'use client';

import { Card } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";

export function OverviewTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-50">Hello Principal!</h2>
        <p className="text-blue-200">Here's what's happening at your school today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-200">Total Students</p>
              <h3 className="text-2xl font-bold text-blue-50">1,234</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <GraduationCap className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-200">Total Teachers</p>
              <h3 className="text-2xl font-bold text-blue-50">89</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-200">Active Courses</p>
              <h3 className="text-2xl font-bold text-blue-50">156</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-blue-800/20 border-blue-800/40">
          <h3 className="text-lg font-semibold text-blue-50 mb-4">School Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Average Attendance</span>
              <span className="text-blue-50 font-medium">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Academic Progress</span>
              <span className="text-blue-50 font-medium">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Student Satisfaction</span>
              <span className="text-blue-50 font-medium">92%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-800/20 border-blue-800/40">
          <h3 className="text-lg font-semibold text-blue-50 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-blue-50">Parent-Teacher Meeting</p>
                <p className="text-sm text-blue-200">Tomorrow, 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-blue-50">Annual Sports Day</p>
                <p className="text-sm text-blue-200">Next Week, Monday</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-blue-50">Academic Review</p>
                <p className="text-sm text-blue-200">Next Week, Friday</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
