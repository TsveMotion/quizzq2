'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  Target,
  Users,
  BookOpen,
  Award,
  ArrowRight,
  LineChart,
  Zap,
  MessageSquare,
  Clock,
  Shield,
  Settings,
  BarChart,
  Laptop,
  FileText
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const features = [
  {
    title: "AI-Powered Quiz Generation",
    description: "Create customized quizzes instantly with our advanced AI technology. Generate questions across various subjects and difficulty levels.",
    icon: Brain,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10"
  },
  {
    title: "Personalized Learning Paths",
    description: "Adaptive learning algorithms that adjust to each student's pace and style, ensuring optimal learning outcomes.",
    icon: Target,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10"
  },
  {
    title: "Real-Time Analytics",
    description: "Comprehensive analytics dashboard providing insights into student performance, progress tracking, and areas for improvement.",
    icon: LineChart,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10"
  },
  {
    title: "Collaborative Learning",
    description: "Foster engagement through group assignments, peer reviews, and interactive discussion features.",
    icon: Users,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10"
  },
  {
    title: "Smart Assignment Management",
    description: "Streamlined assignment creation, distribution, and grading system with automated feedback.",
    icon: FileText,
    color: "text-teal-400",
    bgColor: "bg-teal-400/10"
  },
  {
    title: "24/7 AI Support",
    description: "Round-the-clock AI tutoring assistance to help students with questions and concepts.",
    icon: MessageSquare,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10"
  },
  {
    title: "Progress Tracking",
    description: "Monitor individual and class-wide progress with detailed performance metrics and insights.",
    icon: BarChart,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10"
  },
  {
    title: "Automated Grading",
    description: "Save time with intelligent grading systems that provide instant feedback and scoring.",
    icon: Zap,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10"
  },
  {
    title: "Resource Library",
    description: "Access a vast collection of educational materials, templates, and study resources.",
    icon: BookOpen,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10"
  }
];

const FeatureCard = ({ title, description, icon: Icon, color, bgColor }: {
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden bg-white/10 border-white/20 backdrop-blur-lg h-full">
        <CardContent className="p-6">
          <div className="flex flex-col h-full">
            <div className={`rounded-lg ${bgColor} p-3 w-fit mb-4`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-white/70">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#1a237e]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#311b92] opacity-100" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="container relative mx-auto px-4 py-24"
          >
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md shadow-lg"
              >
                <span className="flex items-center text-sm font-medium text-white">
                  <Sparkles className="mr-2 inline-block h-4 w-4 animate-pulse text-blue-200" />
                  Powerful Features for Modern Education
                </span>
              </motion.div>

              <motion.h1 
                className="mb-6 font-bold text-white md:text-6xl text-4xl tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Transform Learning with{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 animate-glow bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                    QUIZZQ
                  </span>
                  <span className="absolute -inset-x-4 -inset-y-2 z-0 bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/40 blur-xl" />
                </span>
              </motion.h1>

              <motion.p 
                className="mb-8 text-xl text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Discover our comprehensive suite of features designed to revolutionize 
                teaching and learning in the digital age.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-white/90"
                  asChild
                >
                  <Link href="/signup" className="flex items-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/40 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/demo" className="flex items-center">
                    View Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-[#1a237e] to-[#283593]">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-[#311b92]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
              Ready to Experience QUIZZQ?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands of educators and students already using QUIZZQ to transform their educational experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-white/90"
                asChild
              >
                <Link href="/signup" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contact" className="flex items-center">
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
