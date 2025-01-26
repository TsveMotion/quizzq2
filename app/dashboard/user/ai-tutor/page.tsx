'use client';

import { Card } from "@/components/ui/card";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/components/chat-message";
import { useSession } from "next-auth/react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIUsage {
  aiDailyUsage: number;
  aiMonthlyUsage: number;
  aiLifetimeUsage: number;
  subscriptionPlan: string;
}

export default function AITutorPage() {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI tutor. How can I help you today?"
    }
  ]);
  const [usage, setUsage] = useState<AIUsage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch AI usage on mount and after each message
  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/ai/credits');
      if (!response.ok) throw new Error('Failed to fetch usage');
      const data = await response.json();
      setUsage(data);
    } catch (err) {
      console.error('Failed to fetch AI usage:', err);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || !session) return;

    try {
      setIsLoading(true);
      // Add user message immediately
      const userMessage: Message = { role: 'user', content: message };
      setMessages(prev => [...prev, userMessage]);
      setMessage('');

      // Get AI response
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to get AI response');
        return;
      }

      const aiResponse: Message = {
        role: 'assistant',
        content: data.content
      };
      setMessages(prev => [...prev, aiResponse]);
      
      // Refresh usage after message
      await fetchUsage();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Tutor</h1>
        <p className="text-white/70 mt-1">Practice and learn with AI assistance</p>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <Card className="p-4 bg-white/5 border-white/10 lg:col-span-3">
          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2 text-red-500 bg-red-500/10 rounded">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border-white/10">
          <h2 className="font-semibold mb-4">AI Usage</h2>
          {usage && (
            <div className="space-y-2">
              <p>Daily: {usage.aiDailyUsage}/10</p>
              <p>Monthly: {usage.aiMonthlyUsage}/1000</p>
              <p>Total: {usage.aiLifetimeUsage}</p>
              <p className="text-sm text-white/70">
                Plan: {usage.subscriptionPlan}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
