'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Target, Users, Brain, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { TimelineItem } from "@/components/timeline-item";
import { AnimatedQuote } from "@/components/animated-quote";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] animate-grid" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Our Journey to Transform Education
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              From a young student's vision to an AI-powered learning platform
            </motion.p>
          </div>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Founder's Quote */}
          <div className="mb-16">
            <AnimatedQuote 
              quote="Every failure was a lesson, every setback a setup for a comeback. QUIZZQ wasn't just about creating an app; it was about proving that age is just a number when it comes to making a difference in education."
            />
          </div>

          {/* Mission and Values */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3 mb-16"
          >
            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <Target className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Our Mission</CardTitle>
                  <CardDescription>
                    To revolutionize exam preparation by making AI-powered learning accessible to every student.
                  </CardDescription>
                </CardHeader>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full" />
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <Brain className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Our Vision</CardTitle>
                  <CardDescription>
                    To create a world where every student has access to personalized, AI-enhanced education.
                  </CardDescription>
                </CardHeader>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full" />
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <Star className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Our Impact</CardTitle>
                  <CardDescription>
                    Empowering students to achieve their academic goals through innovative technology.
                  </CardDescription>
                </CardHeader>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full" />
              </Card>
            </motion.div>
          </motion.div>

          {/* Founder's Story */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="relative overflow-hidden">
              <CardHeader>
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-2xl mb-4">The QUIZZQ Story</CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent className="prose dark:prose-invert">
                <motion.div variants={itemVariants}>
                  <p className="text-lg mb-6">
                    QUIZZQ was founded by Kristiyan Tsvetanov in 2024, at the remarkable age of 15 while still in Year 11. 
                    What started as an ambitious vision to revolutionize exam preparation became a journey of persistence, 
                    learning, and determination.
                  </p>
                  <p className="text-lg mb-6">
                    The path wasn't always smooth. Between 2024 and 2025, Kristiyan faced numerous challenges, leading to 
                    three instances where the project seemed insurmountable. But each setback only fueled his determination 
                    to create something truly transformative in education.
                  </p>
                  <p className="text-lg">
                    Today, QUIZZQ stands as a testament to young innovation and perseverance, proving that great ideas 
                    can come from anywhere, and age is no barrier to creating meaningful change.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline */}
          <div className="relative mb-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary/50 to-accent/50" />
            
            <div className="space-y-12">
              <TimelineItem
                date="Early 2024"
                title="The First Attempt"
                description="Initial concept development and first prototype, facing challenges with technical implementation."
                isLeft={true}
              />
              <TimelineItem
                date="Mid 2024"
                title="Learning and Rebuilding"
                description="After the first setback, focused on learning new technologies and rebuilding with improved architecture."
                isLeft={false}
              />
              <TimelineItem
                date="Late 2024"
                title="Breakthrough Moment"
                description="Integration of AI capabilities and development of core features, despite temporary setbacks."
                isLeft={true}
              />
              <TimelineItem
                date="Early 2025"
                title="Final Push"
                description="Overcoming the final hurdles to create a working platform that truly serves students' needs."
                isLeft={false}
              />
            </div>
          </div>

          {/* Inspiration Quote */}
          <div className="mb-16">
            <AnimatedQuote 
              quote="To all young dreamers out there: your age is your advantage, not your limitation. Every obstacle is an opportunity to learn, and every failure is a step closer to success."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
