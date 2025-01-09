'use client';

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5 rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-[#0070f3]" />
            Light
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-[#0070f3]" />
            Dark
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("blue")}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-[#0284c7]" />
            Ocean Blue
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("pink")}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-[#ec4899]" />
            Cherry Blossom
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("futuristic")}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-[#10b981]" />
            Cyberpunk
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}