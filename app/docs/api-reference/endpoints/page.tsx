'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileJson,
  Users,
  School,
  BookOpen,
  Settings,
  Copy,
  Code,
  Database,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
    <code className="text-sm text-muted-foreground">{children}</code>
  </pre>
);

const endpoints = [
  {
    category: "User Management",
    icon: Users,
    color: "text-blue-500",
    endpoints: [
      {
        method: "GET",
        path: "/v1/users",
        description: "List all users",
        example: {
          request: `GET /v1/users?page=1&limit=10
Authorization: Bearer YOUR_API_KEY`,
          response: `{
  "data": [
    {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "teacher"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}`
        }
      },
      {
        method: "POST",
        path: "/v1/users",
        description: "Create a new user",
        example: {
          request: `POST /v1/users
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "teacher"
}`,
          response: `{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "teacher",
  "created_at": "2025-01-06T09:10:44Z"
}`
        }
      }
    ]
  },
  {
    category: "Quiz Management",
    icon: BookOpen,
    color: "text-green-500",
    endpoints: [
      {
        method: "GET",
        path: "/v1/quizzes",
        description: "List all quizzes",
        example: {
          request: `GET /v1/quizzes?status=active
Authorization: Bearer YOUR_API_KEY`,
          response: `{
  "data": [
    {
      "id": "quiz_123",
      "title": "Math Quiz",
      "status": "active",
      "questions_count": 10
    }
  ],
  "total": 50,
  "page": 1
}`
        }
      },
      {
        method: "POST",
        path: "/v1/quizzes",
        description: "Create a new quiz",
        example: {
          request: `POST /v1/quizzes
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "title": "Math Quiz",
  "description": "Test your math skills",
  "questions": [
    {
      "type": "multiple_choice",
      "text": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correct_answer": 1
    }
  ]
}`,
          response: `{
  "id": "quiz_123",
  "title": "Math Quiz",
  "status": "draft",
  "created_at": "2025-01-06T09:10:44Z"
}`
        }
      }
    ]
  },
  {
    category: "School Management",
    icon: School,
    color: "text-purple-500",
    endpoints: [
      {
        method: "GET",
        path: "/v1/schools",
        description: "Get school information",
        example: {
          request: `GET /v1/schools/school_123
Authorization: Bearer YOUR_API_KEY`,
          response: `{
  "id": "school_123",
  "name": "Example School",
  "address": "123 Main St",
  "admin_email": "admin@school.com"
}`
        }
      },
      {
        method: "PATCH",
        path: "/v1/schools/{id}",
        description: "Update school settings",
        example: {
          request: `PATCH /v1/schools/school_123
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "name": "Updated School Name",
  "settings": {
    "timezone": "UTC",
    "grading_scale": "percentage"
  }
}`,
          response: `{
  "id": "school_123",
  "name": "Updated School Name",
  "updated_at": "2025-01-06T09:10:44Z"
}`
        }
      }
    ]
  }
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

export default function EndpointsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Code className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">API Endpoints</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Explore available API endpoints and their usage
        </p>
      </motion.div>

      <Alert>
        <Database className="h-4 w-4" />
        <AlertTitle>Base URL</AlertTitle>
        <AlertDescription>
          All API requests should be made to: <code className="text-primary">https://api.quizzq.com</code>
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {endpoints.map((category) => {
          const Icon = category.icon;
          return (
            <motion.div key={category.category} variants={item} className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon className={`h-6 w-6 ${category.color}`} />
                <h2 className="text-2xl font-bold">{category.category}</h2>
              </div>
              <div className="space-y-4">
                {category.endpoints.map((endpoint, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-sm font-medium
                            ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                              endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                              endpoint.method === 'PATCH' ? 'bg-yellow-100 text-yellow-700' :
                              endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700' : ''
                            }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-primary">{endpoint.path}</code>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigator.clipboard.writeText(endpoint.path)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Request</h4>
                        <CodeBlock>{endpoint.example.request}</CodeBlock>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Response</h4>
                        <CodeBlock>{endpoint.example.response}</CodeBlock>
                      </div>
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
        className="bg-muted p-6 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Response Codes</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-medium">200 OK</span>
            <span className="text-muted-foreground">- Request successful</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span className="font-medium">201 Created</span>
            <span className="text-muted-foreground">- Resource created successfully</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">400 Bad Request</span>
            <span className="text-muted-foreground">- Invalid request parameters</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="font-medium">401 Unauthorized</span>
            <span className="text-muted-foreground">- Invalid or missing API key</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="font-medium">403 Forbidden</span>
            <span className="text-muted-foreground">- Insufficient permissions</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="font-medium">404 Not Found</span>
            <span className="text-muted-foreground">- Resource not found</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="font-medium">500 Server Error</span>
            <span className="text-muted-foreground">- Internal server error</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
