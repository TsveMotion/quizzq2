'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { StudentProfileTab } from './StudentProfileTab';
import { StudentClassesTab } from './StudentClassesTab';
import { StudentAssignmentsTab } from './StudentAssignmentsTab';
import { StudentGradesTab } from './StudentGradesTab';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  UserCircle,
  GraduationCap,
  ScrollText,
  LineChart,
  Menu,
} from 'lucide-react';

export default function StudentDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {
      value: 'profile',
      label: 'Profile',
      icon: UserCircle,
      content: <StudentProfileTab />,
    },
    {
      value: 'classes',
      label: 'Classes',
      icon: GraduationCap,
      content: <StudentClassesTab />,
    },
    {
      value: 'assignments',
      label: 'Assignments',
      icon: ScrollText,
      content: <StudentAssignmentsTab />,
    },
    {
      value: 'grades',
      label: 'Grades',
      icon: LineChart,
      content: <StudentGradesTab />,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Toggle Button (Mobile) */}
      <Button
        variant="ghost"
        className="absolute top-4 left-4 md:hidden z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'w-64 border-r bg-gray-100/40 dark:bg-gray-800/40 flex flex-col transition-all duration-300',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0' // Always show on desktop
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.value}
                variant={activeTab === tab.value ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab(tab.value)}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full p-8">
          {tabs.find((tab) => tab.value === activeTab)?.content}
        </div>
      </div>
    </div>
  );
}
