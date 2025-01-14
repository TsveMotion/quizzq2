'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  ClipboardList,
  Sparkles,
  UserPlus,
  School,
  Clock,
  FileText,
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

const assignmentFeatures = [
  {
    title: "Teacher Selection",
    description: "Choose and assign teachers to classes",
    icon: GraduationCap,
    items: [
      "Teacher qualifications",
      "Subject expertise",
      "Experience level",
      "Availability status",
    ],
  },
  {
    title: "Class Assignment",
    description: "Manage class and subject assignments",
    icon: BookOpen,
    items: [
      "Subject allocation",
      "Class schedule",
      "Teaching load",
      "Room assignment",
    ],
  },
  {
    title: "Schedule Management",
    description: "Organize teaching schedules",
    icon: Calendar,
    items: [
      "Time slots",
      "Weekly schedule",
      "Term planning",
      "Substitute coverage",
    ],
  },
  {
    title: "Performance Tracking",
    description: "Monitor teaching effectiveness",
    icon: ClipboardList,
    items: [
      "Student feedback",
      "Class performance",
      "Attendance records",
      "Teaching evaluations",
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

export default function TeacherAssignmentPage() {
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
            Teacher Assignment
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Teacher Assignment
        </h1>
        <p className="text-xl text-white/80">
          Assign teachers to classes and manage their teaching schedules
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <School className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Optimize Teaching Assignments</AlertTitle>
        <AlertDescription className="text-white/80">
          Match teachers with appropriate classes based on their expertise and availability.
          Ensure balanced workload distribution and efficient schedule management.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {assignmentFeatures.map((feature) => {
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
                    {feature.items.map((item, index) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
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
        <h2 className="text-2xl font-bold mb-4 text-white">Assignment Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Select Teacher", icon: GraduationCap },
            { title: "Choose Classes", icon: BookOpen },
            { title: "Set Schedule", icon: Calendar },
            { title: "Review & Confirm", icon: ClipboardList },
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                  {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-300" />
                  <p className="font-medium text-white/80">{step.title}</p>
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
        className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2">
            <UserPlus className="h-4 w-4" />
            Assign Teacher
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <Calendar className="h-4 w-4" />
            View Schedule
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <FileText className="h-4 w-4" />
            Assignment Report
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
