"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const pathname = usePathname() || '';
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  // Close mobile menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close mobile menu on resize if screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1a237e] transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo - Left */}
        <div className="w-[200px] flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-400 animate-pulse" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              QuizzQ
            </span>
          </Link>
        </div>

        {/* Navigation - Center */}
        <nav className="hidden md:flex items-center justify-center space-x-6">
          {navigationLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative py-2 text-sm font-medium transition-colors hover:text-white group",
                pathname === href ? "text-white" : "text-white/70"
              )}
            >
              {label}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-[1px] h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform origin-left transition-transform duration-300",
                  pathname === href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Actions - Right */}
        <div className="w-[200px] flex justify-end items-center space-x-3">
          {session ? (
            <>
              {!pathname?.includes('/dashboard') && (
                <Button 
                  variant="ghost"
                  className="bg-white/10 text-white hover:bg-white/20 hover:text-white hidden md:inline-flex"
                  asChild
                >
                  <Link href="/dashboard">
                    Dashboard
                  </Link>
                </Button>
              )}
              <Button 
                variant="ghost"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-red-100 hidden md:inline-flex"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost"
                className="bg-white/10 text-white hover:bg-white/20 hover:text-white hidden md:inline-flex"
                asChild
              >
                <Link href="/signup">
                  Sign Up
                </Link>
              </Button>
              <Button 
                variant="default"
                className="bg-blue-500 text-white hover:bg-blue-600 hidden md:inline-flex"
                asChild
              >
                <Link href="/signin">
                  Sign In
                </Link>
              </Button>
            </>
          )}
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -mr-2 text-white/70 hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10"
          >
            <div className="container py-4 px-4 space-y-4">
              <nav className="flex flex-col space-y-4">
                {navigationLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-white",
                      pathname === href ? "text-white" : "text-white/70"
                    )}
                  >
                    {label}
                  </Link>
                ))}
                {session ? (
                  <>
                    {!pathname?.includes('/dashboard') && (
                      <Link
                        href="/dashboard"
                        className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="text-sm font-medium text-red-300 hover:text-red-200 transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/signin"
                      className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
