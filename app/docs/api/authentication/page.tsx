'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Shield,
  RefreshCw,
  Lock,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
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

const authMethods = [
  {
    title: "API Key Authentication",
    description: "Simple key-based authentication for API access",
    icon: Key,
    example: {
      curl: 'curl https://api.quizzq.com/v1/quizzes \\\n  -H "X-API-Key: YOUR_API_KEY"',
      response: '{\n  "status": "success",\n  "message": "Authentication successful"\n}',
    },
    features: [
      "Easy to implement",
      "Suitable for server-side apps",
      "Key rotation support",
      "Usage analytics",
    ],
  },
  {
    title: "OAuth 2.0",
    description: "Secure token-based authentication flow",
    icon: Shield,
    example: {
      curl: 'curl https://api.quizzq.com/oauth/token \\\n  -d "grant_type=client_credentials" \\\n  -d "client_id=YOUR_CLIENT_ID" \\\n  -d "client_secret=YOUR_CLIENT_SECRET"',
      response: '{\n  "access_token": "TOKEN",\n  "token_type": "Bearer",\n  "expires_in": 3600\n}',
    },
    features: [
      "Secure authentication flow",
      "Token expiration",
      "Scope-based access",
      "Refresh token support",
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

export default function AuthenticationPage() {
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
            Authentication
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Authentication
        </h1>
        <p className="text-xl text-white/80">
          Learn how to authenticate your API requests with QUIZZQ
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Important</AlertTitle>
        <AlertDescription className="text-white/80">
          Never share your API keys or credentials. Keep them secure and use environment variables
          in your applications.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {authMethods.map((method) => {
          const Icon = method.icon;
          return (
            <motion.div key={method.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-blue-300" />
                    <CardTitle className="text-white">{method.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/60">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Example Request</h3>
                    <div className="rounded-md bg-black/50 p-4">
                      <code className="text-sm text-blue-200 whitespace-pre">
                        {method.example.curl}
                      </code>
                    </div>
                    <h3 className="font-semibold text-white">Example Response</h3>
                    <div className="rounded-md bg-black/50 p-4">
                      <code className="text-sm text-green-400 whitespace-pre">
                        {method.example.response}
                      </code>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {method.features.map((feature, index) => (
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
              <RefreshCw className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Key Rotation</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Best practices for API key management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Rotate keys every 90 days",
                "Use separate keys per environment",
                "Revoke compromised keys immediately",
                "Monitor key usage patterns",
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
              <Lock className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Security Tips</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Keep your authentication secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Use environment variables",
                "Implement IP whitelisting",
                "Enable audit logging",
                "Set up alerts for suspicious activity",
              ].map((tip, index) => (
                <motion.li
                  key={tip}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  <span className="text-white/80">{tip}</span>
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
        <h2 className="text-2xl font-bold mb-4 text-white">Common Issues</h2>
        <div className="space-y-4">
          {[
            {
              title: "Invalid API Key",
              description: "Ensure your API key is valid and not expired",
              status: "error",
            },
            {
              title: "Missing Authorization Header",
              description: "Include the Authorization header in your requests",
              status: "error",
            },
            {
              title: "Token Expired",
              description: "Refresh your access token when it expires",
              status: "warning",
            },
            {
              title: "Incorrect Scope",
              description: "Verify you have the required permissions",
              status: "warning",
            },
          ].map((issue, index) => (
            <motion.div
              key={issue.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-3"
            >
              {issue.status === "error" ? (
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              )}
              <div>
                <h3 className="font-semibold text-white">{issue.title}</h3>
                <p className="text-white/60">{issue.description}</p>
              </div>
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
          Back to API Reference
        </Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          Endpoints
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
