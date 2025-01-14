'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Shield, AlertTriangle, Search, ArrowRight, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';

interface FeatureCard {
  title: string;
  description: string;
  icon: any;
  href: string;
}

const features: FeatureCard[] = [
  {
    title: "Getting Started",
    description: "Learn the basics of QuizzQ and get your school set up quickly.",
    icon: BookOpen,
    href: "/docs/getting-started/introduction",
  },
  {
    title: "User Management",
    description: "Manage teachers, students, and staff with bulk imports and role assignments.",
    icon: Users,
    href: "/docs/user-management/bulk-import",
  },
  {
    title: "Quiz System",
    description: "Create, manage, and grade quizzes effectively.",
    icon: FileText,
    href: "/docs/quiz-system/creating-quizzes",
  },
  {
    title: "Security & Compliance",
    description: "Understand our security measures and compliance standards.",
    icon: Shield,
    href: "/docs/security/data-protection",
  },
];

const popularArticles = [
  {
    title: "Bulk Import Users",
    description: "Learn how to import multiple users at once",
    href: "/docs/user-management/bulk-import",
  },
  {
    title: "Quiz Creation Guide",
    description: "Step-by-step guide to creating effective quizzes",
    href: "/docs/quiz-system/creating-quizzes",
  },
  {
    title: "Class Management",
    description: "Organize and manage your school classes",
    href: "/docs/class-management",
  },
  {
    title: "Grading System",
    description: "Understanding the quiz grading system",
    href: "/docs/quiz-system/grading",
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#1a237e] relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-purple-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-500/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Beta Banner */}
      <div className="relative z-20 bg-yellow-400/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-yellow-200">
            <AlertTriangle className="h-5 w-5" />
            <p>QuizzQ is currently in beta. Some features may be incomplete or under development.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Hero Section */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md"
            >
              <span className="flex items-center text-sm font-medium text-white">
                <Sparkles className="mr-2 h-4 w-4 text-blue-200" />
                Documentation & Guides
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white"
            >
              Everything you need to know
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
                />
                <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
              </div>
            </motion.div>
          </div>

          {/* Main Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <Link href={feature.href} key={feature.title}>
                <Card className="h-full bg-white/10 hover:bg-white/15 transition-all border-white/20 backdrop-blur-sm group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-6 w-6 text-blue-300" />
                      <div>
                        <CardTitle className="text-white group-hover:text-blue-200 transition-colors">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-white/70">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </motion.div>

          {/* Popular Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold tracking-tight text-white">Popular Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularArticles.map((article, index) => (
                <Link href={article.href} key={article.title}>
                  <Card className="bg-white/10 hover:bg-white/15 transition-all border-white/20 backdrop-blur-sm group">
                    <CardHeader>
                      <CardTitle className="text-lg text-white group-hover:text-blue-200 transition-colors flex items-center justify-between">
                        {article.title}
                        <ArrowRight className="h-4 w-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
