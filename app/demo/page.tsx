'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, GraduationCap, MessageSquareMore, Sparkles, ArrowLeft } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Demo Components
import { DemoQuiz } from '@/components/demo/DemoQuiz';
import { DemoAIHelper } from '@/components/demo/DemoAIHelper';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DemoPage() {
  const [activeQuiz, setActiveQuiz] = useState<'math' | 'science' | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/90 py-24">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] animate-grid" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-3xl text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1 
              className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
              variants={fadeIn}
            >
              Experience QUIZZQ
            </motion.h1>
            <motion.p 
              className="mx-auto mb-8 max-w-2xl text-lg text-white/90 md:text-xl"
              variants={fadeIn}
            >
              Try our interactive demo and discover how AI-powered learning can transform your educational journey.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="quiz" className="mx-auto space-y-8 max-w-4xl">
            <div className="bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border border-slate-800 rounded-full p-1">
              <TabsList className="w-full grid grid-cols-3 bg-transparent relative">
                <TabsTrigger 
                  value="quiz" 
                  className="relative rounded-full px-8 py-2.5 text-sm font-medium transition-all 
                    data-[state=active]:bg-[#6D28D9] data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400
                    focus:outline-none focus:ring-0"
                >
                  Interactive Quiz
                </TabsTrigger>
                <TabsTrigger 
                  value="ai" 
                  className="relative rounded-full px-8 py-2.5 text-sm font-medium transition-all 
                    data-[state=active]:bg-[#6D28D9] data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400
                    focus:outline-none focus:ring-0"
                >
                  AI Study Helper
                </TabsTrigger>
                <TabsTrigger 
                  value="features" 
                  className="relative rounded-full px-8 py-2.5 text-sm font-medium transition-all 
                    data-[state=active]:bg-[#6D28D9] data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400
                    focus:outline-none focus:ring-0"
                >
                  Key Features
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Quiz Tab */}
            <TabsContent value="quiz" className="mt-0 space-y-6">
              {!activeQuiz ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={stagger}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-2xl">Choose Your Quiz</CardTitle>
                      <CardDescription className="text-base">
                        Test your knowledge with our adaptive quizzes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        <motion.div variants={fadeIn}>
                          <Card className="h-full">
                            <CardHeader className="space-y-2">
                              <CardTitle className="text-xl">Math Quiz</CardTitle>
                              <CardDescription>
                                Practice algebra and mathematical concepts
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button 
                                className="w-full" 
                                onClick={() => setActiveQuiz('math')}
                                size="lg"
                              >
                                Start Math Quiz
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                        <motion.div variants={fadeIn}>
                          <Card className="h-full">
                            <CardHeader className="space-y-2">
                              <CardTitle className="text-xl">Science Quiz</CardTitle>
                              <CardDescription>
                                Explore biology and scientific principles
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button 
                                className="w-full"
                                onClick={() => setActiveQuiz('science')}
                                size="lg"
                              >
                                Start Science Quiz
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={fadeIn}
                  className="space-y-6"
                >
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      onClick={() => setActiveQuiz(null)}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Quiz Selection
                    </Button>
                  </div>
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <DemoQuiz type={activeQuiz} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            {/* AI Helper Tab */}
            <TabsContent value="ai" className="mt-0">
              <motion.div
                initial="initial"
                animate="animate"
                variants={fadeIn}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <DemoAIHelper />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="mt-0">
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Why Choose QUIZZQ?</CardTitle>
                    <CardDescription className="text-base">
                      Discover our unique features designed to enhance your learning experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <motion.div variants={fadeIn}>
                        <Card className="h-full">
                          <CardHeader className="space-y-3">
                            <Brain className="h-8 w-8 text-primary" />
                            <CardTitle>AI-Powered Learning</CardTitle>
                            <CardDescription>
                              Personalized learning paths that adapt to your understanding
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                      <motion.div variants={fadeIn}>
                        <Card className="h-full">
                          <CardHeader className="space-y-3">
                            <MessageSquareMore className="h-8 w-8 text-primary" />
                            <CardTitle>24/7 AI Support</CardTitle>
                            <CardDescription>
                              Get instant help from our AI tutors anytime you need
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                      <motion.div variants={fadeIn}>
                        <Card className="h-full">
                          <CardHeader className="space-y-3">
                            <Sparkles className="h-8 w-8 text-primary" />
                            <CardTitle>Smart Progress Tracking</CardTitle>
                            <CardDescription>
                              Monitor your improvement with detailed analytics
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                      <motion.div variants={fadeIn}>
                        <Card className="h-full">
                          <CardHeader className="space-y-3">
                            <GraduationCap className="h-8 w-8 text-primary" />
                            <CardTitle>Comprehensive Coverage</CardTitle>
                            <CardDescription>
                              Wide range of subjects and topics to explore
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/90 py-24">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] animate-grid" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-3xl text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 
              className="mb-6 text-3xl font-bold text-white md:text-4xl"
              variants={fadeIn}
            >
              Ready to Start Learning?
            </motion.h2>
            <motion.p 
              className="mx-auto mb-8 max-w-2xl text-lg text-white/90"
              variants={fadeIn}
            >
              Join thousands of students already using QUIZZQ to achieve their academic goals.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/signup">Get Started Now</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
