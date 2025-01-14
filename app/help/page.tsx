'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, HelpCircle, Book, MessageCircle, Settings, ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const helpCategories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of QuizzQ and how to set up your account',
      icon: Book,
      link: '/tutorials#getting-started',
    },
    {
      title: 'FAQ',
      description: 'Find answers to commonly asked questions',
      icon: HelpCircle,
      link: '/help/faq',
    },
    {
      title: 'Account Settings',
      description: 'Manage your account, privacy, and preferences',
      icon: Settings,
      link: '/dashboard/settings',
    },
    {
      title: 'Contact Support',
      description: 'Get in touch with our support team',
      icon: MessageCircle,
      link: '/contact',
    },
  ];

  const commonQuestions = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to the login page and click "Forgot Password". Follow the instructions sent to your email.',
    },
    {
      question: 'How do I create a quiz?',
      answer: 'Log in to your account, go to the dashboard, and click the "Create Quiz" button.',
    },
    {
      question: 'Can I share quizzes with other teachers?',
      answer: 'Yes! You can share quizzes with other teachers through the share feature in the quiz settings.',
    },
    {
      question: 'How do students join my class?',
      answer: 'Students can join using your class code. Find your class code in the class settings.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a237e] relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-purple-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-500/20 to-transparent rounded-full blur-3xl" />
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
                  How can we help you?
                </h1>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Find answers, tutorials, and support for all your QuizzQ needs
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
                    placeholder="Search for help..."
                    className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
                  />
                  <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                </div>
              </motion.div>
            </div>

            {/* Help Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto mb-20"
            >
              {helpCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Link href={category.link} key={index} className="block h-full">
                    <Card className="h-full p-6 bg-white/10 hover:bg-white/15 transition-colors border-white/20 backdrop-blur-sm group">
                      <Icon className="h-8 w-8 text-blue-300 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {category.title}
                      </h3>
                      <p className="text-white/70 mb-4">
                        {category.description}
                      </p>
                      <div className="text-blue-300 group-hover:text-blue-200 flex items-center gap-2">
                        Learn more
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </motion.div>

            {/* Common Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto px-4 lg:px-0"
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Common Questions
              </h2>
              <div className="space-y-4">
                {commonQuestions.map((item, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-white/10 border-white/20 backdrop-blur-sm"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.question}
                    </h3>
                    <p className="text-white/70">{item.answer}</p>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-20 px-4 lg:px-0"
            >
              <Card className="max-w-2xl mx-auto p-8 bg-white/10 border-white/20 backdrop-blur-sm">
                <Mail className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  Still need help?
                </h2>
                <p className="text-white/70 mb-6">
                  Our support team is here to help you with any questions or issues
                  you might have.
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
