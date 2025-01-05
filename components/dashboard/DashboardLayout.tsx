'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardLayoutProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export function DashboardLayout({ activeTab, onTabChange, children }: DashboardLayoutProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1">
      <TabsList className="hidden">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="schools">Schools</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
