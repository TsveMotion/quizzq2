'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  PenTool,
  Timer,
  Settings,
  BarChart,
  FileText,
  CheckCircle,
  HelpCircle,
  Clock,
  FileQuestion,
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
    title: "Creating Quizzes",
    description: "Learn how to create and customize quizzes",
    icon: PenTool,
    href: "/docs/quiz-system/creating-quizzes",
    color: "text-blue-500",
  },
  {
    title: "Question Types",
    description: "Explore different types of questions available",
    icon: FileQuestion,
    href: "/docs/quiz-system/question-types",
    color: "text-green-500",
  },
  {
    title: "Quiz Settings",
    description: "Configure time limits, attempts, and grading options",
    icon: Settings,
    href: "/docs/quiz-system/settings",
    color: "text-purple-500",
  },
  {
    title: "Grading & Feedback",
    description: "Set up grading criteria and provide feedback",
    icon: CheckCircle,
    href: "/docs/quiz-system/grading",
    color: "text-orange-500",
  },
  {
    title: "Analytics",
    description: "View and analyze quiz performance data",
    icon: BarChart,
    href: "/docs/quiz-system/analytics",
    color: "text-pink-500",
  },
  {
    title: "Question Bank",
    description: "Manage and reuse questions across quizzes",
    icon: FileText,
    href: "/docs/quiz-system/question-bank",
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

export default function QuizSystemPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Quiz System</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Create, manage, and analyze quizzes with our comprehensive quiz system
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
        <h2 className="text-2xl font-bold mb-4">Quiz Creation Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Set quiz parameters", icon: Settings },
            { title: "Add questions", icon: FileQuestion },
            { title: "Configure time limits", icon: Timer },
            { title: "Preview and publish", icon: CheckCircle },
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
            <PenTool className="h-4 w-4" />
            Create Quiz
          </Button>
          <Button variant="outline" className="gap-2">
            <FileQuestion className="h-4 w-4" />
            Question Bank
          </Button>
          <Button variant="outline" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Quiz Templates
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
