'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Layout,
  Users,
  School,
  BookOpen,
  Settings,
  BarChart,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const sections = [
  {
    title: "User Management",
    description: "Manage students, teachers, and administrators",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "School Administration",
    description: "Configure school settings and manage classes",
    icon: School,
    color: "text-green-500",
  },
  {
    title: "Quiz System",
    description: "Create and manage quizzes and assessments",
    icon: BookOpen,
    color: "text-purple-500",
  },
  {
    title: "Settings & Configuration",
    description: "Customize the platform to your needs",
    icon: Settings,
    color: "text-orange-500",
  },
  {
    title: "Analytics & Reports",
    description: "Track performance and generate insights",
    icon: BarChart,
    color: "text-pink-500",
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

export default function PlatformOverviewPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Layout className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Learn about the key components and features of the QUIZZQ platform
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.title} variants={item}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-6 w-6 ${section.color}`} />
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3>Key Features</h3>
                    <ul>
                      {section.title === "User Management" && (
                        <>
                          <li>User role management and permissions</li>
                          <li>Bulk user import and export</li>
                          <li>User profile customization</li>
                        </>
                      )}
                      {section.title === "School Administration" && (
                        <>
                          <li>Class and section management</li>
                          <li>Teacher assignments</li>
                          <li>Academic calendar configuration</li>
                        </>
                      )}
                      {section.title === "Quiz System" && (
                        <>
                          <li>Multiple question types</li>
                          <li>Automated grading</li>
                          <li>Question bank management</li>
                        </>
                      )}
                      {section.title === "Settings & Configuration" && (
                        <>
                          <li>School branding customization</li>
                          <li>Notification preferences</li>
                          <li>System preferences</li>
                        </>
                      )}
                      {section.title === "Analytics & Reports" && (
                        <>
                          <li>Performance tracking</li>
                          <li>Custom report generation</li>
                          <li>Data visualization</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-muted p-6 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <p className="text-muted-foreground mb-4">
          To get started with QUIZZQ, we recommend following these steps:
        </p>
        <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
          <li>Complete your school profile setup</li>
          <li>Import or add your users (teachers and students)</li>
          <li>Create classes and assign teachers</li>
          <li>Configure your quiz settings</li>
          <li>Start creating and assigning quizzes</li>
        </ol>
      </motion.div>
    </div>
  );
}
