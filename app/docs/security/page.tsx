'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Key,
  Eye,
  UserCheck,
  AlertTriangle,
  FileCheck,
  History,
  FileText,
  Bell,
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

const features = [
  {
    title: "Data Protection",
    description: "Learn about our data protection measures",
    icon: Shield,
    href: "/docs/security/data-protection",
    color: "text-blue-500",
  },
  {
    title: "Access Control",
    description: "Configure user access and permissions",
    icon: Lock,
    href: "/docs/security/access-control",
    color: "text-green-500",
  },
  {
    title: "Authentication",
    description: "Set up and manage authentication methods",
    icon: Key,
    href: "/docs/security/authentication",
    color: "text-purple-500",
  },
  {
    title: "Privacy Settings",
    description: "Manage privacy and data sharing settings",
    icon: Eye,
    href: "/docs/security/privacy",
    color: "text-orange-500",
  },
  {
    title: "Audit Logs",
    description: "Track and monitor system activities",
    icon: History,
    href: "/docs/security/audit-logs",
    color: "text-pink-500",
  },
  {
    title: "Compliance",
    description: "Stay compliant with regulations",
    icon: FileCheck,
    href: "/docs/security/compliance",
    color: "text-yellow-500",
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

export default function SecurityPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Protect your school&apos;s data with our comprehensive security features
        </p>
      </motion.div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Security Notice</AlertTitle>
        <AlertDescription>
          Always follow security best practices and regularly review your security settings.
          Report any suspicious activity immediately to our support team.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.title} variants={item}>
              <a href={feature.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </a>
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
        <h2 className="text-2xl font-bold mb-4">Security Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Enable two-factor authentication", icon: Key },
            { title: "Regular security audits", icon: FileCheck },
            { title: "Monitor user activity", icon: Eye },
            { title: "Update security policies", icon: FileText },
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
        className="bg-muted rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Security Checkup
          </Button>
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Alert Settings
          </Button>
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            View Audit Logs
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
