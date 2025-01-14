'use client';

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import OverviewTab from "./OverviewTab";
import { UsersTab } from "./UsersTab";
import { SchoolsTab } from "./SchoolsTab";
import { ContactsTab } from "./ContactsTab";
import { SettingsTab } from "./SettingsTab";
import { SystemSettingsTab } from "./SystemSettingsTab";
import { Shield, LogOut, LayoutDashboard, Users, School, MessageSquare, Settings, HelpCircle, Building2, Cog } from "lucide-react";

interface NavItem {
  title: string;
  value: string;
  icon: any;
  disabled?: boolean;
}

const dashboardItems: NavItem[] = [
  { title: "Overview", value: "overview", icon: LayoutDashboard },
  { title: "Users", value: "users", icon: Users },
  { title: "Schools", value: "schools", icon: School },
  { title: "Contacts", value: "contacts", icon: MessageSquare },
  { title: "Settings", value: "settings", icon: Settings },
];

const systemItems: NavItem[] = [
  { title: "System Settings", value: "system", icon: Cog },
  { title: "Sign Out", value: "sign-out", icon: LogOut },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 bg-[#0a1d3b]">
      <div className="absolute inset-4 flex rounded-3xl bg-[#0f2850]">
        {/* Sidebar */}
        <div className="w-64 bg-[#0f2850] border-r border-blue-800/40 flex flex-col rounded-l-3xl">
          <div className="flex h-14 items-center px-4 border-b border-blue-800/40">
            <Shield className="mr-2 h-5 w-5 text-blue-400" />
            <span className="font-semibold text-blue-50">SuperAdmin</span>
          </div>
          
          <div className="flex-1 p-2 space-y-1">
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

        {/* Main Content */}
        <div className="flex-1 p-6">
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