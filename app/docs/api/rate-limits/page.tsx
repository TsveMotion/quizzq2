'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Timer,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  RefreshCw,
  Activity,
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

const rateLimits = [
  {
    title: "Free Tier",
    description: "For development and testing",
    icon: Timer,
    limits: [
      {
        endpoint: "All endpoints",
        rate: "60 requests per minute",
        burst: "100 requests",
      },
      {
        endpoint: "Authentication endpoints",
        rate: "30 requests per minute",
        burst: "50 requests",
      },
    ],
    features: [
      "Basic rate limiting",
      "Shared IP pool",
      "Standard support",
      "Development access",
    ],
  },
  {
    title: "Pro Tier",
    description: "For production applications",
    icon: Zap,
    limits: [
      {
        endpoint: "All endpoints",
        rate: "1000 requests per minute",
        burst: "2000 requests",
      },
      {
        endpoint: "Authentication endpoints",
        rate: "100 requests per minute",
        burst: "200 requests",
      },
    ],
    features: [
      "Higher rate limits",
      "Dedicated IP pool",
      "Priority support",
      "Production access",
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

export default function RateLimitsPage() {
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
            Rate Limits
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Rate Limits
        </h1>
        <p className="text-xl text-white/80">
          Understanding API rate limits and quotas
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Rate Limit Headers</AlertTitle>
        <AlertDescription className="text-white/80">
          All API responses include rate limit information in the headers:
          <div className="mt-2 rounded-md bg-black/50 p-4">
            <code className="text-sm text-blue-200">
              X-RateLimit-Limit: 60<br />
              X-RateLimit-Remaining: 56<br />
              X-RateLimit-Reset: 1673647123
            </code>
          </div>
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {rateLimits.map((tier) => {
          const Icon = tier.icon;
          return (
            <motion.div key={tier.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-blue-300" />
                    <CardTitle className="text-white">{tier.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/60">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4 text-white">Rate Limits</h3>
                    <div className="space-y-4">
                      {tier.limits.map((limit) => (
                        <div key={limit.endpoint} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30">
                              {limit.endpoint}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-blue-300" />
                              <span className="text-white/80">{limit.rate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-blue-300" />
                              <span className="text-white/80">Burst: {limit.burst}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tier.features.map((feature, index) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center gap-2"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                          <span className="text-white/80">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
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
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Best Practices</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Tips for managing rate limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Implement exponential backoff",
                "Cache responses when possible",
                "Monitor rate limit headers",
                "Use bulk operations",
              ].map((practice, index) => (
                <motion.li
                  key={practice}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  <span className="text-white/80">{practice}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Rate Limit Reset</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Understanding rate limit reset behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md bg-black/50 p-4">
                <code className="text-sm text-blue-200">
                  {`// Example rate limit reset time\n`}
                  {`const resetTime = new Date(response.headers['X-RateLimit-Reset'] * 1000);\n`}
                  {`console.log('Rate limit resets at:', resetTime);`}
                </code>
              </div>
              <p className="text-white/80">
                Rate limits reset on a rolling window basis. The reset timestamp is provided
                in Unix epoch seconds.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Common Questions</h2>
        <div className="space-y-4">
          {[
            {
              question: "What happens when I exceed the rate limit?",
              answer: "You'll receive a 429 Too Many Requests response with a Retry-After header.",
            },
            {
              question: "How can I increase my rate limits?",
              answer: "Upgrade to the Pro tier or contact support for custom limits.",
            },
            {
              question: "Are rate limits per endpoint or global?",
              answer: "Both. There are global limits and specific limits for certain endpoints.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="space-y-2"
            >
              <h3 className="font-semibold text-white">{item.question}</h3>
              <p className="text-white/60">{item.answer}</p>
            </motion.div>
          ))}
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
          Endpoints
        </Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          Back to API Reference
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
