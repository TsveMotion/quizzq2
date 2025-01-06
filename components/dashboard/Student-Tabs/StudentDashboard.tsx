'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  UserCircle,
  LogOut,
  Loader2,
  GraduationCap,
  LineChart
} from "lucide-react";
import StudentOverviewTab from './StudentOverviewTab';
import StudentProfileTab from './StudentProfileTab';
import StudentClassesTab from './StudentClassesTab';
import StudentAssignmentsTab from './StudentAssignmentsTab';
import StudentGradesTab from './StudentGradesTab';

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [currentView, setCurrentView] = useState('overview');

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navItems = [
    {
      title: "Overview",
      value: "overview",
      icon: LayoutDashboard,
    },
    {
      title: "My Classes",
      value: "classes",
      icon: BookOpen,
    },
    {
      title: "Assignments",
      value: "assignments",
      icon: ClipboardList,
    },
    {
      title: "Grades",
      value: "grades",
      icon: LineChart,
    },
    {
      title: "Profile",
      value: "profile",
      icon: UserCircle,
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Student Dashboard</h2>
        </div>
        <div className="space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 px-2",
                  currentView === item.value && "bg-muted"
                )}
                onClick={() => setCurrentView(item.value)}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            );
          })}
        </div>
        <div className="absolute bottom-0 w-64 border-t p-4">
          <div className="mb-2">
            <div className="text-sm font-semibold">{session.user.name || 'Student'}</div>
            <div className="text-xs text-muted-foreground">{session.user.email}</div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600"
            onClick={async () => {
              await signOut({
                redirect: true,
                callbackUrl: 'http://localhost:3000/'
              });
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {session.user.name}'s Dashboard
            </h2>
          </div>

          <div className="space-y-4">
            {currentView === 'overview' && <StudentOverviewTab />}
            {currentView === 'classes' && <StudentClassesTab />}
            {currentView === 'assignments' && <StudentAssignmentsTab />}
            {currentView === 'grades' && <StudentGradesTab />}
            {currentView === 'profile' && <StudentProfileTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
