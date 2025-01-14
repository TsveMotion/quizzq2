'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Book,
  Atom,
  Globe2,
  Zap,
  GraduationCap,
  MessageSquareMore,
  Sparkles,
  Target,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  FileText,
  Calendar,
  PlayCircle,
  LineChart,
  Calculator,
  Badge,
  ArrowLeft,
  User,
  Send,
  Paperclip,
  Image as ImageIcon,
  Bot
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { AnimatedBook } from "@/components/animated/animated-book";
import { AnimatedStatsCard } from "@/components/animated/animated-stats-card";
import { FloatingIcons } from "@/components/animated/floating-icons";
import { AnimatedStepCard } from "@/components/animated/animated-step-card";
import { AnimatedFeature } from "@/components/animated/animated-feature";
import { MaintenanceBanner } from "@/components/maintenance-banner";
import { QuizGeneratorDemo } from "@/components/demo/quiz-generator-demo";
import { StudyPlannerDemo } from "@/components/demo/study-planner-demo";
import cn from 'classnames';
import { 
  FeatureCard,
  StatCard,
  StepCard,
  ExampleFeature,
  TestimonialCard
} from '@/components/home';
import ChatInterface from '@/components/home/chat-interface';

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

const MAX_PROMPTS = 5;

const stats = [
  {
    number: "10,000+",
    label: "Active Students",
    icon: Users,
    color: "from-purple-500/20 to-purple-600/20"
  },
  {
    number: "50,000+",
    label: "Quizzes Generated",
    icon: Brain,
    color: "from-blue-500/20 to-blue-600/20"
  },
  {
    number: "98%",
    label: "Success Rate",
    icon: Target,
    color: "from-indigo-500/20 to-indigo-600/20"
  }
];

