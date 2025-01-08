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
  Lock,
  Sparkles
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
    section: "dashboard",
    requiresPro: true
  },
  {
    title: "AI Tutor",
    value: "ai-tutor",
    icon: Brain,
    section: "features",
    requiresPro: true
  },
  {
    title: "Goals",
    value: "goals",
    icon: Target,
    section: "features",
    requiresPro: true
  },
  {
    title: "History",
    value: "history",
    icon: History,
    section: "features",
    requiresPro: true
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

  // Function to check if feature is locked
  const isFeatureLocked = (feature: string) => {
    if (isPremium) return false; // All features unlocked for premium users
    
    // Define which features are locked for free users
    const lockedFeatures = [
      'ai-tutor',
      'advanced-analytics',
      'progress-tracking',
      'priority-support'
    ];
    
    return lockedFeatures.includes(feature);
  };

  const handleTabClick = async (value: string, requiresPro: boolean = false) => {
    if (requiresPro && !isPremium) {
      setShowCheckoutModal(true);
      return;
    }
    setActiveTab(value);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden lg:flex h-full w-72 flex-col gap-2 border-r bg-gray-50/40 px-6 py-8 dark:bg-gray-800/40">
        <div className="flex h-[60px] items-center px-6">
          <h1 className="text-2xl font-bold">QuizzQ</h1>
          {!session?.user?.isPro && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setShowCheckoutModal(true)}
            >
              <Crown className="h-5 w-5 text-yellow-500" />
            </Button>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <nav className="grid gap-1">
            <div className="mb-2">
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                Dashboard
              </h4>
              {mainNavItems
                .filter((item) => item.section === "dashboard")
                .map((item) => (
                  <Button
                    key={item.value}
                    variant={activeTab === item.value ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-2", {
                      "opacity-50": item.disabled
                    })}
                    onClick={() => handleTabClick(item.value, item.requiresPro)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                    {item.requiresPro && !isPremium && (
                      <Lock className="h-4 w-4 ml-auto" />
                    )}
                  </Button>
                ))}
            </div>
            <div className="mb-2">
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                Features
              </h4>
              {mainNavItems
                .filter((item) => item.section === "features")
                .map((item) => (
                  <Button
                    key={item.value}
                    variant={activeTab === item.value ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-2", {
                      "opacity-50": item.disabled
                    })}
                    onClick={() => handleTabClick(item.value, item.requiresPro)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                    {item.requiresPro && !isPremium && (
                      <Lock className="h-4 w-4 ml-auto" />
                    )}
                  </Button>
                ))}
            </div>
            <div>
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                Settings
              </h4>
              {userNavItems.map((item) => (
                <Button
                  key={item.value}
                  variant={activeTab === item.value ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => handleTabClick(item.value)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              ))}
            </div>
          </nav>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="h-full px-4 py-6 lg:px-8">
          {!session?.user?.isPro && <PremiumBanner />}
          <Tabs value={activeTab} className="h-full space-y-6">
            <TabsContent value="overview" className="h-full">
              <UserOverviewTab />
            </TabsContent>
            <TabsContent value="quizzes" className="h-full">
              <UserQuizzesTab />
            </TabsContent>
            <TabsContent value="profile" className="h-full">
              <UserProfileTab />
            </TabsContent>
            {isFeatureLocked('ai-tutor') ? (
              <div className="relative">
                <div className="opacity-50 pointer-events-none">
                  <TabsContent value="ai-tutor" className="h-full">
                    <div className="flex flex-col gap-4">
                      <h2 className="text-lg font-bold">AI Tutor</h2>
                      <p className="text-sm text-muted-foreground">
                        Get personalized learning recommendations with our AI-powered tutor.
                      </p>
                    </div>
                  </TabsContent>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
              </div>
            ) : (
              <TabsContent value="ai-tutor" className="h-full">
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-bold">AI Tutor</h2>
                  <p className="text-sm text-muted-foreground">
                    Get personalized learning recommendations with our AI-powered tutor.
                  </p>
                </div>
              </TabsContent>
            )}
            {/* Add other tab contents as needed */}
          </Tabs>
        </div>
      </div>

      <CheckoutModal 
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSuccess={() => {
          setShowCheckoutModal(false);
          router.refresh();
        }}
      />
    </div>
  );
}

function PremiumBanner() {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  return (
    <>
      <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <div>
              <h3 className="font-semibold">Upgrade to Premium</h3>
              <p className="text-sm text-muted-foreground">
                Get access to AI Tutor, Progress Tracking, and more!
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCheckoutModal(true)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
      
      <CheckoutModal 
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
      />
    </>
  );
}
