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
import { UserOverviewTab } from "./UserOverviewTab";
import { UserQuizzesTab } from "./UserQuizzesTab";
import { UserProfileTab } from "./UserProfileTab";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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
  const router = useRouter();
  const { data: session } = useSession();

  const handleTabClick = async (value: string, requiresPro: boolean = false) => {
    if (requiresPro && !session?.user?.isPro) {
      // Instead of redirecting, show a payment modal or unlock prompt
      toast.error("This feature requires a Pro subscription", {
        description: "Upgrade to Pro to unlock all features",
        action: {
          label: "Upgrade",
          onClick: () => {
            fetch("/api/create-checkout-session", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
                successUrl: window.location.href, // Return to the same page after payment
                cancelUrl: window.location.href,
              }),
            })
            .then(res => res.json())
            .then(data => {
              if (data.url) {
                window.location.href = data.url;
              }
            })
            .catch(err => {
              console.error("Error creating checkout session:", err);
              toast.error("Failed to start checkout process");
            });
          },
        },
      });
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
              onClick={() => handleTabClick("upgrade", true)}
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
                    {item.requiresPro && !session?.user?.isPro && (
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
                    {item.requiresPro && !session?.user?.isPro && (
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
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
          {/* Add other tab contents as needed */}
        </Tabs>
      </div>
    </div>
  );
}
