'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Book, Users, GraduationCap, ArrowRight, Search, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { TutorialModal } from '@/components/ui/tutorial-modal';

export default function TutorialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tutorialCategories = [
    {
      title: 'For Students',
      description: 'Learn how to join classes, take quizzes, and track your progress',
      icon: GraduationCap,
      tutorials: [
        { title: 'Getting Started as a Student', duration: '5 min' },
        { title: 'Taking Your First Quiz', duration: '3 min' },
        { title: 'Viewing Your Progress', duration: '4 min' },
      ],
    },
    {
      title: 'For Teachers',
      description: 'Create quizzes, manage classes, and monitor student performance',
      icon: Users,
      tutorials: [
        { title: 'Creating Your First Quiz', duration: '6 min' },
        { title: 'Managing Your Classes', duration: '5 min' },
        { title: 'Grading and Feedback', duration: '4 min' },
      ],
    },
    {
      title: 'Advanced Features',
      description: 'Master advanced features and customization options',
      icon: BookOpen,
      tutorials: [
        { title: 'Custom Quiz Settings', duration: '7 min' },
        { title: 'Analytics Dashboard', duration: '5 min' },
        { title: 'Integration Options', duration: '6 min' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a237e] relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-purple-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-500/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Beta Banner */}
      <div className="relative z-20 bg-yellow-400/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-yellow-200">
            <AlertCircle className="h-5 w-5" />
            <p>Tutorials are coming soon! QuizzQ is currently in beta.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
                  Learn QuizzQ
                </h1>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Step-by-step tutorials to help you make the most of QuizzQ
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto mb-12"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tutorials..."
                    className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
                  />
                  <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                </div>
              </motion.div>
            </div>

            {/* Tutorial Categories */}
            <div className="space-y-20">
              {tutorialCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <Icon className="h-8 w-8 text-blue-300" />
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {category.title}
                        </h2>
                        <p className="text-white/70">{category.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {category.tutorials.map((tutorial, tutorialIndex) => (
                        <Card
                          key={tutorialIndex}
                          className="p-6 bg-white/10 hover:bg-white/15 transition-colors border-white/20 backdrop-blur-sm group cursor-pointer"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                              <Play className="h-6 w-6 text-blue-300" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-2">
                                {tutorial.title}
                              </h3>
                              <p className="text-white/70 mb-4">
                                Duration: {tutorial.duration}
                              </p>
                              <div className="text-blue-300 group-hover:text-blue-200 flex items-center gap-2">
                                Watch tutorial
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Need Help CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-20"
            >
              <Card className="max-w-2xl mx-auto p-8 bg-white/10 border-white/20 backdrop-blur-sm">
                <Book className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  Can't find what you're looking for?
                </h2>
                <p className="text-white/70 mb-6">
                  Check out our help center for more resources and support.
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  <Link href="/help">Visit Help Center</Link>
                </Button>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>

      <TutorialModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
