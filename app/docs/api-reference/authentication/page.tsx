'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Lock,
  Shield,
  RefreshCw,
  AlertTriangle,
  Copy,
  CheckCircle,
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

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
    <code className="text-sm text-muted-foreground">{children}</code>
  </pre>
);

const authExamples = [
  {
    title: "API Key Authentication",
    description: "Use your API key in the Authorization header",
    code: `curl -X GET "https://api.quizzq.com/v1/quizzes" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    language: "bash",
  },
  {
    title: "OAuth2 Authentication",
    description: "Authenticate using OAuth2 flow",
    code: `const response = await fetch('https://api.quizzq.com/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    code: 'AUTHORIZATION_CODE',
    redirect_uri: 'YOUR_REDIRECT_URI'
  })
});

const { access_token } = await response.json();`,
    language: "javascript",
  },
  {
    title: "Token Refresh",
    description: "Refresh an expired access token",
    code: `POST https://api.quizzq.com/oauth/token
Content-Type: application/json

{
  "grant_type": "refresh_token",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "refresh_token": "YOUR_REFRESH_TOKEN"
}`,
    language: "http",
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
        <div className="flex items-center gap-2">
          <Key className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Authentication</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Learn how to authenticate your requests to the QUIZZQ API
        </p>
      </motion.div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Notice</AlertTitle>
        <AlertDescription>
          Never share your API keys or client secrets. Keep them secure and rotate them regularly.
          Use environment variables to store sensitive credentials.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {authExamples.map((example) => {
          return (
            <motion.div key={example.title} variants={item}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {example.title.includes("API Key") ? (
                      <Key className="h-6 w-6 text-primary" />
                    ) : example.title.includes("OAuth") ? (
                      <Lock className="h-6 w-6 text-primary" />
                    ) : (
                      <RefreshCw className="h-6 w-6 text-primary" />
                    )}
                    <CardTitle>{example.title}</CardTitle>
                  </div>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <CodeBlock>{example.code}</CodeBlock>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => navigator.clipboard.writeText(example.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
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
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Authentication Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Generate API credentials", icon: Key },
            { title: "Implement authentication", icon: Lock },
            { title: "Test API access", icon: Shield },
            { title: "Monitor usage", icon: RefreshCw },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="font-medium">{step.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-muted p-6 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Store API keys securely using environment variables</li>
          <li>• Implement proper error handling for auth failures</li>
          <li>• Use refresh tokens to maintain sessions</li>
          <li>• Regularly rotate API keys and secrets</li>
          <li>• Monitor and log authentication attempts</li>
        </ul>
      </motion.div>
    </div>
  );
}
