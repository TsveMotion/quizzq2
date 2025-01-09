'use client';

import React, { useState, KeyboardEvent, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Brain, Bot, User, Send, Paperclip, Image as ImageIcon, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from 'next/link';

interface ChatInterfaceProps {
  mousePosition: { x: number; y: number }
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: {
    label: string;
    href: string;
  }[];
}

const MAX_MESSAGES = 5;
const LOCAL_STORAGE_KEY = 'quizzq_message_count';

// Website navigation information
const WEBSITE_SECTIONS = {
  signup: {
    path: '/signup',
    description: 'Create your account'
  },
  quiz: {
    path: '/quiz',
    description: 'Create and take quizzes on various subjects'
  },
  dashboard: {
    path: '/dashboard',
    description: 'View your progress, assignments, and statistics'
  },
  assignments: {
    path: '/assignments',
    description: 'Access and complete your assigned work'
  },
  profile: {
    path: '/profile',
    description: 'Manage your account settings and preferences'
  },
  help: {
    path: '/help',
    description: 'Find tutorials and support documentation'
  }
} as const;

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: `👋 Welcome to QuizzQ! I'm here to help you navigate our platform and make the most of your learning experience.

Here are some key features I can help you with:
• Quiz Creation & Taking 📝
• Dashboard & Progress Tracking 📊
• Assignment Management 📚
• Profile Settings ⚙️
• Help & Support 🔍

What would you like to learn more about?`,
  actions: [
    { label: 'Sign Up Now', href: '/signup' }
  ]
};

export default function ChatInterface({ mousePosition }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [remainingMessages, setRemainingMessages] = useState(MAX_MESSAGES);
  const [isClient, setIsClient] = useState(false);

  // Initialize remaining messages from localStorage after mount
  useEffect(() => {
    setIsClient(true);
    const storedCount = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCount) {
      setRemainingMessages(parseInt(storedCount));
    }
  }, []);

  // Update localStorage when remaining messages change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(LOCAL_STORAGE_KEY, remainingMessages.toString());
    }
  }, [remainingMessages, isClient]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const scrollHeight = messagesContainerRef.current.scrollHeight;
      const height = messagesContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      messagesContainerRef.current.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getNavigationResponse = (query: string): Message | null => {
    query = query.toLowerCase();
    
    // Handle sign up related queries
    if (query.includes('sign up') || query.includes('signup') || query.includes('register') || query.includes('create account')) {
      return {
        role: 'assistant',
        content: `Great! I'll help you create your account. Here's how to get started:

1. Click the "Sign Up Now" button below
2. Fill in your details (email, password, etc.)
3. Choose your role (Student/Teacher)
4. Verify your email
5. Start learning!

Need help with anything specific?`,
        actions: [
          { label: 'Sign Up Now', href: '/signup' }
        ]
      };
    }

    // Handle quiz-related queries
    if (query.includes('quiz') || query.includes('test')) {
      return {
        role: 'assistant',
        content: `You can access our quiz features at ${WEBSITE_SECTIONS.quiz.path}. Here you can:
• Create custom quizzes for any subject
• Take practice quizzes
• Review your quiz history
• Share quizzes with others

Would you like to know more about any specific quiz feature?`,
        actions: [
          { label: 'Sign Up to Create Quizzes', href: '/signup' }
        ]
      };
    }

    return null;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || remainingMessages <= 0) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setRemainingMessages(prev => prev - 1);

    // Check for navigation-related response first
    const navigationResponse = getNavigationResponse(inputMessage);
    
    if (navigationResponse) {
      // Use local navigation response
      setTimeout(() => {
        setMessages(prev => [...prev, navigationResponse]);
        setIsLoading(false);
      }, 500);
    } else {
      try {
        // If not navigation-related, simulate AI response
        setTimeout(() => {
          const aiResponse: Message = {
            role: 'assistant',
            content: remainingMessages === 0 
              ? "You've reached your message limit! Sign up now to continue chatting and unlock all features."
              : "I'd be happy to help you with that! Let me guide you through it.",
            actions: [
              { label: 'Sign Up Now', href: '/signup' }
            ]
          };
          setMessages(prev => [...prev, aiResponse]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn("rounded-2xl overflow-hidden bg-white/5 backdrop-blur-lg flex flex-col max-h-[600px]")}>
      {/* Header with Message Count and Sign Up */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <span className="text-white font-medium">QuizzQ AI</span>
        </div>
        <div className="flex items-center gap-4">
          {isClient && (
            <>
              <div className="text-sm text-white/70">
                {remainingMessages > 0 ? (
                  `${remainingMessages} message${remainingMessages === 1 ? '' : 's'} remaining`
                ) : (
                  <span className="text-yellow-400">Message limit reached</span>
                )}
              </div>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-sm font-medium transition-all hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={messagesContainerRef}
        className="p-4 space-y-4 flex-1 overflow-y-auto scroll-smooth"
      >
        {messages.map((message, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-purple-400" />
              ) : (
                <Bot className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-purple-100 whitespace-pre-wrap">{message.content}</p>
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.actions.map((action, actionIndex) => (
                      <Link 
                        key={actionIndex} 
                        href={action.href}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                      >
                        {action.label}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            disabled={remainingMessages <= 0}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            disabled={remainingMessages <= 0}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={remainingMessages > 0 ? "Type your message..." : "Message limit reached. Sign up for more!"}
            className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-white/50"
            disabled={remainingMessages <= 0}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="flex-shrink-0"
            disabled={!inputMessage.trim() || remainingMessages <= 0}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
