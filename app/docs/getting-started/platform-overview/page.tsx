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
  Sparkles,
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
    color: "text-blue-300",
  },
  {
    title: "School Administration",
    description: "Configure school settings and manage classes",
    icon: School,
    color: "text-blue-300",
  },
  {
    title: "Quiz System",
    description: "Create and manage quizzes and assessments",
    icon: BookOpen,
    color: "text-blue-300",
  },
  {
    title: "Settings & Configuration",
    description: "Customize the platform to your needs",
    icon: Settings,
    color: "text-blue-300",
  },
  {
    title: "Analytics & Reports",
    description: "Track performance and generate insights",
    icon: BarChart,
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

export default function PlatformOverviewPage() {
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
            Platform Overview
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Platform Overview
        </h1>
        <p className="text-xl text-white/80">
          Learn about the key components and features of the QuizzQ platform
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
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-6 w-6 ${section.color}`} />
                    <CardTitle className="text-white">{section.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/60">{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-white">Key Features</h3>
                    <ul className="text-white/80 space-y-2">
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
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Getting Started</h2>
        <p className="text-white/80 mb-4">
          To get started with QuizzQ, we recommend following these steps:
        </p>
        <ol className="space-y-2 list-decimal list-inside text-white/70">
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
