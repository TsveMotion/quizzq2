'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Sparkles,
  ArrowRight,
  Globe,
  MessageSquare,
  HeadphonesIcon,
  Calendar,
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

const contactMethods = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    availability: "24/7",
    response: "Instant",
    action: "Start Chat",
    features: [
      "Real-time assistance",
      "Screen sharing",
      "File sharing",
      "Chat history",
    ],
  },
  {
    title: "Email Support",
    description: "Send us a detailed message",
    icon: Mail,
    availability: "24/7",
    response: "Within 24 hours",
    action: "Send Email",
    features: [
      "Detailed responses",
      "File attachments",
      "Ticket tracking",
      "Priority support",
    ],
  },
  {
    title: "Phone Support",
    description: "Talk to our support specialists",
    icon: Phone,
    availability: "Mon-Fri, 9AM-5PM EST",
    response: "No wait time for premium",
    action: "Call Now",
    features: [
      "Direct assistance",
      "Premium support line",
      "Call scheduling",
      "Call recording",
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

export default function ContactSupportPage() {
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
            Contact Support
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Contact Support
        </h1>
        <p className="text-xl text-white/80">
          Get help from our dedicated support team through multiple channels
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <Clock className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Current Support Status</AlertTitle>
        <AlertDescription className="text-white/80">
          Our support team is currently online and ready to help. Average response time: &lt; 5 minutes
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <motion.div key={method.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-6 w-6 text-blue-300" />
                      <CardTitle className="text-white">{method.title}</CardTitle>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30">
                      {method.availability}
                    </Badge>
                  </div>
                  <CardDescription className="text-white/60">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-300" />
                    <span className="text-white/80">Response time: {method.response}</span>
                  </div>
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
                  <Button className="w-full bg-blue-500/20 text-blue-200 hover:bg-blue-500/30">
                    {method.action}
                  </Button>
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
              <Globe className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Regional Support</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Support available in multiple languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "English (24/7)",
                "Spanish (Mon-Fri)",
                "French (Mon-Fri)",
                "German (Mon-Fri)",
              ].map((lang, index) => (
                <motion.li
                  key={lang}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  <span className="text-white/80">{lang}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Schedule a Call</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Book a time with our specialists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 mb-4">
              Choose a convenient time for a detailed support call with our team.
            </p>
            <Button className="w-full bg-blue-500/20 text-blue-200 hover:bg-blue-500/30">
              Schedule Appointment
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Before Contacting Support</h2>
        <div className="space-y-4">
          <p className="text-white/80">
            To help us serve you better, please have the following information ready:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Your account details",
              "Specific error messages",
              "Steps to reproduce the issue",
              "Screenshots (if applicable)",
              "Browser and device info",
              "Recent account changes",
            ].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-2"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                <span className="text-white/80">{item}</span>
              </motion.li>
            ))}
          </ul>
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
          FAQs
        </Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          Troubleshooting
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
