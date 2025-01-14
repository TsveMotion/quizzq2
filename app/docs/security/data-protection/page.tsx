'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Server,
  Key,
  FileCheck,
  AlertTriangle,
  Database,
  HardDrive,
  RefreshCw,
  ArrowRight,
  Sparkles,
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

const dataProtectionFeatures = [
  {
    title: "Encryption",
    description: "End-to-end encryption for all data",
    icon: Lock,
    features: [
      "AES-256 encryption at rest",
      "TLS 1.3 for data in transit",
      "Key rotation policies",
      "Secure key management",
    ],
  },
  {
    title: "Data Storage",
    description: "Secure and redundant storage systems",
    icon: Database,
    features: [
      "Geo-redundant backups",
      "Daily automated backups",
      "30-day retention policy",
      "Point-in-time recovery",
    ],
  },
  {
    title: "Access Controls",
    description: "Granular access management",
    icon: Shield,
    features: [
      "Role-based access control",
      "IP whitelisting",
      "Session management",
      "Access audit logs",
    ],
  },
  {
    title: "Data Processing",
    description: "Secure data handling procedures",
    icon: Server,
    features: [
      "Secure data processing",
      "Data minimization",
      "Automated data cleanup",
      "Processing audit trails",
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

export default function DataProtectionPage() {
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
            Data Protection
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Data Protection
        </h1>
        <p className="text-xl text-white/80">
          Learn how we protect your data with industry-leading security measures
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Data Security Commitment</AlertTitle>
        <AlertDescription className="text-white/80">
          We implement multiple layers of security to ensure your data is protected at all times.
          Our systems are regularly audited and updated to maintain the highest security standards.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {dataProtectionFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-blue-300" />
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/60">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {feature.features.map((item, index) => (
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
              <HardDrive className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Backup Policy</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Our comprehensive backup strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Automated daily backups",
                "Multi-region replication",
                "Encrypted backup storage",
                "Rapid recovery options",
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
              <RefreshCw className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Data Recovery</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Fast and reliable recovery procedures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Point-in-time recovery",
                "Automated recovery testing",
                "24/7 recovery support",
                "Recovery time objectives",
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
        <h2 className="text-2xl font-bold mb-4 text-white">Security Certifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "ISO 27001",
            "SOC 2 Type II",
            "GDPR Compliant",
            "HIPAA Compliant",
          ].map((cert, index) => (
            <motion.div
              key={cert}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Badge
                className="w-full py-2 flex items-center justify-center bg-white/10 hover:bg-white/20"
              >
                <FileCheck className="mr-2 h-4 w-4 text-blue-300" />
                <span className="text-white">{cert}</span>
              </Badge>
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
          Security Overview
        </Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          Privacy Policy
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
