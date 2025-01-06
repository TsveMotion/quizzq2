'use client';

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  GraduationCap,
  School,
  Award,
  BarChart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: BookOpen,
    title: "Quiz Creation",
    description: "Create diverse quiz types with multiple question formats",
    color: "text-blue-500",
  },
  {
    icon: Award,
    title: "Automated Grading",
    description: "Save time with automatic quiz grading",
    color: "text-green-500",
  },
  {
    icon: BarChart,
    title: "Student Analytics",
    description: "Track student performance and identify areas for improvement",
    color: "text-purple-500",
  },
  {
    icon: School,
    title: "School Management",
    description: "Efficiently manage teachers, students, and classes",
    color: "text-orange-500",
  },
];

const roles = [
  {
    icon: GraduationCap,
    title: "School Administrators",
    description: "Manage your entire school's quiz system from a centralized dashboard.",
    features: ["User Management", "Performance Monitoring", "School Settings"],
  },
  {
    icon: Users,
    title: "Teachers",
    description: "Create quizzes and track student progress with ease.",
    features: ["Quiz Creation", "Grade Management", "Student Reports"],
  },
  {
    icon: School,
    title: "Students",
    description: "Take quizzes and track your learning progress.",
    features: ["Quiz Taking", "Progress Tracking", "Performance Analytics"],
  },
];

export default function IntroductionPage() {
  const [activeRole, setActiveRole] = useState(0);

  return (
    <motion.div className="max-w-4xl space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Welcome to QUIZZQ</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          The modern quiz platform that makes learning fun and efficient
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={item}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold tracking-tight">Who is it for?</h2>
        <div className="flex gap-4 mb-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Button
                key={role.title}
                variant={activeRole === index ? "default" : "outline"}
                className="gap-2"
                onClick={() => setActiveRole(index)}
              >
                <Icon className="h-4 w-4" />
                {role.title}
              </Button>
            );
          })}
        </div>

        <motion.div
          key={activeRole}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = roles[activeRole].icon;
                  return <Icon className="h-6 w-6 text-primary" />;
                })()}
                <CardTitle>{roles[activeRole].title}</CardTitle>
              </div>
              <CardDescription>{roles[activeRole].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles[activeRole].features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {feature}
                  </motion.div>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Set up your school account", delay: 0 },
            { title: "Import or add teachers and students", delay: 0.1 },
            { title: "Create classes and assign teachers", delay: 0.2 },
            { title: "Start creating and assigning quizzes", delay: 0.3 },
          ].map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + step.delay }}
              className="flex items-center gap-4"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {index + 1}
              </div>
              <p className="text-sm font-medium">{step.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-muted rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Ready to dive in?</h3>
        <div className="flex gap-4">
          <Button variant="default" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Quick Start Guide
          </Button>
          <Button variant="outline" className="gap-2">
            <School className="h-4 w-4" />
            School Setup
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
