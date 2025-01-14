'use client';

import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  School,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  Upload,
  UserPlus,
  Layout,
  Send,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    role: "admin",
    title: "School Administrator Setup",
    steps: [
      { title: "Log in with credentials", icon: School },
      { title: "Complete school profile", icon: Settings },
      { title: "Configure preferences", icon: Layout },
      { title: "Import or add users", icon: Upload },
    ],
  },
  {
    role: "teacher",
    title: "Teacher Onboarding",
    steps: [
      { title: "Accept invitation", icon: Send },
      { title: "Create account", icon: UserPlus },
      { title: "Complete profile", icon: Settings },
      { title: "Review classes", icon: BookOpen },
    ],
  },
  {
    role: "student",
    title: "Student Getting Started",
    steps: [
      { title: "Accept invitation", icon: Send },
      { title: "Set up account", icon: UserPlus },
      { title: "Join classes", icon: Users },
      { title: "Start learning", icon: GraduationCap },
    ],
  },
];

export default function QuickStartPage() {
  const [activeRole, setActiveRole] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const progress = ((activeStep + 1) / steps[activeRole].steps.length) * 100;

  return (
    <motion.div className="max-w-4xl space-y-8">
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
            Quick Start Guide
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Get Started with QuizzQ
        </h1>
        <p className="text-lg text-white/80">
          Get up and running with QuizzQ in minutes
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 text-white">
        <AlertCircle className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Before you begin</AlertTitle>
        <AlertDescription className="text-white/80">
          Make sure you have received your school&apos;s administrator credentials from the QuizzQ team.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {steps.map((section, index) => {
            const Icon = section.role === "admin" 
              ? School 
              : section.role === "teacher" 
                ? Users 
                : GraduationCap;
            
            return (
              <Button
                key={section.role}
                variant={activeRole === index ? "default" : "outline"}
                onClick={() => {
                  setActiveRole(index);
                  setActiveStep(0);
                }}
                className={`gap-2 ${
                  activeRole === index
                    ? "bg-white text-blue-600"
                    : "border-white/20 text-white hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.title}
              </Button>
            );
          })}
        </div>

        <Card className="relative overflow-hidden bg-white/10 border-white/20 backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-1">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <CardHeader>
            <CardTitle className="text-white">{steps[activeRole].title}</CardTitle>
            <CardDescription className="text-white/60">
              Follow these steps to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-white/20" />
              
              <div className="space-y-8">
                {steps[activeRole].steps.map((step, index) => {
                  const isActive = index === activeStep;
                  const isComplete = index < activeStep;
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-16"
                    >
                      <motion.div
                        className={`absolute left-7 -translate-x-1/2 flex h-4 w-4 items-center justify-center rounded-full ${
                          isComplete
                            ? "bg-blue-500 text-white"
                            : isActive
                            ? "bg-blue-500/20 text-blue-200"
                            : "bg-white/20"
                        }`}
                        animate={{
                          scale: isActive ? 1.2 : 1,
                        }}
                      >
                        {isComplete && <CheckCircle2 className="h-3 w-3" />}
                      </motion.div>

                      <div
                        className={`rounded-lg border border-white/20 p-4 transition-colors ${
                          isActive ? "bg-white/10" : "bg-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Icon className={`h-6 w-6 ${
                            isActive ? "text-blue-300" : "text-white/60"
                          }`} />
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              isActive ? "text-white" : "text-white/80"
                            }`}>
                              {step.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="border-white/20 text-white hover:bg-white/10 disabled:text-white/40"
          >
            Previous Step
          </Button>
          <Button
            onClick={() => setActiveStep(Math.min(steps[activeRole].steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps[activeRole].steps.length - 1}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-50"
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
