'use client';

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  School,
  Users,
  BookOpen,
  Settings,
  GraduationCap,
  Calendar,
  FileText,
  BarChart,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { OverviewTab } from "./OverviewTab";
import { TeachersTab } from "./TeachersTab";
import { StudentsTab } from "./StudentsTab";
import { ClassesTab } from "./ClassesTab";
import { CalendarTab } from "./CalendarTab";
import { ReportsTab } from "./ReportsTab";
import { SettingsTab } from "./SettingsTab";
import { ExtendedSchoolWithRelations } from '@/types';

interface SchoolAdminDashboardProps {
  school: ExtendedSchoolWithRelations;
}

export function SchoolAdminDashboard({ school }: SchoolAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dashboardItems = [
    {
      title: "Overview",
      value: "overview",
      icon: BarChart,
    },
    {
      title: "Teachers",
      value: "teachers",
      icon: GraduationCap,
    },
    {
      title: "Students",
      value: "students",
      icon: Users,
    },
    {
      title: "Classes",
      value: "classes",
      icon: BookOpen,
    },
    {
      title: "Calendar",
      value: "calendar",
      icon: Calendar,
    },
    {
      title: "Reports",
      value: "reports",
      icon: FileText,
    },
  ];

  const systemItems = [
    {
      title: "Settings",
      value: "settings",
      icon: Settings,
    },
    {
      title: "Sign Out",
      value: "sign-out",
      icon: LogOut,
    },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 bg-[#0a1d3b]">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-[4.5rem] left-4 z-50 p-2 rounded-lg bg-blue-800/40 text-blue-50"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      <div className="absolute inset-4 flex rounded-3xl bg-[#0f2850] overflow-hidden">
        {/* Sidebar - Mobile Overlay */}
        <div
          onClick={() => setIsSidebarOpen(false)}
          className={cn(
            "fixed inset-0 bg-black/50 lg:hidden transition-opacity",
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        />

        {/* Sidebar */}
        <div
          className={cn(
            "absolute lg:relative w-64 bg-[#0f2850] border-r border-blue-800/40 flex flex-col rounded-l-3xl transition-transform lg:translate-x-0 z-40",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-14 items-center px-4 border-b border-blue-800/40">
            <School className="mr-2 h-5 w-5 text-blue-400" />
            <span className="font-semibold text-blue-50">School Admin</span>
          </div>
          
          <div className="flex-1 p-2 space-y-1 overflow-y-auto">
            {[...dashboardItems, ...systemItems].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  onClick={() => {
                    if (item.value === "sign-out") {
                      handleSignOut();
                    } else {
                      setActiveTab(item.value);
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center gap-x-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    activeTab === item.value
                      ? "bg-blue-600/90 text-blue-50 shadow-md shadow-blue-900/20"
                      : "text-blue-200 hover:bg-blue-800/50 hover:text-blue-50 hover:shadow-sm hover:shadow-blue-900/10"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "teachers" && <TeachersTab />}
          {activeTab === "students" && <StudentsTab />}
          {activeTab === "classes" && <ClassesTab />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}
