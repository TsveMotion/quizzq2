'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Search,
  GraduationCap,
  Users,
  Settings,
  FileText,
  BookOpen,
  Code2,
  Shield,
  HelpCircle,
} from "lucide-react";

interface DocSection {
  title: string;
  href: string;
  icon: any;
  items: {
    title: string;
    href: string;
  }[];
}

const docSections: DocSection[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: BookOpen,
    items: [
      { title: "Introduction", href: "/docs/getting-started/introduction" },
      { title: "Quick Start", href: "/docs/getting-started/quick-start" },
      { title: "Platform Overview", href: "/docs/getting-started/platform-overview" },
    ],
  },
  {
    title: "User Management",
    href: "/docs/user-management",
    icon: Users,
    items: [
      { title: "Bulk Import", href: "/docs/user-management/bulk-import" },
      { title: "User Roles", href: "/docs/user-management/user-roles" },
      { title: "Permissions", href: "/docs/user-management/permissions" },
    ],
  },
  {
    title: "School Administration",
    href: "/docs/school-admin",
    icon: GraduationCap,
    items: [
      { title: "School Setup", href: "/docs/school-admin/school-setup" },
      { title: "Class Management", href: "/docs/school-admin/class-management" },
      { title: "Teacher Assignment", href: "/docs/school-admin/teacher-assignment" },
    ],
  },
  {
    title: "Quiz System",
    href: "/docs/quiz-system",
    icon: FileText,
    items: [
      { title: "Creating Quizzes", href: "/docs/quiz-system/creating-quizzes" },
      { title: "Question Types", href: "/docs/quiz-system/question-types" },
      { title: "Grading System", href: "/docs/quiz-system/grading-system" },
    ],
  },
  {
    title: "API Reference",
    href: "/docs/api",
    icon: Code2,
    items: [
      { title: "Authentication", href: "/docs/api/authentication" },
      { title: "Endpoints", href: "/docs/api/endpoints" },
      { title: "Rate Limits", href: "/docs/api/rate-limits" },
    ],
  },
  {
    title: "Security",
    href: "/docs/security",
    icon: Shield,
    items: [
      { title: "Data Protection", href: "/docs/security/data-protection" },
      { title: "Privacy Policy", href: "/docs/security/privacy-policy" },
      { title: "Compliance", href: "/docs/security/compliance" },
    ],
  },
  {
    title: "Support",
    href: "/docs/support",
    icon: HelpCircle,
    items: [
      { title: "FAQs", href: "/docs/support/faqs" },
      { title: "Contact Support", href: "/docs/support/contact" },
      { title: "Troubleshooting", href: "/docs/support/troubleshooting" },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  const filteredSections = docSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(section =>
    section.title.toLowerCase().includes(search.toLowerCase()) ||
    section.items.length > 0
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#1a237e]">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/10 bg-white/5 backdrop-blur-md flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search documentation..."
              className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {filteredSections.map((section) => (
              <div key={section.href} className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-sm text-white/80">
                  <section.icon className="h-4 w-4 text-blue-300" />
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-md px-2 py-1 transition-colors",
                        pathname === item.href && "text-white bg-white/10"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
