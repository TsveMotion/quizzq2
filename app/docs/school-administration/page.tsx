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
    href: "/docs/school-administration/setup",
    color: "text-blue-500",
  },
  {
    title: "Class Management",
    description: "Create and manage classes, assign teachers and students",
    icon: BookOpen,
    href: "/docs/school-administration/classes",
    color: "text-green-500",
  },
  {
    title: "Academic Calendar",
    description: "Set up terms, holidays, and important dates",
    icon: Calendar,
    href: "/docs/school-administration/calendar",
    color: "text-purple-500",
  },
  {
    title: "Notifications",
    description: "Configure school-wide notification settings",
    icon: Bell,
    href: "/docs/school-administration/notifications",
    color: "text-orange-500",
  },
  {
    title: "Reports & Analytics",
    description: "Access school-wide performance metrics and reports",
    icon: BarChart,
    href: "/docs/school-administration/reports",
    color: "text-pink-500",
  },
  {
    title: "Staff Management",
    description: "Manage administrative staff and their roles",
    icon: Users,
    href: "/docs/school-administration/staff",
    color: "text-yellow-500",
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

export default function SchoolAdministrationPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <School className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">School Administration</h1>
        </div>
        <p className="text-xl text-muted-foreground">
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
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
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
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="font-medium">{step.title}</p>
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
        className="bg-muted rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" className="gap-2">
            <Settings className="h-4 w-4" />
            School Settings
          </Button>
          <Button variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Manage Classes
          </Button>
          <Button variant="outline" className="gap-2">
            <BarChart className="h-4 w-4" />
            View Reports
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
