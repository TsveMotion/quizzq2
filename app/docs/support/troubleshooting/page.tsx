'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Wifi,
  Monitor,
  Globe,
  Database,
  Lock,
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
import { Badge } from '@/components/ui/badge';

const troubleshootingCategories = [
  {
    title: "Connection Issues",
    description: "Resolve network and connection problems",
    icon: Wifi,
    issues: [
      {
        problem: "Cannot connect to QUIZZQ",
        solutions: [
          "Check your internet connection",
          "Clear browser cache and cookies",
          "Try a different browser",
          "Disable VPN or proxy",
        ],
        severity: "high",
      },
      {
        problem: "Quiz submission fails",
        solutions: [
          "Enable auto-save feature",
          "Check network stability",
          "Clear browser storage",
          "Update browser",
        ],
        severity: "high",
      },
    ],
  },
  {
    title: "Browser Problems",
    description: "Fix browser-related issues",
    icon: Globe,
    issues: [
      {
        problem: "Pages not loading correctly",
        solutions: [
          "Update to latest browser version",
          "Clear cache and cookies",
          "Disable browser extensions",
          "Try incognito mode",
        ],
        severity: "medium",
      },
      {
        problem: "Features not working",
        solutions: [
          "Enable JavaScript",
          "Allow cookies",
          "Check browser compatibility",
          "Update browser",
        ],
        severity: "medium",
      },
    ],
  },
  {
    title: "Quiz Issues",
    description: "Resolve quiz creation and taking problems",
    icon: Database,
    issues: [
      {
        problem: "Cannot create new quiz",
        solutions: [
          "Check permissions",
          "Clear form cache",
          "Verify question format",
          "Contact administrator",
        ],
        severity: "high",
      },
      {
        problem: "Grading not working",
        solutions: [
          "Check grading settings",
          "Verify answer key",
          "Reset grading cache",
          "Update scoring rules",
        ],
        severity: "high",
      },
    ],
  },
  {
    title: "Account Access",
    description: "Fix login and authentication issues",
    icon: Lock,
    issues: [
      {
        problem: "Cannot log in",
        solutions: [
          "Reset password",
          "Clear browser data",
          "Check email verification",
          "Contact support",
        ],
        severity: "critical",
      },
      {
        problem: "Session expires too quickly",
        solutions: [
          "Check remember me option",
          "Update browser settings",
          "Clear cookies",
          "Disable private browsing",
        ],
        severity: "medium",
      },
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

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/20 text-red-200 hover:bg-red-500/30';
    case 'high':
      return 'bg-orange-500/20 text-orange-200 hover:bg-orange-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30';
    default:
      return 'bg-blue-500/20 text-blue-200 hover:bg-blue-500/30';
  }
};

export default function TroubleshootingPage() {
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
            Troubleshooting
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Troubleshooting Guide
        </h1>
        <p className="text-xl text-white/80">
          Step-by-step solutions to common problems
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Before You Start</AlertTitle>
        <AlertDescription className="text-white/80">
          Try refreshing your browser and clearing cache before following these steps.
          If problems persist, follow the relevant troubleshooting guide below.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-8"
      >
        {troubleshootingCategories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.div key={category.title} variants={item}>
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-6 w-6 text-blue-300" />
                <h2 className="text-2xl font-bold text-white">{category.title}</h2>
              </div>
              <p className="mb-6 text-white/60">{category.description}</p>
              <div className="space-y-4">
                {category.issues.map((issue, index) => (
                  <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{issue.problem}</CardTitle>
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {issue.solutions.map((solution, sIndex) => (
                          <motion.li
                            key={sIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * sIndex }}
                            className="flex items-center gap-2"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-200 text-sm">
                              {sIndex + 1}
                            </div>
                            <span className="text-white/80">{solution}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Service Status</h3>
            <ul className="space-y-2">
              {[
                { name: "Quiz System", status: "operational" },
                { name: "Grading System", status: "operational" },
                { name: "User Authentication", status: "operational" },
                { name: "File Upload", status: "operational" },
              ].map((service) => (
                <motion.li
                  key={service.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-white/80">{service.name}</span>
                  <div className="flex items-center gap-2">
                    {service.status === "operational" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 gap-2">
                <RefreshCw className="h-4 w-4" />
                Run System Check
              </Button>
              <Button className="w-full bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 gap-2">
                <Monitor className="h-4 w-4" />
                Test Connection
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-between items-center"
      >
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          <ArrowRight className="h-4 w-4 rotate-180" />
          Contact Support
        </Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          Support Home
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
