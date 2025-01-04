'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const sampleResponses = [
  {
    question: "Can you help me understand photosynthesis?",
    answer: `I'd be happy to help you understand photosynthesis! Here's a simple breakdown:

Photosynthesis is how plants make their own food using:
1. Sunlight
2. Water (H₂O)
3. Carbon dioxide (CO₂)

The process happens in the chloroplasts of plant cells and produces:
- Glucose (sugar for energy)
- Oxygen (released into the air)

Think of it like a solar-powered food factory! Would you like to learn more about any specific part of this process?`
  },
  {
    question: "How do I solve quadratic equations?",
    answer: `Let me help you with quadratic equations! Here's a step-by-step approach:

A quadratic equation looks like: ax² + bx + c = 0

You can solve it using these methods:
1. Factoring: Find numbers that multiply to ac and add to b
2. Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a
3. Completing the square

Would you like me to explain any of these methods in more detail?`
  }
];

const MAX_QUESTIONS = 5;
const STORAGE_KEY = 'demo_ai_helper_questions';
const EXPIRY_KEY = 'demo_ai_helper_expiry';
const EXPIRY_DAYS = 7; // Questions reset after 7 days

interface StorageData {
  questionCount: number;
  expiryDate: string;
}

function getStorageData(): StorageData {
  if (typeof window === 'undefined') return { questionCount: 0, expiryDate: new Date().toISOString() };
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  const storedExpiry = localStorage.getItem(EXPIRY_KEY);
  
  if (!storedData || !storedExpiry) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);
    return { questionCount: 0, expiryDate: expiryDate.toISOString() };
  }

  const data: StorageData = { 
    questionCount: parseInt(storedData), 
    expiryDate: storedExpiry 
  };

  // Check if expired
  if (new Date(data.expiryDate) < new Date()) {
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + EXPIRY_DAYS);
    return { questionCount: 0, expiryDate: newExpiryDate.toISOString() };
  }

  return data;
}

export function DemoAIHelper() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI study helper. I can help you understand concepts, solve problems, and prepare for exams. What would you like to learn about? (You can ask up to 5 questions in this demo, and this limit resets after 7 days)"
    }
  ]);
  const [input, setInput] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [expiryDate, setExpiryDate] = useState<string>('');

  // Initialize from localStorage
  useEffect(() => {
    const data = getStorageData();
    setQuestionCount(data.questionCount);
    setExpiryDate(data.expiryDate);
  }, []);

  // Update localStorage when question count changes
  useEffect(() => {
    if (typeof window !== 'undefined' && questionCount > 0) {
      localStorage.setItem(STORAGE_KEY, questionCount.toString());
      localStorage.setItem(EXPIRY_KEY, expiryDate);
    }
  }, [questionCount, expiryDate]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (questionCount >= MAX_QUESTIONS) return;

    // Add user message
    setMessages([...messages, { role: 'user', content: input }]);
    setQuestionCount(prev => prev + 1);

    // Find matching sample response or use default
    const response = sampleResponses.find(r => 
      input.toLowerCase().includes(r.question.toLowerCase().split(' ')[1])
    ) || {
      question: '',
      answer: "That's an interesting question! In the full version, I can help you with any topic. For this demo, try asking about 'photosynthesis' or 'quadratic equations'!"
    };

    // Add AI response after a short delay
    setTimeout(() => {
      const remainingQuestions = MAX_QUESTIONS - (questionCount + 1);
      let questionCountMessage = '';
      
      if (remainingQuestions > 0) {
        questionCountMessage = `\n\n(You have ${remainingQuestions} question${remainingQuestions === 1 ? '' : 's'} remaining in this demo)`;
      } else {
        const expiryDateObj = new Date(expiryDate);
        questionCountMessage = `\n\n(You've reached the demo limit. Your questions will reset on ${expiryDateObj.toLocaleDateString()}. Sign up for unlimited questions!)`;
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.answer + questionCountMessage
      }]);
    }, 1000);

    setInput('');
  };

  const formatTimeUntilReset = () => {
    const expiryDateObj = new Date(expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiryDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'justify-end' : ''
            }`}
          >
            {message.role === 'assistant' && (
              <Brain className="w-6 h-6 text-primary mt-1" />
            )}
            <div
              className={`rounded-lg p-3 max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {questionCount >= MAX_QUESTIONS ? (
        <div className="p-4 border-t">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Demo Limit Reached</AlertTitle>
            <AlertDescription>
              You've used all {MAX_QUESTIONS} questions in this demo. Your questions will reset in {formatTimeUntilReset()}. Sign up now for unlimited access!
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full mt-4">
            <a href="/signup">Sign Up Now</a>
          </Button>
        </div>
      ) : (
        <div className="border-t p-4 space-y-4">
          <div className="text-sm text-muted-foreground">
            {MAX_QUESTIONS - questionCount} question{MAX_QUESTIONS - questionCount === 1 ? '' : 's'} remaining (resets in {formatTimeUntilReset()})
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything... (try 'photosynthesis' or 'quadratic equations')"
            className="min-h-[100px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} className="w-full">
            Send Message
          </Button>
        </div>
      )}
    </Card>
  );
}
