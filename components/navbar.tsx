"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Brain } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make a request to check auth status
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl">QUIZZQ</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/courses" className="text-muted-foreground hover:text-foreground">
              Courses
            </Link>
            <Link href="/assignments" className="text-muted-foreground hover:text-foreground">
              Assignments
            </Link>
            <Link href="/ai-chat" className="text-muted-foreground hover:text-foreground">
              AI Chat
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}