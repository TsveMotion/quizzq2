'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  AlertTriangle,
  Shield,
  BarChart,
  RefreshCw,
  Lock,
  Settings,
  Zap,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const rateLimits = [
  {
    title: "Free Tier",
    description: "Basic API access for testing and development",
    icon: Clock,
    color: "text-blue-500",
    limits: [
      "60 requests per minute",
      "1,000 requests per day",
      "Basic endpoints only",
      "Standard response time",
    ],
  },
  {
    title: "Professional Tier",
    description: "For small to medium schools",
    icon: Shield,
    color: "text-green-500",
    limits: [
      "300 requests per minute",
      "10,000 requests per day",
      "All endpoints included",
      "Priority response time",
    ],
  },
  {
    title: "Enterprise Tier",
    description: "For large educational institutions",
    icon: Zap,
    color: "text-purple-500",
    limits: [
      "1,000 requests per minute",
      "Unlimited daily requests",
      "Custom endpoints available",
      "Dedicated infrastructure",
    ],
  },
];

const headers = [
  {
    name: "X-RateLimit-Limit",
    description: "The maximum number of requests you're permitted to make per window",
    example: "60",
  },
  {
    name: "X-RateLimit-Remaining",
    description: "The number of requests remaining in the current time window",
    example: "56",
  },
  {
    name: "X-RateLimit-Reset",
    description: "The time at which the current rate limit window resets in UTC epoch seconds",
    example: "1704533444",
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

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
    <code className="text-sm text-muted-foreground">{children}</code>
  </pre>
);

export default function RateLimitsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Rate Limits</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Understanding API rate limits and quotas
        </p>
      </motion.div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Rate Limit Exceeded Response</AlertTitle>
        <AlertDescription>
          When you exceed the rate limit, you&apos;ll receive a 429 Too Many Requests response.
          Wait until the rate limit window resets before making more requests.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {rateLimits.map((tier) => {
          const Icon = tier.icon;
          return (
            <motion.div key={tier.title} variants={item}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-6 w-6 ${tier.color}`} />
                    <CardTitle>{tier.title}</CardTitle>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.limits.map((limit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{limit}</span>
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
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold">Rate Limit Headers</h2>
        <Card>
          <CardContent className="pt-6">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Header</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2">Example</th>
                </tr>
              </thead>
              <tbody>
                {headers.map((header) => (
                  <tr key={header.name} className="border-b last:border-0">
                    <td className="py-2">
                      <code className="text-primary">{header.name}</code>
                    </td>
                    <td className="py-2 text-muted-foreground">{header.description}</td>
                    <td className="py-2"><code>{header.example}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example Rate Limit Response</CardTitle>
            <CardDescription>
              When you exceed the rate limit, you&apos;ll receive this response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>
              {`HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704533444

{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "API rate limit exceeded. Please wait and try again later.",
    "reset_at": "2025-01-06T09:10:44Z"
  }
}`}
            </CodeBlock>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-muted p-6 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Implement exponential backoff for retry attempts</li>
          <li>• Cache responses when possible to reduce API calls</li>
          <li>• Monitor your API usage through the dashboard</li>
          <li>• Use batch operations when available</li>
          <li>• Consider upgrading your plan if you consistently hit limits</li>
        </ul>
      </motion.div>
    </div>
  );
}
