'use client';

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SuperAdminOverviewTab } from "./OverviewTab";
import { SuperAdminUsersTab } from "./UsersTab";
import { SuperAdminSchoolsTab } from "./SchoolsTab";
import ContactsTab from "./ContactsTab";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  School, 
  MessageSquare,
  LogOut,
  Settings,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface NavItem {
  title: string;
  value: string;
  icon: any;
  disabled?: boolean;
}

const mainNavItems: NavItem[] = [
  {
    title: "Overview",
    value: "overview",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    value: "users",
    icon: Users,
  },
  {
    title: "Schools",
    value: "schools",
    icon: School,
  },
  {
    title: "Contact Messages",
    value: "contacts",
    icon: MessageSquare,
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
    disabled: true,
  },
  {
    title: "Help",
    value: "help",
    icon: HelpCircle,
    disabled: true,
  },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-background border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-lg font-semibold">QUIZZQ Admin</h1>
          <p className="text-sm text-muted-foreground">Super Administrator</p>
        </div>
        
        <div className="flex-1 flex flex-col justify-between py-4">
          {/* Main Navigation */}
          <nav className="px-4 space-y-2">
            {mainNavItems.map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  activeTab === item.value && "bg-secondary"
                )}
                onClick={() => setActiveTab(item.value)}
                disabled={item.disabled}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </nav>

          {/* Bottom Navigation */}
          <div className="px-4 space-y-2">
            {bottomNavItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                className="w-full justify-start gap-2"
                disabled={item.disabled}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="h-full px-8 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{mainNavItems.find(item => item.value === activeTab)?.title}</h2>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-8">
            <Tabs value={activeTab} className="h-full space-y-6">
              <TabsContent value="overview" className="m-0">
                <SuperAdminOverviewTab />
              </TabsContent>
              <TabsContent value="users" className="m-0">
                <SuperAdminUsersTab />
              </TabsContent>
              <TabsContent value="schools" className="m-0">
                <SuperAdminSchoolsTab />
              </TabsContent>
              <TabsContent value="contacts" className="m-0">
                <ContactsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}