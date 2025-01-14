'use client';

import { Card } from "@/components/ui/card";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIUsageDisplay } from "@/components/ai-usage-display";
import { useAIUsage } from "@/hooks/use-ai-usage";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/components/chat-message";

// Temporary user plan - replace with actual user subscription data
const USER_PLAN: 'free' | 'pro' | 'forever' = 'free';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AITutorPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI tutor. How can I help you today?"
    }
  ]);
  const { dailyUsage, monthlyUsage, incrementUsage } = useAIUsage();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canUseAI = () => {
    if (USER_PLAN === 'free' && dailyUsage >= 10) {
      setError('You have reached your daily limit. Upgrade to Pro for more!');
      return false;
    }
    if (USER_PLAN === 'pro' && monthlyUsage >= 1000) {
      setError('You have reached your monthly limit. Upgrade to Forever for unlimited access!');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    if (!canUseAI()) return;

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

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse: Message = {
        role: 'assistant',
        content: data.content
      };
      setMessages(prev => [...prev, aiResponse]);
      incrementUsage();
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

            <div className="border-t border-white/10 p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <p>{error}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 bg-white/5 border-white/10 text-white"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    className={cn(
                      "bg-blue-500 hover:bg-blue-600",
                      (isLoading || !message.trim() || error) && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isLoading || !message.trim() || !!error}
                  >
                    <Send className={cn(
                      "h-4 w-4",
                      isLoading && "animate-pulse"
                    )} />
                  </Button>
                </div>
                <AIUsageDisplay plan={USER_PLAN} used={10} />
              </form>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border-white/10">
          <h3 className="font-semibold text-white mb-4">Subscription Plans</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-medium text-white">Free Plan</h4>
              <p className="text-sm text-white/70 mt-1">10 uses per day</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-medium text-white">Pro Plan</h4>
              <p className="text-sm text-white/70 mt-1">1,000 uses per month</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-medium text-white">Forever Plan</h4>
              <p className="text-sm text-white/70 mt-1">10,000 lifetime prompts</p>
              <p className="text-sm text-white/70">£69.99 one-time</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
