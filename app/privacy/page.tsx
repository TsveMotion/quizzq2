'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck, Database, Server } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Shield,
      title: 'Data Protection',
      content: 'We implement industry-standard security measures to protect your personal information. All data is encrypted in transit and at rest using advanced encryption protocols.'
    },
    {
      icon: Lock,
      title: 'Information Collection',
      content: 'We collect only essential information needed to provide our services, including email addresses, names, and usage data to improve your experience.'
    },
    {
      icon: Eye,
      title: 'Data Usage',
      content: 'Your data is used solely for providing and improving our services. We never sell your personal information to third parties.'
    },
    {
      icon: UserCheck,
      title: 'User Rights',
      content: 'You have the right to access, modify, or delete your personal information at any time. Contact us for any data-related requests.'
    },
    {
      icon: Database,
      title: 'Data Storage',
      content: 'Your data is stored securely on servers located in compliance with relevant data protection regulations.'
    },
    {
      icon: Server,
      title: 'Third-Party Services',
      content: 'We may use third-party services for analytics and service improvement. All third-party providers are carefully vetted for security compliance.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a237e] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Privacy Policy
          </h1>
          <p className="text-indigo-200/70 text-lg">
            Last updated: January 13, 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <p className="text-indigo-200/70 mb-8">
            At QuizzQ, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, and protect your personal information when you use our services.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="bg-indigo-900/20 p-6 rounded-lg border border-indigo-500/20 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <section.icon className="h-6 w-6 text-indigo-400" />
                  <h2 className="text-xl font-semibold text-indigo-100">
                    {section.title}
                  </h2>
                </div>
                <p className="text-indigo-200/70">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 space-y-6 text-indigo-200/70">
            <h2 className="text-2xl font-semibold text-indigo-100">Contact Us</h2>
            <p>
              If you have any questions about our Privacy Policy or how we handle your data,
              please contact us at:
            </p>
            <ul className="list-disc list-inside">
              <li>Email: privacy@quizzq.com</li>
              <li>Address: 123 Education Street, Learning City, 12345</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
