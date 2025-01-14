'use client';

import { motion } from 'framer-motion';
import { Scale, FileText, Users, Shield, AlertCircle, HelpCircle } from 'lucide-react';

export default function TermsOfService() {
  const sections = [
    {
      icon: FileText,
      title: 'Agreement to Terms',
      content: 'By accessing or using QuizzQ, you agree to be bound by these Terms of Service and all applicable laws and regulations.'
    },
    {
      icon: Users,
      title: 'User Responsibilities',
      content: 'Users must maintain accurate account information, protect their credentials, and use the service responsibly and legally.'
    },
    {
      icon: Shield,
      title: 'Intellectual Property',
      content: 'All content, features, and functionality of QuizzQ are owned by us and are protected by international copyright, trademark, and other intellectual property laws.'
    },
    {
      icon: Scale,
      title: 'Acceptable Use',
      content: 'Users agree not to misuse our services or help others do so. This includes attempting to access restricted areas or disrupting the service.'
    },
    {
      icon: AlertCircle,
      title: 'Limitation of Liability',
      content: 'QuizzQ is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of our service.'
    },
    {
      icon: HelpCircle,
      title: 'Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.'
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
            Terms of Service
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
            Welcome to QuizzQ. These Terms of Service ("Terms") govern your access to and use of
            QuizzQ's website, services, and applications. Please read these Terms carefully before
            using our services.
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
            <h2 className="text-2xl font-semibold text-indigo-100">Additional Terms</h2>
            
            <h3 className="text-xl font-semibold text-indigo-100 mt-8">Termination</h3>
            <p>
              We reserve the right to terminate or suspend access to our service immediately,
              without prior notice or liability, for any reason whatsoever, including without
              limitation if you breach the Terms.
            </p>

            <h3 className="text-xl font-semibold text-indigo-100 mt-8">Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of
              the jurisdiction in which QuizzQ operates, without regard to its conflict of
              law provisions.
            </p>

            <h3 className="text-xl font-semibold text-indigo-100 mt-8">Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul className="list-disc list-inside">
              <li>Email: legal@quizzq.com</li>
              <li>Address: 123 Education Street, Learning City, 12345</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
