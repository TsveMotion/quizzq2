'use client';

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { School, Users, Trophy, Sparkles, BookOpen } from "lucide-react";
import { AnimatedForm } from "@/components/animated-form";

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

export default function ContactPage() {
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
              Partner With QUIZZQ
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Transform your school's exam preparation with AI-powered learning
            </motion.p>
          </div>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Benefits */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold mb-8">
                  Why Schools Choose QUIZZQ
                </h2>
              </motion.div>

              <motion.div variants={itemVariants} className="grid gap-6">
                <Card className="p-6 relative overflow-hidden">
                  <div className="flex gap-4">
                    <Trophy className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Improved Results</h3>
                      <p className="text-muted-foreground">
                        Our AI-powered platform has helped schools achieve up to 30% improvement in exam results.
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full" />
                </Card>

                <Card className="p-6 relative overflow-hidden">
                  <div className="flex gap-4">
                    <Users className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
                      <p className="text-muted-foreground">
                        Each student receives a customized learning experience adapted to their needs and pace.
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full" />
                </Card>

                <Card className="p-6 relative overflow-hidden">
                  <div className="flex gap-4">
                    <Sparkles className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                      <p className="text-muted-foreground">
                        Get detailed insights into student performance and identify areas for improvement.
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full" />
                </Card>

                <Card className="p-6 relative overflow-hidden">
                  <div className="flex gap-4">
                    <BookOpen className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Comprehensive Support</h3>
                      <p className="text-muted-foreground">
                        24/7 AI tutoring support and a vast library of educational resources.
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full" />
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-6">
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <p className="text-lg font-medium">
                    "QUIZZQ has revolutionized how our students prepare for exams. The AI-powered system provides 
                    personalized support that would be impossible to achieve otherwise."
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    - Head Teacher, Leading UK Secondary School
                  </p>
                </Card>
              </motion.div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <p className="text-muted-foreground mb-8">
                  Interested in bringing QUIZZQ to your school? Fill out the form below and we'll get back to you 
                  with more information about how we can help transform your students' learning experience.
                </p>
                <AnimatedForm />
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
