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
  Bot,
  Menu,
  Crown,
  User2,
  Home,
  BookOpen,
  Target,
  BrainCircuit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingModal } from "@/components/stripe/PricingModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { Role } from '@prisma/client';

const routes = [
  {
    title: "Overview",
    href: "/dashboard/user",
    icon: Home,
    description: "View your learning progress"
  },
  {
    title: "AI Tutor",
    href: "/dashboard/user/ai-tutor",
    icon: Bot,
    description: "Practice with AI assistance"
  },
  {
    title: "Quizzes",
    href: "/dashboard/user/quizzes",
    icon: BrainCircuit,
    description: "Take AI-generated quizzes"
  },
  {
    title: "Learning Goals",
    href: "/dashboard/user/goals",
    icon: Target,
    description: "Set and track your goals"
  },
  {
    title: "Profile",
    href: "/dashboard/user/profile",
    icon: User2,
    description: "Manage your account"
  },
];

interface UserNavbarProps {
  initialSession: Session | null;
}

export default function UserNavbar({ initialSession }: UserNavbarProps) {
  const { data: session } = useSession();
  const currentSession = session || initialSession;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'U';
  };

  const userInitials = currentSession?.user?.name ? getInitials(currentSession.user.name) : 'U';

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-[#1a237e]/95 backdrop-blur-sm border-r border-white/10 mt-16">
          <SheetHeader className="p-4 text-left border-b border-white/10">
            <SheetTitle className="flex items-center gap-2 text-white">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentSession?.user?.image || ''} />
                <AvatarFallback className="bg-purple-600 text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span>User Dashboard</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 p-5">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors",
                    pathname === route.href && "bg-white/20 text-white font-medium"
                  )}
                >
                  <route.icon className="h-5 w-5 shrink-0" />
                  <div className="flex flex-col items-start gap-0.5">
                    <span>{route.title}</span>
                    <span className="text-xs text-white/60">{route.description}</span>
                  </div>
                </Button>
              </Link>
            ))}
            {currentSession?.user?.role !== Role.PROUSER && (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-3 py-2 text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 transition-colors"
                onClick={() => {
                  setShowPricing(true);
                  setOpen(false);
                }}
              >
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      <nav className="hidden md:flex flex-col gap-4 p-5 border-r border-white/10 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#1a237e]/95 backdrop-blur-sm w-[18rem] z-40">
        <div className="flex items-center gap-3 px-2 py-2 border-b border-white/10 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentSession?.user?.image || ''} />
            <AvatarFallback className="bg-purple-600 text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-white/90">User Dashboard</span>
        </div>
        <div className="flex flex-col gap-4">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors",
                  pathname === route.href && "bg-white/20 text-white font-medium"
                )}
              >
                <route.icon className="h-5 w-5 shrink-0" />
                <div className="flex flex-col items-start gap-0.5">
                  <span>{route.title}</span>
                  <span className="text-xs text-white/60">{route.description}</span>
                </div>
              </Button>
            </Link>
          ))}
          {currentSession?.user?.role !== Role.PROUSER && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 px-3 py-2 text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 transition-colors"
              onClick={() => setShowPricing(true)}
            >
              <Crown className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          )}
        </div>
      </nav>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </>
  );
}
