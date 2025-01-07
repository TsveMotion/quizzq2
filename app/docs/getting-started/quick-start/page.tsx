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
        <h1 className="text-3xl font-bold tracking-tight">Quick Start Guide</h1>
        <p className="text-lg text-muted-foreground">
          Get up and running with QUIZZQ in minutes
        </p>
      </motion.div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Before you begin</AlertTitle>
        <AlertDescription>
          Make sure you have received your school&apos;s administrator credentials from the QUIZZQ team.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <div className="flex gap-4">
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
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {section.title}
              </Button>
            );
          })}
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <CardHeader>
            <CardTitle>{steps[activeRole].title}</CardTitle>
            <CardDescription>
              Follow these steps to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-muted-foreground/20" />
              
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
                            ? "bg-primary text-primary-foreground"
                            : isActive
                            ? "bg-primary/20 text-primary"
                            : "bg-muted-foreground/20"
                        }`}
                        animate={{
                          scale: isActive ? 1.2 : 1,
                        }}
                      >
                        {isComplete && <CheckCircle2 className="h-3 w-3" />}
                      </motion.div>

                      <div
                        className={`rounded-lg border p-4 ${
                          isActive ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Icon className={`h-6 w-6 ${
                            isActive ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              isActive ? "text-primary" : ""
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
          >
            Previous Step
          </Button>
          <Button
            onClick={() => setActiveStep(Math.min(steps[activeRole].steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps[activeRole].steps.length - 1}
            className="gap-2"
          >
            Next Step
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
