'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  School,
  Settings,
  Users,
  BookOpen,
  Calendar,
  Bell,
  BarChart,
  Building2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    title: "School Setup",
    description: "Configure your school's basic information and settings",
    icon: Building2,
    href: "/docs/school-admin/school-setup",
    color: "text-blue-300",
  },
  {
    title: "Class Management",
    description: "Create and manage classes, assign teachers and students",
    icon: BookOpen,
    href: "/docs/school-admin/class-management",
    color: "text-blue-300",
  },
  {
    title: "Teacher Assignment",
    description: "Assign teachers to classes and manage schedules",
    icon: Users,
    href: "/docs/school-admin/teacher-assignment",
    color: "text-blue-300",
  },
  {
    title: "Academic Calendar",
    description: "Set up terms, holidays, and important dates",
    icon: Calendar,
    href: "/docs/school-admin/calendar",
    color: "text-blue-300",
  },
  {
    title: "Notifications",
    description: "Configure school-wide notification settings",
    icon: Bell,
    href: "/docs/school-admin/notifications",
    color: "text-blue-300",
  },
  {
    title: "Reports & Analytics",
    description: "Access school-wide performance metrics and reports",
    icon: BarChart,
    href: "/docs/school-admin/reports",
    color: "text-blue-300",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SchoolAdminPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="flex items-center text-sm font-medium text-white">
            <Sparkles className="mr-2 h-4 w-4 text-blue-200" />
            School Administration
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          School Administration
        </h1>
        <p className="text-xl text-white/80">
          Manage your school&apos;s settings, classes, and administrative functions
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.title} variants={item}>
              <a href={feature.href}>
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-white/60">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </a>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Complete school profile", icon: Building2 },
            { title: "Set up academic calendar", icon: Calendar },
            { title: "Create classes", icon: BookOpen },
            { title: "Configure notifications", icon: Bell },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                  {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-300" />
                  <p className="font-medium text-white/80">{step.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2">
            <Settings className="h-4 w-4" />
            School Settings
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <BookOpen className="h-4 w-4" />
            Manage Classes
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <BarChart className="h-4 w-4" />
            View Reports
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
