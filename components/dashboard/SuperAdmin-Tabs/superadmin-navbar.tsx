'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  LayoutDashboard,
  Users,
  Settings,
  Activity,
  Database,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const routes = [
  {
    title: "Overview",
    href: "/dashboard/superadmin",
    icon: LayoutDashboard,
    description: "System overview and metrics"
  },
  {
    title: "User Management",
    href: "/dashboard/superadmin/users",
    icon: Users,
    description: "Manage user accounts"
  },
  {
    title: "System Settings",
    href: "/dashboard/superadmin/settings",
    icon: Settings,
    description: "Configure system settings"
  },
  {
    title: "Activity Logs",
    href: "/dashboard/superadmin/logs",
    icon: Activity,
    description: "View system activity logs"
  },
  {
    title: "Database",
    href: "/dashboard/superadmin/database",
    icon: Database,
    description: "Database management"
  },
  {
    title: "Security",
    href: "/dashboard/superadmin/security",
    icon: Shield,
    description: "Security settings and logs"
  },
];

export function SuperAdminNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'A';
  };

  const userInitials = session?.user?.name ? getInitials(session.user.name) : 'A';

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden fixed top-4 left-4 z-50 text-white"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-[#1a237e] border-r border-white/10">
          <div className="h-full flex flex-col bg-[#1a237e]">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-white">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback className="bg-white/10">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{session?.user?.name}</span>
                  <span className="text-xs text-white/70">SuperAdmin</span>
                </div>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto">
              <div className="space-y-1 p-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === route.href 
                        ? "bg-white/10 text-white" 
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{route.title}</span>
                      <span className="text-xs text-white/50">{route.description}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r border-white/10 bg-[#1a237e]">
        <div className="flex h-full w-full flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback className="bg-white/10">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{session?.user?.name}</span>
                <span className="text-xs text-white/70">SuperAdmin</span>
              </div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <div className="space-y-1 p-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname === route.href 
                      ? "bg-white/10 text-white" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{route.title}</span>
                    <span className="text-xs text-white/50">{route.description}</span>
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
