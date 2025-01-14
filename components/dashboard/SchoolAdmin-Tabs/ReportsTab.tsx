'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Users,
  GraduationCap,
  BookOpen,
  Award
} from "lucide-react";

export function ReportsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-50">Academic Reports</h2>
          <p className="text-blue-200">View and analyze school performance metrics</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-200">Attendance Rate</p>
              <p className="text-xl font-bold text-blue-50">94%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded">
              <GraduationCap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-200">Pass Rate</p>
              <p className="text-xl font-bold text-blue-50">87%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-200">Course Completion</p>
              <p className="text-xl font-bold text-blue-50">92%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded">
              <Award className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-200">Student Satisfaction</p>
              <p className="text-xl font-bold text-blue-50">90%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-blue-50">Grade Distribution</h3>
            <BarChart3 className="h-5 w-5 text-blue-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-200">A Grade (90-100%)</span>
              <div className="flex items-center">
                <div className="w-48 h-2 bg-blue-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '30%' }}></div>
                </div>
                <span className="ml-3 text-blue-50">30%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">B Grade (80-89%)</span>
              <div className="flex items-center">
                <div className="w-48 h-2 bg-blue-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '40%' }}></div>
                </div>
                <span className="ml-3 text-blue-50">40%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">C Grade (70-79%)</span>
              <div className="flex items-center">
                <div className="w-48 h-2 bg-blue-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '20%' }}></div>
                </div>
                <span className="ml-3 text-blue-50">20%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-blue-50">Subject Performance</h3>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Mathematics</span>
              <div className="flex items-center">
                <div className="w-48 h-2 bg-blue-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '85%' }}></div>
                </div>
                <span className="ml-3 text-blue-50">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Science</span>
              <div className="flex items-center">
                <div className="w-48 h-2 bg-blue-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '78%' }}></div>
                </div>
                <span className="ml-3 text-blue-50">78%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">English</span>
              <div className="flex items-center">
                <div className="w-48 h-2 bg-blue-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '92%' }}></div>
                </div>
                <span className="ml-3 text-blue-50">92%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
