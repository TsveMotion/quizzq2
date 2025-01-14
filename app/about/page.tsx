'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Users, 
  School, 
  GraduationCap, 
  FileText, 
  Brain,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
  Target,
  Zap
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

export default function AboutPage() {
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
            className="container relative mx-auto px-4 py-32"
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
                  Revolutionizing Education with AI
                </span>
              </motion.div>

              <motion.h1 
                className="mb-6 font-bold text-white md:text-6xl text-4xl tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                About{' '}
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
                Empowering educators and students with cutting-edge AI technology to create a more 
                engaging, efficient, and personalized learning experience.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-[#1a237e] to-[#283593]">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Brain className="h-8 w-8 text-purple-400" />}
                title="AI-Powered Learning"
                description="Generate engaging assignments and receive personalized tutoring with our advanced AI technology"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Users className="h-8 w-8 text-blue-400" />}
                title="Collaborative Platform"
                description="Connect teachers, students, and administrators in one seamless ecosystem"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Target className="h-8 w-8 text-indigo-400" />}
                title="Personalized Learning"
                description="Adapt to each student's pace and style with customized learning paths"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Clock className="h-8 w-8 text-cyan-400" />}
                title="Real-Time Progress"
                description="Track learning progress and receive instant feedback on assignments"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-teal-400" />}
                title="Secure & Private"
                description="Enterprise-grade security protecting all user data and information"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-emerald-400" />}
                title="Smart Analytics"
                description="Gain insights into learning patterns and performance metrics"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-[#283593] to-[#311b92]">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold tracking-tight text-center mb-12 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Who Benefits from QUIZZQ?
          </motion.h2>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <BenefitRow
                icon={<GraduationCap className="h-6 w-6 text-purple-400" />}
                title="For Teachers"
                benefits={[
                  "AI-assisted assignment creation saves hours of prep time",
                  "Automated grading and progress tracking",
                  "Real-time insights into student performance",
                  "Customizable curriculum templates",
                  "Interactive teaching tools and resources"
                ]}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <BenefitRow
                icon={<BookOpen className="h-6 w-6 text-blue-400" />}
                title="For Students"
                benefits={[
                  "Personalized learning paths adapted to your pace",
                  "24/7 AI tutoring support",
                  "Instant feedback on assignments",
                  "Interactive study materials",
                  "Progress tracking and performance analytics"
                ]}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <BenefitRow
                icon={<School className="h-6 w-6 text-indigo-400" />}
                title="For Schools"
                benefits={[
                  "Comprehensive administrative dashboard",
                  "Data-driven insights for improvement",
                  "Streamlined communication channels",
                  "Resource optimization",
                  "Enhanced learning outcomes"
                ]}
              />
            </motion.div>
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
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands of educators and students already using QUIZZQ to revolutionize their learning journey.
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
                <Link href="/demo" className="flex items-center">
                  Try Demo
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

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="relative overflow-hidden bg-white/10 border-white/20 backdrop-blur-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-start">
          <div className="mb-4 rounded-lg bg-white/20 p-3">
            {icon}
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
          <p className="text-white/70">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BenefitRow({ icon, title, benefits }: {
  icon: React.ReactNode;
  title: string;
  benefits: string[];
}) {
  return (
    <Card className="relative overflow-hidden bg-white/10 border-white/20 backdrop-blur-lg">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="rounded-lg bg-white/20 p-2 mr-3">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 text-green-400 shrink-0 mt-0.5" />
              <span className="text-white/70">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
