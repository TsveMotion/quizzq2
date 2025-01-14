'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  BarChart,
  Settings,
  Award,
  Percent,
  FileCheck,
  AlertTriangle,
  MessageCircle,
  Scale,
  History,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

const gradingFeatures = [
  {
    title: "Automatic Grading",
    description: "Instant grading for objective questions",
    icon: Calculator,
    color: "text-blue-300",
    details: [
      "Multiple choice grading",
      "True/False evaluation",
      "Matching questions",
      "Short answer matching",
    ],
  },
  {
    title: "Manual Grading",
    description: "Teacher evaluation for subjective questions",
    icon: FileCheck,
    color: "text-blue-300",
    details: [
      "Essay grading",
      "Project evaluation",
      "Code review",
      "Presentation scoring",
    ],
  },
  {
    title: "Grading Scales",
    description: "Flexible scoring systems",
    icon: Scale,
    color: "text-blue-300",
    details: [
      "Percentage scoring",
      "Letter grades",
      "Custom scales",
      "Pass/Fail grading",
    ],
  },
  {
    title: "Feedback System",
    description: "Comprehensive feedback mechanisms",
    icon: MessageCircle,
    color: "text-blue-300",
    details: [
      "Automated feedback",
      "Teacher comments",
      "Improvement suggestions",
      "Performance analysis",
    ],
  },
  {
    title: "Grade Analytics",
    description: "Detailed performance insights",
    icon: BarChart,
    color: "text-blue-300",
    details: [
      "Class averages",
      "Individual progress",
      "Trend analysis",
      "Performance comparison",
    ],
  },
  {
    title: "Grade History",
    description: "Track grade changes and updates",
    icon: History,
    color: "text-blue-300",
    details: [
      "Grade logs",
      "Change history",
      "Audit trail",
      "Version control",
    ],
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

export default function GradingSystemPage() {
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
            Grading System
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Grading System
        </h1>
        <p className="text-xl text-white/80">
          Learn about QUIZZQ&apos;s comprehensive grading and feedback system
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Important Note</AlertTitle>
        <AlertDescription className="text-white/80">
          Always review automated grades for accuracy and provide constructive feedback
          to help students improve their performance.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {gradingFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-blue-300" />
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/60">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                        <span className="text-white/80">{detail}</span>
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
        <h2 className="text-2xl font-bold mb-4 text-white">Grading Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Quiz submission", icon: FileCheck },
            { title: "Automatic grading", icon: Calculator },
            { title: "Manual review", icon: Settings },
            { title: "Feedback generation", icon: MessageCircle },
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200 border border-blue-200/20 backdrop-blur-sm">
                  {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-300" />
                  <p className="font-medium text-white">{step.title}</p>
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
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Grading Tips</h2>
        <ul className="space-y-2">
          {[
            "Set clear grading criteria before assigning quizzes",
            "Use rubrics for consistent evaluation",
            "Provide constructive feedback for improvement",
            "Monitor class performance trends",
            "Adjust difficulty based on analytics",
          ].map((tip, index) => (
            <motion.li
              key={tip}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-2 text-white/80"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
              {tip}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
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
