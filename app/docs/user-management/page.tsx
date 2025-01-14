'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Upload,
  Download,
  FileSpreadsheet,
  UserCog,
  Shield,
  GraduationCap,
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

const features = [
  {
    title: "Bulk Import",
    description: "Import multiple users at once using CSV files",
    icon: Upload,
    href: "/docs/user-management/bulk-import",
    color: "text-blue-300",
  },
  {
    title: "User Roles",
    description: "Manage different user roles and permissions",
    icon: Shield,
    href: "/docs/user-management/roles",
    color: "text-blue-300",
  },
  {
    title: "Student Management",
    description: "Add, edit, and organize student accounts",
    icon: GraduationCap,
    href: "/docs/user-management/students",
    color: "text-blue-300",
  },
  {
    title: "Teacher Management",
    description: "Manage teacher accounts and assignments",
    icon: UserCog,
    href: "/docs/user-management/teachers",
    color: "text-blue-300",
  },
  {
    title: "Templates",
    description: "Download CSV templates for bulk imports",
    icon: Download,
    href: "/docs/user-management/templates",
    color: "text-blue-300",
  },
  {
    title: "Data Management",
    description: "Export and manage user data",
    icon: FileSpreadsheet,
    href: "/docs/user-management/data",
    color: "text-blue-300",
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

export default function UserManagementPage() {
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
            User Management
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          User Management
        </h1>
        <p className="text-xl text-white/80">
          Efficiently manage your school&apos;s users with our comprehensive tools and features
        </p>
      </motion.div>

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
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-white/60">{feature.description}</CardDescription>
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
        className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2">
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
