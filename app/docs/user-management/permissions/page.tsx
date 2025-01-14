'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Shield,
  Settings,
  Eye,
  EyeOff,
  FileEdit,
  Trash2,
  Plus,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const permissionCategories = [
  {
    title: "User Management",
    description: "Permissions related to user accounts",
    icon: Shield,
    color: "text-blue-300",
    permissions: [
      {
        name: "Create Users",
        icon: Plus,
        superAdmin: true,
        schoolAdmin: true,
        teacher: false,
        student: false,
      },
      {
        name: "Edit Users",
        icon: FileEdit,
        superAdmin: true,
        schoolAdmin: true,
        teacher: false,
        student: false,
      },
      {
        name: "Delete Users",
        icon: Trash2,
        superAdmin: true,
        schoolAdmin: false,
        teacher: false,
        student: false,
      },
      {
        name: "View Users",
        icon: Eye,
        superAdmin: true,
        schoolAdmin: true,
        teacher: true,
        student: false,
      },
    ],
  },
  {
    title: "Quiz Management",
    description: "Permissions for quiz creation and management",
    icon: FileEdit,
    color: "text-blue-300",
    permissions: [
      {
        name: "Create Quizzes",
        icon: Plus,
        superAdmin: true,
        schoolAdmin: true,
        teacher: true,
        student: false,
      },
      {
        name: "Edit Quizzes",
        icon: FileEdit,
        superAdmin: true,
        schoolAdmin: true,
        teacher: true,
        student: false,
      },
      {
        name: "Delete Quizzes",
        icon: Trash2,
        superAdmin: true,
        schoolAdmin: true,
        teacher: true,
        student: false,
      },
      {
        name: "View Results",
        icon: Eye,
        superAdmin: true,
        schoolAdmin: true,
        teacher: true,
        student: true,
      },
    ],
  },
  {
    title: "System Settings",
    description: "System configuration permissions",
    icon: Settings,
    color: "text-blue-300",
    permissions: [
      {
        name: "Manage Settings",
        icon: Settings,
        superAdmin: true,
        schoolAdmin: false,
        teacher: false,
        student: false,
      },
      {
        name: "View Settings",
        icon: Eye,
        superAdmin: true,
        schoolAdmin: true,
        teacher: false,
        student: false,
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

export default function PermissionsPage() {
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
            Permissions
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Permissions
        </h1>
        <p className="text-xl text-white/80">
          Detailed overview of system permissions by user role
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <Shield className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Permission Management</AlertTitle>
        <AlertDescription className="text-white/80">
          Permissions are tied to user roles and determine what actions users can perform.
          Super Admins can modify role permissions through the system settings.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {permissionCategories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.div key={category.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-6 w-6 ${category.color}`} />
                    <CardTitle className="text-white">{category.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/60">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-white/10">
                          <th className="pb-2 text-white/80">Permission</th>
                          <th className="pb-2 text-white/80">Super Admin</th>
                          <th className="pb-2 text-white/80">School Admin</th>
                          <th className="pb-2 text-white/80">Teacher</th>
                          <th className="pb-2 text-white/80">Student</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.permissions.map((permission, index) => {
                          const Icon = permission.icon;
                          return (
                            <tr key={permission.name} className="border-b border-white/10 last:border-0">
                              <td className="py-2 text-white/80">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4 text-blue-300" />
                                  {permission.name}
                                </div>
                              </td>
                              <td className="py-2">{permission.superAdmin ? <Check className="h-4 w-4 text-blue-300" /> : <X className="h-4 w-4 text-red-400" />}</td>
                              <td className="py-2">{permission.schoolAdmin ? <Check className="h-4 w-4 text-blue-300" /> : <X className="h-4 w-4 text-red-400" />}</td>
                              <td className="py-2">{permission.teacher ? <Check className="h-4 w-4 text-blue-300" /> : <X className="h-4 w-4 text-red-400" />}</td>
                              <td className="py-2">{permission.student ? <Check className="h-4 w-4 text-blue-300" /> : <X className="h-4 w-4 text-red-400" />}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
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
        <h2 className="text-xl font-semibold mb-4 text-white">Permission Notes</h2>
        <ul className="space-y-2 text-white/60">
          <li>• Permissions are cumulative - higher roles include lower role permissions</li>
          <li>• Custom permissions can be configured by Super Admins</li>
          <li>• Changes to permissions require system restart</li>
          <li>• Audit logs track permission changes</li>
        </ul>
      </motion.div>
    </div>
  );
}
