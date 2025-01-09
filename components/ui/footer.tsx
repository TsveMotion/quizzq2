"use client";

import Link from "next/link";
import { Brain, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Demo", href: "/demo" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/help" },
    { label: "Blog", href: "/blog" },
    { label: "Tutorials", href: "/tutorials" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

type SectionProps = {
  title: string;
  links: { label: string; href: string; }[];
};

function FooterSection({ title, links }: SectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:cursor-default group"
      >
        <h3 className="font-semibold text-blue-50 group-hover:text-blue-200 transition-colors">{title}</h3>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-blue-200/70 transition-all md:hidden",
            isOpen && "transform rotate-180"
          )} 
        />
      </button>
      <ul className={cn(
        "space-y-3",
        !isOpen && "hidden md:block"
      )}>
        {links.map((link, index) => (
          <motion.li 
            key={link.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              href={link.href}
              className="text-sm text-blue-200/70 hover:text-blue-100 transition-all hover:translate-x-1 inline-flex items-center group"
            >
              <span className="relative">
                {link.label}
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/70 to-blue-400/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-blue-200/10 bg-gradient-to-b from-blue-950/50 to-blue-900/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Brain className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </motion.div>
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                QuizzQ
              </span>
            </Link>
            <p className="text-sm text-blue-200/70 leading-relaxed max-w-sm">
              Transforming education with AI-powered learning experiences. Join us in revolutionizing the way we learn and teach.
            </p>
            <div className="flex gap-4">
              <Link href="/signup" className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 text-sm font-medium transition-all hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="grid gap-8 sm:grid-cols-3 md:col-span-3">
            <FooterSection title="Product" links={footerLinks.product} />
            <FooterSection title="Resources" links={footerLinks.resources} />
            <FooterSection title="Company" links={footerLinks.company} />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-200/10 flex flex-col gap-6">
          <div className="bg-yellow-400/10 text-yellow-200 text-sm py-2 px-4 rounded-xl text-center backdrop-blur-sm border border-yellow-400/20">
            🚧 Website under development - Some features may not be available 🚧
          </div>
          <div className="text-center text-sm text-blue-200/70">
            &copy; {new Date().getFullYear()} QuizzQ. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
