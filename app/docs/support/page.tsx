'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  MessageCircle,
  Video,
  Book,
  Mail,
  Phone,
  FileQuestion,
  Headphones,
  GraduationCap,
  MessagesSquare,
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
    title: "FAQs",
    description: "Find answers to common questions",
    icon: FileQuestion,
    href: "/docs/support/faqs",
    color: "text-blue-500",
  },
  {
    title: "Video Tutorials",
    description: "Learn through step-by-step video guides",
    icon: Video,
    href: "/docs/support/tutorials",
    color: "text-green-500",
  },
  {
    title: "Contact Support",
    description: "Get in touch with our support team",
    icon: Headphones,
    href: "/docs/support/contact",
    color: "text-purple-500",
  },
  {
    title: "Training Resources",
    description: "Access training materials and guides",
    icon: GraduationCap,
    href: "/docs/support/training",
    color: "text-orange-500",
  },
  {
    title: "Community Forum",
    description: "Connect with other QUIZZQ users",
    icon: MessagesSquare,
    href: "/docs/support/community",
    color: "text-pink-500",
  },
  {
    title: "Knowledge Base",
    description: "Browse our comprehensive documentation",
    icon: Book,
    href: "/docs/support/knowledge-base",
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

export default function SupportPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Support</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Get help and learn how to make the most of QUIZZQ
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
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Contact Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                <CardTitle>Live Chat</CardTitle>
              </div>
              <CardDescription>
                Chat with our support team in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                <CardTitle>Email Support</CardTitle>
              </div>
              <CardDescription>
                Send us an email for detailed assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default" className="w-full">
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-muted rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Help</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" className="gap-2">
            <FileQuestion className="h-4 w-4" />
            View FAQs
          </Button>
          <Button variant="outline" className="gap-2">
            <Video className="h-4 w-4" />
            Watch Tutorials
          </Button>
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            Schedule Call
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-muted-foreground"
      >
        <p>
          Support Hours: Monday - Friday, 9:00 AM - 5:00 PM EST
          <br />
          Emergency Support Available 24/7
        </p>
      </motion.div>
    </div>
  );
}
