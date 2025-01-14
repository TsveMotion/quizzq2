'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Key,
  Link,
  Timer,
  Sparkles,
  ArrowRight,
  Terminal,
  Lock,
  Zap,
  Webhook,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const apiSections = [
  {
    title: "Authentication",
    description: "Learn how to authenticate your API requests",
    icon: Key,
    link: "/docs/api/authentication",
    features: [
      "API Key Authentication",
      "OAuth 2.0 Integration",
      "Token Management",
      "Security Best Practices",
    ],
  },
  {
    title: "Endpoints",
    description: "Explore available API endpoints and their usage",
    icon: Webhook,
    link: "/docs/api/endpoints",
    features: [
      "Quiz Management",
      "User Operations",
      "Grade Processing",
      "Analytics Data",
    ],
  },
  {
    title: "Rate Limits",
    description: "Understand API rate limits and quotas",
    icon: Timer,
    link: "/docs/api/rate-limits",
    features: [
      "Request Quotas",
      "Rate Limit Headers",
      "Throttling Rules",
      "Burst Allowance",
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

export default function APIReferencePage() {
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
            API Reference
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          API Reference
        </h1>
        <p className="text-xl text-white/80">
          Integrate QUIZZQ into your applications with our powerful API
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {apiSections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-6 w-6 text-blue-300" />
                      <CardTitle className="text-white">{section.title}</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      asChild
                    >
                      <a href={section.link}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <CardDescription className="text-white/60">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.features.map((feature, index) => (
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
              <Terminal className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Quick Start</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Get started with basic API integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md bg-black/50 p-4">
                <code className="text-sm text-blue-200">
                  <span className="text-pink-400">curl</span>{" "}
                  https://api.quizzq.com/v1/quizzes \<br />
                  {"  "}-H <span className="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span>
                </code>
              </div>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                View Documentation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Security</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Learn about our security measures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "TLS encryption for all requests",
                "API key rotation support",
                "IP whitelisting available",
                "Request signing optional",
              ].map((feature, index) => (
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
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Getting Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Support Channels</h3>
            <ul className="space-y-2">
              {[
                "Developer Discord community",
                "GitHub issue tracking",
                "Email support",
                "API status page",
              ].map((channel, index) => (
                <motion.li
                  key={channel}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  <span className="text-white/80">{channel}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              {[
                "API changelog",
                "SDKs & libraries",
                "Code examples",
                "Best practices guide",
              ].map((resource, index) => (
                <motion.li
                  key={resource}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  <span className="text-white/80">{resource}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
