'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  School,
  GraduationCap,
  UserCog,
  Settings,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const roles = [
  {
    title: "Super Admin",
    description: "Full system access and control",
    icon: Shield,
    color: "text-red-500",
    permissions: [
      "Manage all school settings",
      "Create and manage admin accounts",
      "Access system-wide analytics",
      "Configure system settings",
      "Manage all user accounts",
    ],
  },
  {
    title: "School Admin",
    description: "School-level administration",
    icon: School,
    color: "text-blue-500",
    permissions: [
      "Manage school settings",
      "Create teacher accounts",
      "Manage classes and sections",
      "View school analytics",
      "Configure school preferences",
    ],
  },
  {
    title: "Teacher",
    description: "Class management and quiz creation",
    icon: UserCog,
    color: "text-green-500",
    permissions: [
      "Create and manage quizzes",
      "Grade assignments",
      "View class analytics",
      "Communicate with students",
      "Manage class content",
    ],
  },
  {
    title: "Student",
    description: "Quiz taking and progress tracking",
    icon: GraduationCap,
    color: "text-purple-500",
    permissions: [
      "Take assigned quizzes",
      "View personal progress",
      "Access learning materials",
      "Submit assignments",
      "View grades and feedback",
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

export default function UserRolesPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">User Roles</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Understanding user roles and their permissions in QUIZZQ
        </p>
      </motion.div>

      <Alert>
        <Settings className="h-4 w-4" />
        <AlertTitle>Role Management</AlertTitle>
        <AlertDescription>
          User roles determine what actions and features are available to each user.
          Make sure to assign appropriate roles based on user responsibilities.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <motion.div key={role.title} variants={item}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-6 w-6 ${role.color}`} />
                    <CardTitle>{role.title}</CardTitle>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">Key Permissions</h3>
                  <ul className="space-y-2">
                    {role.permissions.map((permission, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{permission}</span>
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
        transition={{ delay: 0.8 }}
        className="bg-muted p-6 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Role Assignment Guidelines</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Assign roles based on user responsibilities and requirements</li>
          <li>• Regularly review and update role assignments</li>
          <li>• Follow the principle of least privilege</li>
          <li>• Document any custom role configurations</li>
        </ul>
      </motion.div>
    </div>
  );
}
