'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  PenTool,
  Settings,
  Clock,
  CheckCircle,
  FileQuestion,
  Sparkles,
  BookOpen,
  Timer,
  ArrowRight,
  List,
  MessageSquare,
  ToggleLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const questionTypes = [
  {
    title: "Multiple Choice",
    description: "Students select one correct answer from multiple options",
    details: "Best for: Testing specific knowledge, vocabulary, or concepts with clear right/wrong answers",
    badge: "Basic",
    icon: List,
  },
  {
    title: "Multiple Answer",
    description: "Students select all applicable correct answers",
    details: "Best for: Complex topics where multiple factors or elements are correct",
    badge: "Intermediate",
    icon: CheckCircle,
  },
  {
    title: "True/False",
    description: "Students determine if a statement is true or false",
    details: "Best for: Quick fact checking and basic understanding",
    badge: "Basic",
    icon: ToggleLeft,
  },
  {
    title: "Short Answer",
    description: "Students provide a brief written response",
    details: "Best for: Testing deeper understanding and explanation abilities",
    badge: "Advanced",
    icon: MessageSquare,
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

export default function CreatingQuizzesPage() {
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
            Creating Quizzes
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Creating Quizzes
        </h1>
        <p className="text-xl text-white/80">
          Learn how to create effective quizzes in QUIZZQ
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <PenTool className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Quiz Creation Process</AlertTitle>
        <AlertDescription className="text-white/80">
          Creating a quiz in QUIZZQ is straightforward and flexible. Follow these steps to create
          engaging quizzes for your students.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {[
          {
            title: "Basic Setup",
            items: ["Name your quiz", "Set time limit", "Choose subject/topic", "Add description"],
            icon: Settings,
          },
          {
            title: "Add Questions",
            items: ["Select question type", "Enter question content", "Add answer options", "Set correct answers"],
            icon: FileQuestion,
          },
          {
            title: "Configure Settings",
            items: ["Set passing score", "Choose display options", "Configure attempts allowed", "Set availability window"],
            icon: Timer,
          },
          {
            title: "Review & Publish",
            items: ["Preview quiz", "Check all questions", "Verify settings", "Publish or save draft"],
            icon: CheckCircle,
          },
        ].map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-blue-300" />
                    <CardTitle className="text-white">Step {index + 1}: {section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="flex items-center gap-2 text-white/80"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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
        <h2 className="text-2xl font-bold mb-4 text-white">Question Types</h2>
        <div className="grid grid-cols-1 gap-4">
          {questionTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-blue-300" />
                        <CardTitle className="text-white">{type.title}</CardTitle>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30">{type.badge}</Badge>
                    </div>
                    <CardDescription className="text-white/60">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/80">{type.details}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Question Design</h3>
            <ul className="space-y-2">
              {[
                "Keep questions clear and concise",
                "Use a mix of question types",
                "Include detailed feedback",
                "Structure from easy to difficult",
              ].map((practice, index) => (
                <motion.li
                  key={practice}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2 text-white/80"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  {practice}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quiz Settings</h3>
            <ul className="space-y-2">
              {[
                "Set appropriate time limits",
                "Consider question complexity",
                "Configure attempt settings",
                "Preview student experience",
              ].map((practice, index) => (
                <motion.li
                  key={practice}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2 text-white/80"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  {practice}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2">
            <PenTool className="h-4 w-4" />
            Create New Quiz
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <BookOpen className="h-4 w-4" />
            View Templates
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <FileQuestion className="h-4 w-4" />
            Question Bank
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex justify-between items-center"
      >
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Quiz System
        </Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          Question Types
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
