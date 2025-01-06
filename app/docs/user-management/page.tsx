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
    color: "text-blue-500",
  },
  {
    title: "User Roles",
    description: "Manage different user roles and permissions",
    icon: Shield,
    href: "/docs/user-management/roles",
    color: "text-green-500",
  },
  {
    title: "Student Management",
    description: "Add, edit, and organize student accounts",
    icon: GraduationCap,
    href: "/docs/user-management/students",
    color: "text-purple-500",
  },
  {
    title: "Teacher Management",
    description: "Manage teacher accounts and assignments",
    icon: UserCog,
    href: "/docs/user-management/teachers",
    color: "text-orange-500",
  },
  {
    title: "Templates",
    description: "Download CSV templates for bulk imports",
    icon: Download,
    href: "/docs/user-management/templates",
    color: "text-pink-500",
  },
  {
    title: "Data Management",
    description: "Export and manage user data",
    icon: FileSpreadsheet,
    href: "/docs/user-management/data",
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

export default function UserManagementPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        </div>
        <p className="text-xl text-muted-foreground">
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
        className="bg-muted rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
