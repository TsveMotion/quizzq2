'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen,
  User,
  Settings,
  LogOut,
  LineChart,
  Crown,
  Brain,
  Target,
  History,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { FreeOverviewTab } from "./FreeOverviewTab";
import { FreeQuizzesTab } from "./FreeQuizzesTab";
import { FreeProfileTab } from "./FreeProfileTab";
import { useSession } from "next-auth/react";

interface NavItem {
  title: string;
  value: string;
  icon: any;
  disabled?: boolean;
  section?: string;
  requiresPro?: boolean;
}

const mainNavItems: NavItem[] = [
  {
    title: "Overview",
    value: "overview",
    icon: LayoutDashboard,
    section: "dashboard"
  },
  {
    title: "Quizzes",
    value: "quizzes",
    icon: BookOpen,
    section: "dashboard"
  },
  {
    title: "Progress",
    value: "progress",
    icon: LineChart,
    section: "dashboard"
  },
  {
    title: "AI Practice",
    value: "ai-practice",
    icon: Brain,
    section: "dashboard",
    requiresPro: true
  },
  {
    title: "Custom Goals",
    value: "goals",
    icon: Target,
    section: "dashboard",
    requiresPro: true
  },
  {
    title: "Quiz History",
    value: "history",
    icon: History,
    section: "dashboard",
    requiresPro: true
  },
  {
    title: "Profile",
    value: "profile",
    icon: User,
    section: "system"
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
    section: "system"
  }
];

export function FreeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const { data: session } = useSession();
  const isPro = session?.user?.role === 'PRO';

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const handleProFeatureClick = () => {
    router.push('/pricing');
  };

  const dashboardItems = mainNavItems.filter(item => item.section === "dashboard");
  const systemItems = mainNavItems.filter(item => item.section === "system");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 flex flex-col border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center border-b border-border px-4">
          {isPro ? (
            <Crown className="mr-2 h-5 w-5 text-yellow-500" />
          ) : (
            <User className="mr-2 h-5 w-5" />
          )}
          <span className="font-semibold text-foreground">
            {isPro ? 'Pro Account' : 'Free Account'}
          </span>
        </div>
        
        <div className="flex flex-col flex-grow py-2">
          <div className="space-y-1 px-2">
            {/* Dashboard Items */}
            {dashboardItems.map((item) => {
              const isProFeature = item.requiresPro && !isPro;
              return (
                <Button
                  key={item.value}
                  variant={activeTab === item.value ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    activeTab === item.value ? "bg-secondary" : "hover:bg-accent",
                    isProFeature && "opacity-70"
                  )}
                  onClick={() => isProFeature ? handleProFeatureClick() : setActiveTab(item.value)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span className="flex-1 text-left">{item.title}</span>
                  {isProFeature && <Lock className="h-3 w-3" />}
                </Button>
              );
            })}

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
              <FreeOverviewTab />
            </TabsContent>
            <TabsContent value="quizzes" className="mt-0">
              <FreeQuizzesTab />
            </TabsContent>
            <TabsContent value="progress" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <h2 className="text-2xl font-bold">Progress Coming Soon</h2>
              </div>
            </TabsContent>
            <TabsContent value="profile" className="mt-0">
              <FreeProfileTab />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <h2 className="text-2xl font-bold">Settings Coming Soon</h2>
              </div>
            </TabsContent>
            {["ai-practice", "goals", "history"].map((proTab) => (
              <TabsContent key={proTab} value={proTab} className="mt-0">
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                  <Crown className="h-12 w-12 text-yellow-500" />
                  <h2 className="text-2xl font-bold">Pro Feature</h2>
                  <p className="text-muted-foreground text-center max-w-md">
                    This feature is available exclusively to Pro users. Upgrade now to unlock all premium features.
                  </p>
                  <Button 
                    onClick={() => router.push('/pricing')}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
