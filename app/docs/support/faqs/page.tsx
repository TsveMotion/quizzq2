'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileQuestion,
  Sparkles,
  ArrowRight,
  Search,
  Tag,
  BookOpen,
  Settings,
  Users,
  GraduationCap,
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
import { Badge } from '@/components/ui/badge';

const faqCategories = [
  {
    title: "Getting Started",
    description: "Basic questions about using QUIZZQ",
    icon: BookOpen,
    faqs: [
      {
        question: "How do I create my first quiz?",
        answer: "Navigate to the Quiz Creator, click 'New Quiz', fill in the quiz details, and add your questions. You can preview and publish when ready.",
        tag: "Basics",
      },
      {
        question: "What question types are supported?",
        answer: "QUIZZQ supports multiple choice, true/false, short answer, essay, matching, and more. Check our Question Types guide for details.",
        tag: "Features",
      },
      {
        question: "How do I invite students?",
        answer: "Use the 'Invite Students' button in your dashboard. You can invite via email or share a class code.",
        tag: "Setup",
      },
    ],
  },
  {
    title: "Account Management",
    description: "Questions about accounts and settings",
    icon: Settings,
    faqs: [
      {
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the login page. Follow the instructions sent to your email to create a new password.",
        tag: "Security",
      },
      {
        question: "Can I change my school details?",
        answer: "Yes, administrators can update school information in the School Settings section of the dashboard.",
        tag: "Settings",
      },
      {
        question: "How do I manage user roles?",
        answer: "Administrators can assign and modify user roles in the User Management section.",
        tag: "Admin",
      },
    ],
  },
  {
    title: "Quiz Administration",
    description: "Help with managing quizzes",
    icon: GraduationCap,
    faqs: [
      {
        question: "How do I grade quizzes?",
        answer: "Auto-graded questions are scored instantly. For manual grading, use the Grading Interface in your dashboard.",
        tag: "Grading",
      },
      {
        question: "Can I set time limits?",
        answer: "Yes, you can set overall time limits and per-question time limits when creating or editing a quiz.",
        tag: "Settings",
      },
      {
        question: "How do I prevent cheating?",
        answer: "Enable secure mode, randomize questions, set time limits, and use our anti-cheating features.",
        tag: "Security",
      },
    ],
  },
  {
    title: "Student Experience",
    description: "Questions about the student interface",
    icon: Users,
    faqs: [
      {
        question: "How do students access quizzes?",
        answer: "Students can access quizzes through their dashboard or via direct links shared by teachers.",
        tag: "Access",
      },
      {
        question: "Can students review their answers?",
        answer: "Yes, if enabled by the teacher, students can review their answers and see explanations after submission.",
        tag: "Review",
      },
      {
        question: "What if a student loses connection?",
        answer: "Our auto-save feature preserves progress. Students can resume from where they left off.",
        tag: "Technical",
      },
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

export default function FAQsPage() {
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
            FAQs
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-white/80">
          Find quick answers to common questions about QUIZZQ
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center">
          <Search className="h-5 w-5 text-white/60" />
        </div>
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full rounded-lg bg-white/10 border-white/20 pl-10 pr-4 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-8"
      >
        {faqCategories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.div key={category.title} variants={item}>
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-6 w-6 text-blue-300" />
                <h2 className="text-2xl font-bold text-white">{category.title}</h2>
              </div>
              <p className="mb-6 text-white/60">{category.description}</p>
              <div className="space-y-4">
                {category.faqs.map((faq, index) => (
                  <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-white">{faq.question}</CardTitle>
                          <Badge className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30">
                            <Tag className="mr-1 h-3 w-3" />
                            {faq.tag}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 border border-white/20 backdrop-blur-sm p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Still Need Help?</h2>
        <p className="text-white/80 mb-4">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <ArrowRight className="h-4 w-4" />
            Contact Support
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <AlertTriangle className="h-4 w-4" />
            Report an Issue
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
          Support Home
        </Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
          Contact Support
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
