'use client';

import { 
  Brain, 
  Home,
  Info,
  Mail,
  BookOpen,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ 
      redirect: false
    });
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="hidden font-bold sm:inline-block">
                QUIZZQ
              </span>
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <nav className="flex-1 flex items-center justify-center space-x-4 lg:space-x-6">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80 text-sm font-medium flex items-center space-x-2",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/about"
              className={cn(
                "transition-colors hover:text-foreground/80 text-sm font-medium flex items-center space-x-2",
                pathname === "/about" ? "text-foreground" : "text-foreground/60"
              )}
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link
              href="/contact"
              className={cn(
                "transition-colors hover:text-foreground/80 text-sm font-medium flex items-center space-x-2",
                pathname === "/contact" ? "text-foreground" : "text-foreground/60"
              )}
            >
              <Mail className="h-4 w-4" />
              <span>Contact</span>
            </Link>
          </nav>

          {/* Right Side - Auth Buttons */}
          <div className="flex-shrink-0 flex items-center space-x-4">
            <ModeToggle />
            {status === 'loading' ? (
              <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
            ) : session?.user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname.startsWith("/dashboard") ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-foreground/60 hover:text-foreground/80"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname === "/signin" ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  <Link href="/signin">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/signup" ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  <Link href="/signup">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}