'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Key,
  Lock,
  FileJson,
  Webhook,
  Network,
  BookOpen,
  Shield,
  Zap,
  RefreshCw,
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
    title: "Authentication",
    description: "Learn how to authenticate with the QUIZZQ API",
    icon: Key,
    href: "/docs/api-reference/authentication",
    color: "text-blue-500",
  },
  {
    title: "Endpoints",
    description: "Explore available API endpoints and their usage",
    icon: Network,
    href: "/docs/api-reference/endpoints",
    color: "text-green-500",
  },
  {
    title: "Rate Limits",
    description: "Understand API rate limits and quotas",
    icon: RefreshCw,
    href: "/docs/api-reference/rate-limits",
    color: "text-purple-500",
  },
  {
    title: "Webhooks",
    description: "Set up and manage webhook integrations",
    icon: Webhook,
    href: "/docs/api-reference/webhooks",
    color: "text-orange-500",
  },
  {
    title: "Response Formats",
    description: "Learn about API response structures",
    icon: FileJson,
    href: "/docs/api-reference/responses",
    color: "text-pink-500",
  },
  {
    title: "Security",
    description: "Best practices for secure API usage",
    icon: Shield,
    href: "/docs/api-reference/security",
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

const CodeExample = ({ children }: { children: React.ReactNode }) => (
  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
    <code className="text-sm text-muted-foreground">{children}</code>
  </pre>
);

export default function ApiReferencePage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Code2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">API Reference</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Integrate QUIZZQ into your applications with our comprehensive API
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
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold">Quick Start</h2>
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Authenticate your requests using an API key in the Authorization header
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeExample>
              {`curl -X GET https://api.quizzq.com/v1/quizzes \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            </CodeExample>
            <Button variant="outline" className="gap-2">
              <Key className="h-4 w-4" />
              Get API Key
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example Request</CardTitle>
            <CardDescription>
              Create a new quiz using the QUIZZQ API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeExample>
              {`POST /v1/quizzes
{
  "title": "Math Quiz",
  "description": "Test your math skills",
  "timeLimit": 3600,
  "questions": [
    {
      "type": "multiple_choice",
      "text": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1
    }
  ]
}`}
            </CodeExample>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-muted rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Developer Resources</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" className="gap-2">
            <BookOpen className="h-4 w-4" />
            API Documentation
          </Button>
          <Button variant="outline" className="gap-2">
            <Zap className="h-4 w-4" />
            API Console
          </Button>
          <Button variant="outline" className="gap-2">
            <Lock className="h-4 w-4" />
            Authentication Guide
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
