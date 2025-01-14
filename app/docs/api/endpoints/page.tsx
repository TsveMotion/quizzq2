'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  GraduationCap,
  BarChart2,
  Sparkles,
  ArrowRight,
  Webhook,
  Code,
  CheckCircle2,
  XCircle,
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

const endpoints = [
  {
    title: "Quiz Management",
    description: "Create and manage quizzes",
    icon: FileText,
    endpoints: [
      {
        method: "GET",
        path: "/v1/quizzes",
        description: "List all quizzes",
        example: {
          request: 'curl https://api.quizzq.com/v1/quizzes \\\n  -H "Authorization: Bearer YOUR_API_KEY"',
          response: '{\n  "quizzes": [\n    {\n      "id": "quiz_123",\n      "title": "Math Quiz",\n      "questions": 10\n    }\n  ]\n}',
        },
      },
      {
        method: "POST",
        path: "/v1/quizzes",
        description: "Create a new quiz",
        example: {
          request: 'curl -X POST https://api.quizzq.com/v1/quizzes \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "title": "Science Quiz",\n    "description": "Test your knowledge"\n  }\'',
          response: '{\n  "id": "quiz_124",\n  "title": "Science Quiz",\n  "created_at": "2025-01-13T17:54:56Z"\n}',
        },
      },
    ],
  },
  {
    title: "User Operations",
    description: "Manage users and permissions",
    icon: Users,
    endpoints: [
      {
        method: "GET",
        path: "/v1/users",
        description: "List all users",
        example: {
          request: 'curl https://api.quizzq.com/v1/users \\\n  -H "Authorization: Bearer YOUR_API_KEY"',
          response: '{\n  "users": [\n    {\n      "id": "user_123",\n      "name": "John Doe",\n      "role": "student"\n    }\n  ]\n}',
        },
      },
      {
        method: "POST",
        path: "/v1/users",
        description: "Create a new user",
        example: {
          request: 'curl -X POST https://api.quizzq.com/v1/users \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "name": "Jane Smith",\n    "email": "jane@example.com"\n  }\'',
          response: '{\n  "id": "user_124",\n  "name": "Jane Smith",\n  "created_at": "2025-01-13T17:54:56Z"\n}',
        },
      },
    ],
  },
  {
    title: "Grading",
    description: "Grade management and analytics",
    icon: GraduationCap,
    endpoints: [
      {
        method: "POST",
        path: "/v1/submissions/{id}/grade",
        description: "Grade a quiz submission",
        example: {
          request: 'curl -X POST https://api.quizzq.com/v1/submissions/sub_123/grade \\\n  -H "Authorization: Bearer YOUR_API_KEY"',
          response: '{\n  "submission_id": "sub_123",\n  "score": 85,\n  "feedback": "Great work!"\n}',
        },
      },
      {
        method: "GET",
        path: "/v1/submissions/{id}/results",
        description: "Get submission results",
        example: {
          request: 'curl https://api.quizzq.com/v1/submissions/sub_123/results \\\n  -H "Authorization: Bearer YOUR_API_KEY"',
          response: '{\n  "submission_id": "sub_123",\n  "score": 85,\n  "answers": [...]\n}',
        },
      },
    ],
  },
  {
    title: "Analytics",
    description: "Performance and usage analytics",
    icon: BarChart2,
    endpoints: [
      {
        method: "GET",
        path: "/v1/analytics/quiz/{id}",
        description: "Get quiz analytics",
        example: {
          request: 'curl https://api.quizzq.com/v1/analytics/quiz/quiz_123 \\\n  -H "Authorization: Bearer YOUR_API_KEY"',
          response: '{\n  "quiz_id": "quiz_123",\n  "total_attempts": 150,\n  "avg_score": 78.5\n}',
        },
      },
      {
        method: "GET",
        path: "/v1/analytics/user/{id}",
        description: "Get user analytics",
        example: {
          request: 'curl https://api.quizzq.com/v1/analytics/user/user_123 \\\n  -H "Authorization: Bearer YOUR_API_KEY"',
          response: '{\n  "user_id": "user_123",\n  "quizzes_taken": 25,\n  "avg_score": 82.3\n}',
        },
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

export default function EndpointsPage() {
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
            Endpoints
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          API Endpoints
        </h1>
        <p className="text-xl text-white/80">
          Explore the available API endpoints and their usage
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <Code className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Base URL</AlertTitle>
        <AlertDescription className="text-white/80">
          All API endpoints are prefixed with: <code className="text-blue-200">https://api.quizzq.com</code>
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-8"
      >
        {endpoints.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.title} variants={item}>
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-6 w-6 text-blue-300" />
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <p className="mb-6 text-white/60">{section.description}</p>
              <div className="space-y-4">
                {section.endpoints.map((endpoint) => (
                  <Card key={endpoint.path} className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={
                            endpoint.method === "GET"
                              ? "bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
                              : "bg-green-500/20 text-green-200 hover:bg-green-500/30"
                          }>
                            {endpoint.method}
                          </Badge>
                          <code className="text-white/80">{endpoint.path}</code>
                        </div>
                      </div>
                      <CardDescription className="text-white/60">
                        {endpoint.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2 text-white">Example Request</h3>
                        <div className="rounded-md bg-black/50 p-4">
                          <code className="text-sm text-blue-200 whitespace-pre">
                            {endpoint.example.request}
                          </code>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-white">Example Response</h3>
                        <div className="rounded-md bg-black/50 p-4">
                          <code className="text-sm text-green-400 whitespace-pre">
                            {endpoint.example.response}
                          </code>
                        </div>
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
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Response Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Success Codes</h3>
            <ul className="space-y-2">
              {[
                { code: "200", desc: "OK - Request successful" },
                { code: "201", desc: "Created - Resource created" },
                { code: "204", desc: "No Content - Request successful" },
              ].map((code) => (
                <motion.li
                  key={code.code}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <code className="text-green-200">{code.code}</code>
                  <span className="text-white/80">{code.desc}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Error Codes</h3>
            <ul className="space-y-2">
              {[
                { code: "400", desc: "Bad Request - Invalid input" },
                { code: "401", desc: "Unauthorized - Invalid credentials" },
                { code: "404", desc: "Not Found - Resource not found" },
                { code: "429", desc: "Too Many Requests - Rate limit exceeded" },
              ].map((code) => (
                <motion.li
                  key={code.code}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4 text-red-400" />
                  <code className="text-red-200">{code.code}</code>
                  <span className="text-white/80">{code.desc}</span>
                </motion.li>
              ))}
            </ul>
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
          Authentication
        </Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          Rate Limits
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
