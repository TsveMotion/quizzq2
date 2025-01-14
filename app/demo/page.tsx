'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sparkles, Send, AlertCircle, ArrowRight, Brain, Lightbulb, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DemoPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent form submission from scrolling
    
    if (!input.trim() || isLoading || creditsUsed >= 5) return;

    try {
      setIsLoading(true);
      const userMessage = { role: 'user' as const, content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const response = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sessionId: Math.random().toString(36).substring(7),
          creditsUsed,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error.includes('Demo credits exhausted')) {
          router.push('/pricing');
          return;
        }
        throw new Error(error.error);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      setCreditsUsed(prev => prev + 1);
      
      // Scroll to bottom after AI response
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Only scroll on messages change if the last message is from the AI
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md"
              >
                <span className="flex items-center text-sm font-medium text-white">
                  <Sparkles className="mr-2 h-4 w-4 text-blue-200 animate-pulse" />
                  Try Our AI Learning Assistant
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-4xl font-bold text-white md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white"
              >
                Experience the Future of Learning
              </motion.h1>

              {/* Credits Counter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 flex justify-center"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-white">{5 - creditsUsed}</span>
                    <span className="text-sm text-white/70">Credits Left</span>
                  </div>
                  <div className="h-12 w-px bg-white/20" />
                  <div className="text-left">
                    <p className="text-white/90">Try our AI tutor for free</p>
                    <p className="text-sm text-white/70">Upgrade for unlimited access</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Chat Section */}
        <section className="relative pb-20">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-4xl bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
              <div className="h-[500px] p-6 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 text-white/70">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                        <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                          <Brain className="h-6 w-6 text-blue-300 mb-2" />
                          <h3 className="font-medium text-white mb-1">Ask Questions</h3>
                          <p className="text-sm text-white/70">Get guidance on any topic</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                          <Lightbulb className="h-6 w-6 text-yellow-300 mb-2" />
                          <h3 className="font-medium text-white mb-1">Learn Concepts</h3>
                          <p className="text-sm text-white/70">Understand complex ideas</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                          <Zap className="h-6 w-6 text-purple-300 mb-2" />
                          <h3 className="font-medium text-white mb-1">Practice Skills</h3>
                          <p className="text-sm text-white/70">Interactive learning</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {messages.map((message, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/20 text-white backdrop-blur-sm'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {creditsUsed >= 5 ? (
                  <div className="mt-6 text-center">
                    <div className="mb-4 text-yellow-300 flex items-center justify-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>Demo credits exhausted</span>
                    </div>
                    <Button
                      onClick={() => router.push('/pricing')}
                      className="bg-white text-blue-600 hover:bg-white/90"
                    >
                      Upgrade for Full Access
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="mt-6 flex items-center gap-2"
                  >
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything..."
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className={`${
                        isLoading
                          ? 'bg-white/50'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      } text-white`}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 bg-[#311b92]">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
                Ready for More?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Get unlimited access to our AI Learning Assistant and all premium features.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-white/90"
                  asChild
                >
                  <Link href="/pricing" className="flex items-center">
                    View Pricing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/40 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/signup" className="flex items-center">
                    Sign Up Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
