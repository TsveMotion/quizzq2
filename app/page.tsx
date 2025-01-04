'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Brain, 
  GraduationCap, 
  MessageSquareMore, 
  Sparkles,
  Target,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { AnimatedBook } from "@/components/animated-book";
import { AnimatedStatsCard } from "@/components/animated-stats-card";
import { FloatingIcons } from "@/components/floating-icons";
import { AnimatedStepCard } from "@/components/animated-step-card";
import { AnimatedFeature } from "@/components/animated-feature";

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

export default function Home() {
  return (
    <>
      {/* Hero Section with Animated Background */}
      <section className="hero-gradient relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] animate-grid" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container relative mx-auto px-4"
        >
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <motion.h1 
              className="mb-6 text-6xl font-bold text-white dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Transform Your Learning Journey with AI
            </motion.h1>
            <motion.p 
              className="mb-8 text-xl text-white/90 dark:text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Experience personalized education powered by advanced AI technology.
              Take quizzes, get instant feedback, and learn at your own pace.
            </motion.p>
            <motion.div 
              className="space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
                <Link href="/demo">Try Demo</Link>
              </Button>
            </motion.div>
          </div>

          {/* Animated Book */}
          <div className="hidden lg:block">
            <AnimatedBook />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative overflow-hidden bg-accent/5 py-24 dark:bg-accent/10">
        <FloatingIcons />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <AnimatedStatsCard number="10k+" label="Active Students" />
            <AnimatedStatsCard number="50+" label="Subjects" />
            <AnimatedStatsCard number="98%" label="Success Rate" />
            <AnimatedStatsCard number="24/7" label="AI Support" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Why Choose QUIZZQ?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Our platform combines cutting-edge AI technology with proven learning methodologies
              to deliver an unmatched educational experience.
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatedFeature
              icon={<Brain className="h-10 w-10 text-primary" />}
              title="AI-Powered Learning"
              description="Adaptive learning paths that adjust to your understanding and pace"
            />
            <AnimatedFeature
              icon={<MessageSquareMore className="h-10 w-10 text-primary" />}
              title="24/7 AI Tutoring"
              description="Get instant help from our AI chatbots whenever you need it"
            />
            <AnimatedFeature
              icon={<Sparkles className="h-10 w-10 text-primary" />}
              title="Smart Assignments"
              description="Auto-graded assignments with detailed feedback and explanations"
            />
            <AnimatedFeature
              icon={<Target className="h-10 w-10 text-primary" />}
              title="Personalized Goals"
              description="Set and track your learning objectives with AI-driven recommendations"
            />
            <AnimatedFeature
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Collaborative Learning"
              description="Connect with peers and form study groups for better understanding"
            />
            <AnimatedFeature
              icon={<BookOpen className="h-10 w-10 text-primary" />}
              title="Rich Content Library"
              description="Access a vast collection of study materials and practice questions"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-accent/5 py-24 dark:bg-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground">How QUIZZQ Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get started with QUIZZQ in three simple steps and transform your learning experience.
            </p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <AnimatedStepCard
              number="1"
              title="Create Your Profile"
              description="Sign up and tell us about your learning goals and preferences"
            />
            <AnimatedStepCard
              number="2"
              title="Choose Your Subjects"
              description="Select from our wide range of subjects and topics"
            />
            <AnimatedStepCard
              number="3"
              title="Start Learning"
              description="Begin your personalized learning journey with AI assistance"
            />
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              See QUIZZQ in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience our interactive learning platform with real examples.
            </p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <ExampleFeature
                title="AI Study Helper"
                description="Get instant answers to your questions and detailed explanations"
                icon={<Brain className="w-6 h-6 text-primary" />}
              />
              <ExampleFeature
                title="Practice Questions"
                description="Access thousands of practice questions with step-by-step solutions"
                icon={<BookOpen className="w-6 h-6 text-primary" />}
              />
              <ExampleFeature
                title="Progress Tracking"
                description="Monitor your improvement with detailed analytics and insights"
                icon={<Target className="w-6 h-6 text-primary" />}
              />
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-10" />
              <Image
                src="/dashboard-preview.png"
                alt="QUIZZQ Dashboard Preview"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-accent/5 dark:bg-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied students who have transformed their learning with QUIZZQ.
            </p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <TestimonialCard
              quote="QUIZZQ has completely transformed how I study. The AI tutor is like having a personal teacher 24/7!"
              author="Sarah K."
              role="University Student"
            />
            <TestimonialCard
              quote="The practice questions and instant feedback have helped me improve my grades significantly."
              author="Michael R."
              role="High School Student"
            />
            <TestimonialCard
              quote="As a teacher, I love how QUIZZQ helps my students learn at their own pace with AI support."
              author="Prof. James L."
              role="High School Teacher"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/90 via-primary to-primary/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] animate-grid" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-white dark:text-white">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl mb-8 text-white/90 dark:text-white/90 max-w-2xl mx-auto">
              Join thousands of students already using QUIZZQ to achieve their academic goals. Start your journey today!
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90 hover:text-primary/90 font-semibold"
              asChild
            >
              <Link href="/signup">Start Learning Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ... */}
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="text-primary mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </Card>
    </motion.div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="text-center"
    >
      <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div 
      variants={itemVariants}
      className="relative p-6 rounded-lg bg-background border"
    >
      <div className="text-4xl font-bold text-primary/20 absolute top-4 right-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

function ExampleFeature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div 
      variants={itemVariants}
      className="flex items-start space-x-4"
    >
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <motion.div 
      variants={itemVariants}
      className="p-6 rounded-lg bg-background border"
    >
      <div className="text-primary mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <p className="text-lg mb-4 italic">{quote}</p>
      <div>
        <div className="font-semibold">{author}</div>
        <div className="text-sm text-muted-foreground">{role}</div>
      </div>
    </motion.div>
  );
}