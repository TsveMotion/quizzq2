'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  UserCircle,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import TeacherClassesTab from './TeacherClassesTab';
import TeacherAssignmentsTab from './TeacherAssignmentsTab';
import TeacherProfileTab from './TeacherProfileTab';
import { Loader2 } from 'lucide-react';

export default function TeacherDashboard() {
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

  const sidebarItems = [
    {
      name: "Overview",
      icon: LayoutDashboard,
      value: "overview",
    },
    {
      name: "My Classes",
      icon: BookOpen,
      value: "classes",
    },
    {
      name: "Assignments",
      icon: ClipboardList,
      value: "assignments",
    },
    {
      name: "Profile",
      icon: UserCircle,
      value: "profile",
    },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Welcome, {session.user.name}</h2>
            <p className="text-muted-foreground">Select a section from the sidebar to get started.</p>
          </div>
        );
      case 'classes':
        return <TeacherClassesTab />;
      case 'assignments':
        return <TeacherAssignmentsTab />;
      case 'profile':
        return <TeacherProfileTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-gray-900 p-4 md:flex">
        <div className="flex items-center gap-2 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-lg font-semibold text-white">Teacher Dashboard</span>
        </div>
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-gray-300 hover:text-white",
                  currentView === item.value && "bg-gray-800 text-white"
                )}
                onClick={() => setCurrentView(item.value)}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Button>
            );
          })}
        </nav>
        <Button
          variant="ghost"
          className="mt-auto w-full justify-start gap-2 text-gray-300 hover:text-white"
          onClick={() => signOut({ callbackUrl: '/signin' })}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
}
