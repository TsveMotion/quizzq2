'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SuperAdminOverviewTab } from "./SuperAdminOverviewTab";
import { UsersTab } from "./UsersTab";
import { SchoolsTab } from "./SchoolsTab";
import { ContactsTab } from "./ContactsTab";
import { SettingsTab } from "./SettingsTab";
import SystemSettingsTab from "./SystemSettingsTab";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  School, 
  MessageSquare,
  LogOut,
  Settings,
  HelpCircle,
  Building2,
  Cog,
  Shield 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

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

const mainNavItems: NavItem[] = [
  {
    title: "Overview",
    value: "overview",
    icon: LayoutDashboard,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Users",
    value: "users",
    icon: Users,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Schools",
    value: "schools",
    icon: School,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Contacts",
    value: "contacts",
    icon: MessageSquare,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
    disabled: false,
    section: "system"
  },
  {
    title: "System",
    value: "system",
    icon: Cog,
    disabled: false,
    section: "system"
  },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const dashboardItems = mainNavItems.filter(item => item.section === "dashboard");
  const systemItems = mainNavItems.filter(item => item.section === "system");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 flex flex-col border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Shield className="mr-2 h-5 w-5" />
          <span className="font-semibold text-foreground">SuperAdmin</span>
        </div>
        
        <div className="flex flex-col flex-grow py-2">
          {/* All Navigation Items */}
          <div className="space-y-1 px-2">
            {/* Dashboard Items */}
            {dashboardItems.map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  activeTab === item.value ? "bg-secondary" : "hover:bg-accent"
                )}
                onClick={() => setActiveTab(item.value)}
                disabled={item.disabled}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.title}
              </Button>
            ))}

            {/* Separator */}
            <div className="my-2 border-t border-border/50" />

            {/* System Items */}
            {systemItems.map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  activeTab === item.value ? "bg-secondary" : "hover:bg-accent"
                )}
                onClick={() => setActiveTab(item.value)}
                disabled={item.disabled}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.title}
              </Button>
            ))}
            
            {/* Separator */}
            <div className="my-2 border-t border-border/50" />

            {/* Sign Out Button */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-[1400px]">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="overview" className="mt-0">
              <SuperAdminOverviewTab />
            </TabsContent>
            <TabsContent value="users" className="mt-0">
              <UsersTab />
            </TabsContent>
            <TabsContent value="schools" className="mt-0">
              <SchoolsTab />
            </TabsContent>
            <TabsContent value="contacts" className="mt-0">
              <ContactsTab />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>
            <TabsContent value="system" className="mt-0">
              <SystemSettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}