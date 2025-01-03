"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Brain } from "lucide-react";
import Link from "next/link";

export function Navbar() {
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
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}