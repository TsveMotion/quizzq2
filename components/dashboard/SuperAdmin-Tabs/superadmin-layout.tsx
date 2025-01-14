'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import { Overview } from "./overview";
import { UserManagement } from "./user-management";
import { SystemSettings } from "./system-settings";
import { Card } from "@/components/ui/card";
import { SuperAdminNavbar } from "./superadmin-navbar";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

function LoadingOverview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-2">
              <div className="h-4 w-1/2 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-8 w-3/4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6">
          <div className="h-[350px] animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
        </Card>
        <Card className="col-span-3 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-1/2 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      title: "Overview",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
      href: "/dashboard/superadmin",
    },
    {
      title: "User Management",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      href: "/dashboard/superadmin/users",
    },
    {
      title: "System Settings",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      href: "/dashboard/superadmin/settings",
    },
    {
      title: "Activity Logs",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      ),
      href: "/dashboard/superadmin/logs",
    },
    {
      title: "Database",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5V19A9 3 0 0 0 21 19V5" />
          <path d="M3 12A9 3 0 0 0 21 12" />
        </svg>
      ),
      href: "/dashboard/superadmin/database",
    },
    {
      title: "Security",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
      ),
      href: "/dashboard/superadmin/security",
    },
  ];

  return (
    <div className="grid lg:grid-cols-5">
      <aside className="lg:col-span-1 border-r border-white/10 h-screen bg-[#1a237e] fixed lg:w-64 w-full bottom-0 lg:top-0">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b border-white/10 px-6">
            <Link className="flex items-center gap-2 font-semibold text-white" href="/dashboard/superadmin">
              <span>SuperAdmin Dashboard</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white ${
                    pathname === item.href ? 'bg-white/10 text-white' : 'text-white/70'
                  }`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
      <div className="lg:col-span-4 lg:col-start-2">
        {children}
      </div>
    </div>
  );
}

export default function SuperAdminLayoutPage() {
  return (
    <SuperAdminLayout>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">SuperAdmin Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Suspense fallback={<LoadingOverview />}>
                <Overview />
              </Suspense>
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              <UserManagement />
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <SystemSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
