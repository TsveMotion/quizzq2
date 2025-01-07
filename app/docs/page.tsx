'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FeatureCard {
  title: string;
  description: string;
  icon: any;
  href: string;
}

const features: FeatureCard[] = [
  {
    title: "Getting Started",
    description: "Learn the basics of QUIZZQ and get your school set up quickly.",
    icon: BookOpen,
    href: "/docs/getting-started/introduction",
  },
  {
    title: "User Management",
    description: "Manage teachers, students, and staff with bulk imports and role assignments.",
    icon: Users,
    href: "/docs/user-management/bulk-import",
  },
  {
    title: "Quiz System",
    description: "Create, manage, and grade quizzes effectively.",
    icon: FileText,
    href: "/docs/quiz-system/creating-quizzes",
  },
  {
    title: "Security & Compliance",
    description: "Understand our security measures and compliance standards.",
    icon: Shield,
    href: "/docs/security/data-protection",
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Everything you need to know about QUIZZQ
        </p>
      </div>

      <Alert 
        variant="default" 
        className="border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800/30 dark:bg-yellow-900/10 dark:text-yellow-500 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-500"
      >
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Beta Testing</AlertTitle>
        <AlertDescription>
          QUIZZQ is currently in Beta Testing and Development. Some features may be incomplete or not functioning as expected.
          We appreciate your patience and feedback as we continue to improve the platform.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <feature.icon className="h-5 w-5" />
                <CardTitle>{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Popular Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bulk Import Users</CardTitle>
              <CardDescription>Learn how to import multiple users at once</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quiz Creation Guide</CardTitle>
              <CardDescription>Step-by-step guide to creating effective quizzes</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Class Management</CardTitle>
              <CardDescription>Organize and manage your school classes</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grading System</CardTitle>
              <CardDescription>Understanding the quiz grading system</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
