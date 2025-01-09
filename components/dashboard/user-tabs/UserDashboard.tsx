'use client';

import { useState, useEffect } from "react";
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
  Sparkles,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { UserOverviewTab } from "./UserOverviewTab";
import { UserQuizzesTab } from "./UserQuizzesTab";
import { UserProfileTab } from "./UserProfileTab";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CheckoutModal } from "@/components/stripe/CheckoutModal";

interface NavItem {
  title: string;
  value: string;
  icon: any;
  disabled?: boolean;
  section?: string;
  freeLimit?: number;
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
    title: "AI Tutor",
    value: "ai-tutor",
    icon: Brain,
    section: "features",
    freeLimit: 3
  },
  {
    title: "Goals",
    value: "goals",
    icon: Target,
    section: "features"
  },
  {
    title: "History",
    value: "history",
    icon: History,
    section: "features"
  }
];

const userNavItems: NavItem[] = [
  {
    title: "Profile",
    value: "profile",
    icon: User,
    section: "user"
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
    section: "user"
  }
];

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const isPremium = user?.isPro || user?.role === 'PRO';

  // Mock usage tracking (in a real app, this would come from a database)
  const [usageStats, setUsageStats] = useState({
    'ai-tutor': 2,
    'quizzes-taken': 8,
    'goals-set': 1
  });

  const handleTabClick = async (value: string, freeLimit?: number) => {
    if (!isPremium && freeLimit !== undefined) {
      const currentUsage = usageStats[value as keyof typeof usageStats] || 0;
      const remainingUses = freeLimit - currentUsage;

      if (remainingUses <= 0) {
        toast.error(
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Feature limit reached</div>
            <div className="text-sm">Upgrade to Premium for unlimited access</div>
          </div>,
          {
            action: {
              label: "Upgrade",
              onClick: () => setShowCheckoutModal(true)
            }
          }
        );
        return;
      } else if (remainingUses <= 2) {
        toast.warning(
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{remainingUses} uses remaining</span>
          </div>
        );
      }
    }
    setActiveTab(value);
  };

  return (
    <div className="flex h-[calc(100vh-136px)] mx-4 mt-4 mb-4 rounded-lg bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900/40 backdrop-blur-lg border-l border-t border-b border-white/10 rounded-l-lg flex flex-col">
        <div className="flex h-10 items-center px-4 border-b border-white/10">
          <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
            QuizzQ
            <Crown className="h-3 w-3 text-yellow-500" />
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="p-2.5 space-y-2">
            <div>
              <h2 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Dashboard
              </h2>
              <nav className="mt-2 space-y-1">
                {mainNavItems
                  .filter((item) => item.section === "dashboard")
                  .map((item) => (
                    <Button
                      key={item.value}
                      variant={activeTab === item.value ? "secondary" : "ghost"}
                      className={cn(
                        "w-full h-9 justify-start gap-2 text-sm font-medium",
                        activeTab === item.value
                          ? "bg-white/10 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                      onClick={() => handleTabClick(item.value, item.freeLimit)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                      {!isPremium && item.freeLimit && (
                        <span className="ml-auto text-xs opacity-50">
                          {Math.max(0, item.freeLimit - (usageStats[item.value as keyof typeof usageStats] || 0))}/{item.freeLimit}
                        </span>
                      )}
                    </Button>
                  ))}
              </nav>
            </div>

            <div>
              <h2 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Features
              </h2>
              <nav className="mt-2 space-y-1">
                {mainNavItems
                  .filter((item) => item.section === "features")
                  .map((item) => (
                    <Button
                      key={item.value}
                      variant={activeTab === item.value ? "secondary" : "ghost"}
                      className={cn(
                        "w-full h-9 justify-start gap-2 text-sm font-medium",
                        activeTab === item.value
                          ? "bg-white/10 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                      onClick={() => handleTabClick(item.value, item.freeLimit)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                      {!isPremium && item.freeLimit && (
                        <span className="ml-auto text-xs opacity-50">
                          {Math.max(0, item.freeLimit - (usageStats[item.value as keyof typeof usageStats] || 0))}/{item.freeLimit}
                        </span>
                      )}
                    </Button>
                  ))}
              </nav>
            </div>

            <div>
              <h2 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Settings
              </h2>
              <nav className="mt-2 space-y-1">
                {userNavItems.map((item) => (
                  <Button
                    key={item.value}
                    variant={activeTab === item.value ? "secondary" : "ghost"}
                    className={cn(
                      "w-full h-9 justify-start gap-2 text-sm font-medium",
                      activeTab === item.value
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    onClick={() => handleTabClick(item.value)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full h-9 justify-start gap-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </nav>
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        {!isPremium && (
          <div className="p-2.5 border-t border-white/10">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <h5 className="text-xs font-semibold text-white">Upgrade to Premium</h5>
              </div>
              <p className="text-[10px] text-blue-100 mb-1.5">
                Get unlimited access to all features
              </p>
              <Button 
                className="w-full h-6 text-xs bg-white/10 text-white hover:bg-white/20"
                onClick={() => setShowCheckoutModal(true)}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-t border-b border-white/10 rounded-r-lg">
        <div className="h-10 border-b border-white/10 bg-gray-900/40 backdrop-blur-lg px-4 flex items-center">
          <h2 className="text-sm font-semibold text-white">
            {mainNavItems.find(item => item.value === activeTab)?.title || 
             userNavItems.find(item => item.value === activeTab)?.title}
          </h2>
        </div>
        
        <div className="flex-1 p-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Tabs value={activeTab} className="h-full flex flex-col">
            <TabsContent value="overview" className="mt-0 flex-1 flex flex-col">
              <UserOverviewTab />
            </TabsContent>
            <TabsContent value="quizzes" className="mt-0 flex-1 flex flex-col">
              <UserQuizzesTab />
            </TabsContent>
            <TabsContent value="profile" className="mt-0 flex-1 flex flex-col">
              <UserProfileTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
      />
    </div>
  );
}
