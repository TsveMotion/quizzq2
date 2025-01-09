'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import OverviewTab from "./OverviewTab";
import { UsersTab } from "./UsersTab";
import { SchoolsTab } from "./SchoolsTab";
import { ContactsTab } from "./ContactsTab";
import { SettingsTab } from "./SettingsTab";
import { SystemSettingsTab } from "./SystemSettingsTab";
import { Shield, LogOut, LayoutDashboard, Users, School, MessageSquare, Settings, HelpCircle, Building2, Cog } from "lucide-react";
import { mainNavItems } from "@/config/nav";

interface NavItem {
  title: string;
  value: string;
  icon: any;
  disabled?: boolean;
  section?: string;
}

interface School {
  id: string;
  name: string;
  description?: string;
  roleNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  studentCount?: number;
  teacherCount?: number;
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const dashboardItems = mainNavItems.filter(item => item.section === "dashboard");
  const systemItems = mainNavItems.filter(item => item.section === "system");

  return (
    <div className="flex h-screen bg-[#0a1d3b] rounded-3xl overflow-hidden m-2">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f2850] border-r border-blue-800/40">
        <div className="flex h-14 items-center px-4 border-b border-blue-800/40">
          <Shield className="mr-2 h-5 w-5 text-blue-400" />
          <span className="font-semibold text-blue-50">SuperAdmin</span>
        </div>
        
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
          <div className="flex-1 p-2 space-y-1">
            {dashboardItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  disabled={item.disabled}
                  className={cn(
                    "flex w-full items-center gap-x-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    activeTab === item.value
                      ? "bg-blue-600/90 text-blue-50 shadow-md shadow-blue-900/20"
                      : "text-blue-200 hover:bg-blue-800/50 hover:text-blue-50 hover:shadow-sm hover:shadow-blue-900/10",
                    item.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.title}
                </button>
              );
            })}
          </div>

          <div className="p-2 border-t border-blue-800/40">
            {systemItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  onClick={() => {
                    if (item.value === "sign-out") {
                      handleSignOut();
                    } else {
                      setActiveTab(item.value);
                    }
                  }}
                  disabled={item.disabled}
                  className={cn(
                    "flex w-full items-center gap-x-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    activeTab === item.value
                      ? "bg-blue-600/90 text-blue-50 shadow-md shadow-blue-900/20"
                      : "text-blue-200 hover:bg-blue-800/50 hover:text-blue-50 hover:shadow-sm hover:shadow-blue-900/10",
                    item.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 flex items-center px-6 border-b border-blue-800/40 bg-[#0f2850]">
          <h1 className="text-lg font-semibold text-blue-50">
            {mainNavItems.find((item) => item.value === activeTab)?.title || "Dashboard"}
          </h1>
        </div>

        <div className="flex-1 overflow-auto bg-[#0a1d3b]">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "schools" && <SchoolsTab />}
          {activeTab === "contacts" && <ContactsTab />}
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "system" && <SystemSettingsTab />}
        </div>
      </div>
    </div>
  );
}