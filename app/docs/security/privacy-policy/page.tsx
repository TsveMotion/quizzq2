'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Shield,
  FileText,
  Users,
  Globe,
  Clock,
  ArrowRight,
  Sparkles,
  Mail,
  Cookie,
  Scale,
  AlertTriangle,
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

const privacyPolicySections = [
  {
    title: "Data Collection",
    description: "Information we collect and why",
    icon: FileText,
    content: [
      "Personal identification information",
      "Quiz responses and results",
      "Usage analytics and statistics",
      "Technical system information",
    ],
  },
  {
    title: "Data Usage",
    description: "How we use your information",
    icon: Users,
    content: [
      "Service improvement and personalization",
      "Communication and support",
      "Analytics and reporting",
      "Security and fraud prevention",
    ],
  },
  {
    title: "Data Sharing",
    description: "Third-party data sharing policies",
    icon: Globe,
    content: [
      "Service providers and partners",
      "Legal requirements",
      "User consent requirements",
      "Data transfer safeguards",
    ],
  },
  {
    title: "Data Retention",
    description: "How long we keep your data",
    icon: Clock,
    content: [
      "Active account data retention",
      "Backup retention periods",
      "Account deletion process",
      "Data archival policies",
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

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Privacy Policy
        </h1>
        <p className="text-xl text-white/80">
          Our commitment to protecting your privacy and personal data
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Last Updated</AlertTitle>
        <AlertDescription className="text-white/80">
          This privacy policy was last updated on January 13, 2025. We regularly review and update
          our privacy practices to ensure compliance with current regulations.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {privacyPolicySections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-blue-300" />
                    <CardTitle className="text-white">{section.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/60">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.content.map((item, index) => (
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
              <Cookie className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Cookie Policy</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              How we use cookies and tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Essential cookies for functionality",
                "Analytics and performance cookies",
                "Third-party cookie usage",
                "Cookie consent management",
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
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Your Rights</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Understanding your privacy rights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Right to access your data",
                "Right to data portability",
                "Right to be forgotten",
                "Right to rectification",
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
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Contact Us</h2>
        <p className="text-white/80 mb-4">
          If you have any questions about our privacy policy or how we handle your data,
          please don&apos;t hesitate to contact us.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <Mail className="h-4 w-4" />
            Contact Privacy Team
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <Shield className="h-4 w-4" />
            Report Privacy Concern
          </Button>
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
          Data Protection
        </Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          Compliance
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
