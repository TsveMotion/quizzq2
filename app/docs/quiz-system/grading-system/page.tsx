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
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const gradingFeatures = [
  {
    title: "Automatic Grading",
    description: "Instant grading for objective questions",
    icon: Calculator,
    color: "text-blue-500",
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
    color: "text-green-500",
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
    color: "text-purple-500",
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
    color: "text-orange-500",
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
    color: "text-pink-500",
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
    color: "text-yellow-500",
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
        <div className="flex items-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Grading System</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Learn about QUIZZQ&apos;s comprehensive grading and feedback system
        </p>
      </motion.div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
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
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
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
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{detail}</span>
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
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Grading Process</h2>
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
        className="bg-muted p-6 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Grading Tips</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Set clear grading criteria before assigning quizzes</li>
          <li>• Use rubrics for consistent evaluation</li>
          <li>• Provide constructive feedback for improvement</li>
          <li>• Monitor class performance trends</li>
          <li>• Adjust difficulty based on analytics</li>
        </ul>
      </motion.div>
    </div>
  );
}
