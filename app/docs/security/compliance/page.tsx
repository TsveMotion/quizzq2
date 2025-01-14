'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck,
  Shield,
  CheckCircle2,
  Book,
  Scale,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  FileText,
  Globe,
  Building,
  Scroll,
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

const complianceFrameworks = [
  {
    title: "GDPR Compliance",
    description: "European Data Protection Regulation",
    icon: Shield,
    features: [
      "Data protection measures",
      "User rights management",
      "Data breach protocols",
      "Cross-border transfers",
    ],
  },
  {
    title: "FERPA Compliance",
    description: "Educational Records Protection",
    icon: Book,
    features: [
      "Student data protection",
      "Parental rights",
      "Record access controls",
      "Disclosure policies",
    ],
  },
  {
    title: "COPPA Compliance",
    description: "Children's Online Privacy Protection",
    icon: Scale,
    features: [
      "Age verification",
      "Parental consent",
      "Data collection limits",
      "Safe harbor provisions",
    ],
  },
  {
    title: "ISO 27001",
    description: "Information Security Management",
    icon: FileCheck,
    features: [
      "Risk management",
      "Security controls",
      "Regular audits",
      "Continuous improvement",
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

export default function CompliancePage() {
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
            Compliance
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Compliance
        </h1>
        <p className="text-xl text-white/80">
          Our commitment to regulatory compliance and industry standards
        </p>
      </motion.div>

      <Alert className="bg-white/10 border-white/20 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4 text-blue-300" />
        <AlertTitle className="text-white">Compliance Status</AlertTitle>
        <AlertDescription className="text-white/80">
          We maintain active compliance with all major educational and data protection regulations.
          Our compliance status is regularly audited and updated.
        </AlertDescription>
      </Alert>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {complianceFrameworks.map((framework) => {
          const Icon = framework.icon;
          return (
            <motion.div key={framework.title} variants={item}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-blue-300" />
                    <CardTitle className="text-white">{framework.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/60">
                    {framework.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {framework.features.map((feature, index) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4 text-blue-300" />
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
              <Globe className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Global Compliance</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              International standards and regulations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "EU Data Protection",
                "US Privacy Laws",
                "International Standards",
                "Cross-border Data Flows",
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
              <Building className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">Industry Standards</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Educational technology standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "EdTech Security Standards",
                "Learning Tools Interoperability",
                "Accessibility Standards",
                "Data Interoperability",
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
        <h2 className="text-2xl font-bold mb-4 text-white">Compliance Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Available Documents</h3>
            <ul className="space-y-2">
              {[
                "Compliance Certificates",
                "Audit Reports",
                "Security Assessments",
                "Privacy Impact Analyses",
              ].map((doc, index) => (
                <motion.li
                  key={doc}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-blue-300" />
                  <span className="text-white/80">{doc}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Request Access</h3>
            <p className="text-white/80">
              Contact our compliance team to request access to detailed compliance documentation.
            </p>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
              <Scroll className="h-4 w-4" />
              Request Documents
            </Button>
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
          Privacy Policy
        </Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          Security Overview
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
