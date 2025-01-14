'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Settings,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Calendar,
  Users,
  Sparkles,
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

const setupSections = [
  {
    title: "Basic Information",
    description: "Set up your school's core details",
    icon: Building2,
    items: [
      "School name and logo",
      "Contact information",
      "Address details",
      "Website URL",
    ],
  },
  {
    title: "Academic Settings",
    description: "Configure academic preferences",
    icon: Calendar,
    items: [
      "Academic year structure",
      "Term/semester dates",
      "Grading system",
      "Subject categories",
    ],
  },
  {
    title: "Communication",
    description: "Set up communication channels",
    icon: Mail,
    items: [
      "Email templates",
      "Notification preferences",
      "Parent communication",
      "Announcement settings",
    ],
  },
  {
    title: "User Settings",
    description: "Configure user-related settings",
    icon: Users,
    items: [
      "User roles and permissions",
      "Registration settings",
      "Password policies",
      "Account verification",
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

export default function SchoolSetupPage() {
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
            School Setup
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          School Setup
        </h1>
        <p className="text-xl text-white/80">
          Configure your school&apos;s settings and get started with QUIZZQ
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <Settings className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Initial Setup Required</AlertTitle>
        <AlertDescription className="text-white/80">
          Complete all sections below to fully set up your school on QUIZZQ.
          You can always modify these settings later through the School Admin Dashboard.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {setupSections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-blue-300" />
                    <CardTitle className="text-white">{section.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/60">{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, index) => (
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
        <h2 className="text-2xl font-bold mb-4 text-white">Setup Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Basic Information", icon: Building2 },
            { title: "Academic Settings", icon: Calendar },
            { title: "Communication Setup", icon: Mail },
            { title: "User Configuration", icon: Users },
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
            <Building2 className="h-4 w-4" />
            Start Setup
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <Settings className="h-4 w-4" />
            School Settings
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <Globe className="h-4 w-4" />
            Preview Profile
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
