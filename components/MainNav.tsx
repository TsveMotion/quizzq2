'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link href="/" className="flex items-center space-x-2">
        <Brain className="h-6 w-6" />
        <span className="font-bold">QuizzQ</span>
      </Link>
      <Link
        href="/about"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/about"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        About
      </Link>
      <Link
        href="/contact"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/contact"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Contact
      </Link>
      <Link
        href="/docs"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/docs"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Docs
      </Link>
    </nav>
  );
}