const tabs = [
  {
    id: "quiz-generator",
    label: "Quiz Generator",
    icon: FileText,
    description: "Generate custom quizzes for any subject with AI",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "ai-tutor",
    label: "AI Tutor",
    icon: Brain,
    description: "Get personalized tutoring and instant feedback",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "study-planner",
    label: "Study Planner",
    icon: Calendar,
    description: "Create an optimized study schedule",
    color: "from-indigo-500 to-indigo-600"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("quiz-generator");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handlePromptUsage = async (callback: () => Promise<any>) => {
    try {
      const result = await callback();
      return result;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const generateQuiz = async (data: any) => {
    return handlePromptUsage(async () => {
      const response = await fetch('/api/demo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to generate quiz');
      return response.json();
    });
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "quiz-generator":
        return <QuizGeneratorDemo onGenerate={generateQuiz} />;
      case "ai-tutor":
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Zap className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-purple-100 mb-2">Coming Soon</h3>
            <p className="text-purple-200/70">This feature is currently under development.</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Zap className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-purple-100 mb-2">Coming Soon</h3>
            <p className="text-purple-200/70">This feature is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-auto">
      <MaintenanceBanner />
      <div className="min-h-screen bg-[#1a237e]">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#1a237e]">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#311b92] opacity-100" />
          
          {/* Content overlay */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="container relative mx-auto px-4 py-32 sm:py-40"
            >
              <div className="relative z-10 mx-auto max-w-4xl text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 inline-block rounded-full bg-white/20 dark:bg-white/5 px-4 py-1.5 backdrop-blur-md shadow-lg"
                >
                  <span className="flex items-center text-sm font-medium text-white">
                    <Sparkles className="mr-2 inline-block h-4 w-4 animate-pulse text-blue-200" />
                    The Future of Learning is Here
                  </span>
                </motion.div>

                <motion.h1 
                  className="mb-6 font-bold text-white md:text-7xl text-5xl tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Master Any Subject with{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 animate-glow bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                      AI-Powered
                    </span>
                    <span className="absolute -inset-x-4 -inset-y-2 z-0 bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/40 blur-xl dark:from-blue-400/30 dark:via-indigo-400/30 dark:to-purple-400/30" />
                    <span className="absolute -inset-x-4 -inset-y-2 z-0 animate-pulse bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-2xl dark:from-blue-300/10 dark:via-indigo-300/10 dark:to-purple-300/10" />
                  </span>{' '}
                  Learning
                </motion.h1>

                <motion.p 
                  className="mb-8 text-xl text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Join thousands of students revolutionizing their education with personalized AI tutoring,
                  adaptive quizzes, and intelligent study plans. Learn smarter, not harder.
                </motion.p>

                <motion.div 
                  className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    size="lg" 
                    className="group relative overflow-hidden bg-white/90 text-blue-600 hover:bg-white dark:bg-white/90 dark:text-blue-700 dark:hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/signup" className="flex items-center">
                      <span className="relative z-10 flex items-center font-semibold">
                        Start Learning Free
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-100 to-white transition-transform group-hover:translate-x-0" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="group relative overflow-hidden border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/demo" className="flex items-center">
                      <span className="relative z-10 flex items-center font-semibold">
                        Try Demo
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Button>
                </motion.div>
                
                {/* Stats Section */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                  <StatCard number="10k+" label="Active Students" />
                  <StatCard number="50k+" label="Questions Generated" />
                  <StatCard number="95%" label="Success Rate" />
                  <StatCard number="24/7" label="AI Support" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Chat Interface Section */}
        <section className="mt-32 max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ChatInterface mousePosition={mousePosition} />
          </motion.div>
        </section>

        {/* Steps Section */}
        <section className="relative py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16 relative"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-2"
              >
                <div className="inline-block">
                  <span className="inline-block text-white text-5xl font-bold mb-6 relative">
                    How It Works
                    <motion.div
                      className="absolute -right-8 -top-8"
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 10 }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Sparkles className="w-6 h-6 text-[#4169E1]" />
                    </motion.div>
                  </span>
                </div>
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl text-white/80"
              >
                Experience the perfect blend of AI technology and educational expertise
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <StepCard
                  number="1"
                  title="Sign Up"
                  description="Create your account in seconds and get started with AI-powered learning"
                />
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <StepCard
                  number="2"
                  title="Choose Your Subject"
                  description="Select from a wide range of subjects and topics you want to learn"
                />
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <StepCard
                  number="3"
                  title="Start Learning"
                  description="Get personalized help and practice with AI-generated quizzes"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative py-24 bg-[#1a237e]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16 relative"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-2"
              >
                <div className="inline-block">
                  <span className="inline-block text-white text-5xl font-bold mb-6 relative">
                    What Our Users Say
                    <motion.div
                      className="absolute -right-8 -top-8"
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 10 }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Sparkles className="w-6 h-6 text-[#4169E1]" />
                    </motion.div>
                  </span>
                </div>
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl text-white/80"
              >
                Don't just take our word for it. Hear from our satisfied users.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <TestimonialCard
                  quote="QuizzQ has transformed my learning experience. The AI tutor is incredibly helpful!"
                  author="Sarah Johnson"
                  role="Student"
                />
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <TestimonialCard
                  quote="The personalized quizzes helped me identify and improve my weak areas."
                  author="Michael Chen"
                  role="University Student"
                />
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <TestimonialCard
                  quote="As a teacher, I love how QuizzQ helps me create engaging content for my students."
                  author="David Smith"
                  role="High School Teacher"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="relative py-24 bg-[#1a237e]">
          <div className="container mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Choose Your Plan
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start with our forever-free plan or upgrade to Pro for advanced features.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                variants={itemVariants}
                className="p-8 rounded-xl border border-[#4169E1] bg-[#1a237e] relative flex flex-col h-full"
              >
                <div>
                  <div className="text-2xl font-bold mb-2 text-white">Free Forever</div>
                  <div className="text-4xl font-bold mb-6 text-[#4169E1]">£0<span className="text-lg font-normal text-white/80">/month</span></div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-white">
                      <CheckCircle2 className="h-5 w-5 text-[#4169E1] mr-2" />
                      <span>Basic AI assistance</span>
                    </li>
                    <li className="flex items-center text-white">
                      <CheckCircle2 className="h-5 w-5 text-[#4169E1] mr-2" />
                      <span>Limited practice questions</span>
                    </li>
                    <li className="flex items-center text-white">
                      <CheckCircle2 className="h-5 w-5 text-[#4169E1] mr-2" />
                      <span>Basic progress tracking</span>
                    </li>
                    <li className="flex items-center text-white">
                      <CheckCircle2 className="h-5 w-5 text-[#4169E1] mr-2" />
                      <span>Community support</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <Button className="w-full bg-[#4169E1] hover:bg-[#4169E1]/90 text-white" size="lg" asChild>
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="p-8 rounded-xl border border-[#7B68EE] bg-[#1a237e] relative flex flex-col h-full"
              >
                <div className="absolute top-4 right-4 bg-[#7B68EE] text-white px-3 py-1 rounded-full text-sm">
                  Most Popular
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2 text-white">Pro Plan</div>
                  <div className="text-4xl font-bold mb-6 text-[#7B68EE]">£3.99<span className="text-lg font-normal text-white/80">/month</span></div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-white">
                      <CheckCircle2 className="h-5 w-5 text-[#7B68EE] mr-2" />
                      <span>Advanced AI tutor</span>
                    </li>
                    <li className="flex items-center text-white">
                      <CheckCircle2 className="h-5 w-5 text-[#7B68EE] mr-2" />
                      <span>Unlimited practice questions</span>
                    </li>
                    <li className="flex items-center text-white">
                      <CheckCircle2 className="h-5 w-5 text-[#7B68EE] mr-2" />
                      <span>Detailed analytics & insights</span>
                    </li>
                    <li className="flex items-center text-white">
                      <CheckCircle2 className="h-5 w-5 text-[#7B68EE] mr-2" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center text-white">
                      <CheckCircle2 className="h-5 w-5 text-[#7B68EE] mr-2" />
                      <span>Custom study plans</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <Button className="w-full bg-[#7B68EE] hover:bg-[#7B68EE]/90 text-white" size="lg" asChild>
                    <Link href="/signup?plan=pro">Upgrade to Pro</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/20 via-[#1a237e] to-[#7B68EE]/20" />
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#4169E1]/10 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#7B68EE]/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#4169E1]/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="inline-block">
                  <span className="inline-block text-white text-5xl font-bold mb-6 relative">
                    Start Learning Today
                    <motion.div
                      className="absolute -right-8 -top-8"
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 10 }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Sparkles className="w-8 h-8 text-[#7B68EE]" />
                    </motion.div>
                  </span>
                </div>
              </motion.div>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl mb-12 text-white/90 leading-relaxed"
              >
                Join over <span className="text-[#4169E1] font-bold">10,000 students</span> who are already using QUIZZQ. 
                Start with our free plan and upgrade anytime!
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Button 
                  size="lg"
                  className="bg-[#4169E1] hover:bg-[#4169E1]/90 text-white min-w-[200px] h-14 text-lg relative overflow-hidden group"
                  asChild
                >
                  <Link href="/signup" className="relative">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4169E1]/0 via-white/20 to-[#4169E1]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  </Link>
                </Button>

                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#7B68EE] text-white hover:bg-[#7B68EE]/10 min-w-[200px] h-14 text-lg relative overflow-hidden group"
                  asChild
                >
                  <Link href="/contact" className="relative">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Schools Contact Us
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7B68EE]/0 via-[#7B68EE]/20 to-[#7B68EE]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative circles */}
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#4169E1]/10 rounded-full" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7B68EE]/10 rounded-full" />
        </section>

        {/* Floating Button */}
        <motion.div 
          className="fixed bottom-8 right-8 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button 
            size="lg" 
            className="bg-primary text-white shadow-lg hover:shadow-xl transition-shadow"
            asChild
          >
            <Link href="/signup" className="flex items-center gap-2">
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}