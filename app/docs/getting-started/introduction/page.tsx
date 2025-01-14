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
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';

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
    color: "text-blue-300",
  },
  {
    icon: Award,
    title: "Automated Grading",
    description: "Save time with automatic quiz grading",
    color: "text-blue-300",
  },
  {
    icon: BarChart,
    title: "Student Analytics",
    description: "Track student performance and identify areas for improvement",
    color: "text-blue-300",
  },
  {
    icon: School,
    title: "School Management",
    description: "Efficiently manage teachers, students, and classes",
    color: "text-blue-300",
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
    <div className="min-h-screen bg-[#1a237e] relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-purple-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-500/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <motion.div className="max-w-4xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md"
              >
                <span className="flex items-center text-sm font-medium text-white">
                  <Sparkles className="mr-2 h-4 w-4 text-blue-200" />
                  Getting Started Guide
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
                Welcome to QuizzQ
              </h1>
              <p className="text-xl text-white/80">
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
                  <Card className="bg-white/10 hover:bg-white/15 transition-all border-white/20 backdrop-blur-sm group">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                        <CardTitle className="text-white">{feature.title}</CardTitle>
                      </div>
                      <CardDescription className="text-white/70">{feature.description}</CardDescription>
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
              <h2 className="text-2xl font-bold tracking-tight text-white">Who is it for?</h2>
              <div className="flex flex-wrap gap-4 mb-6">
                {roles.map((role, index) => {
                  const Icon = role.icon;
                  return (
                    <Button
                      key={role.title}
                      variant={activeRole === index ? "default" : "outline"}
                      className={`gap-2 ${
                        activeRole === index
                          ? "bg-white text-blue-600"
                          : "border-white/20 text-white hover:bg-white/10"
                      }`}
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
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = roles[activeRole].icon;
                        return <Icon className="h-6 w-6 text-blue-300" />;
                      })()}
                      <CardTitle className="text-white">{roles[activeRole].title}</CardTitle>
                    </div>
                    <CardDescription className="text-white/70">{roles[activeRole].description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {roles[activeRole].features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2 text-sm text-white/80"
                        >
                          <div className="h-2 w-2 rounded-full bg-blue-300" />
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
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-4 text-white">Getting Started</h2>
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200 backdrop-blur-sm">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium text-white/80">{step.title}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold mb-4 text-white">Ready to dive in?</h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2"
                >
                  <Link href="/docs/getting-started/quick-start">
                    <BookOpen className="h-4 w-4" />
                    Quick Start Guide
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 gap-2"
                >
                  <Link href="/docs/getting-started/school-setup">
                    <School className="h-4 w-4" />
                    School Setup
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
