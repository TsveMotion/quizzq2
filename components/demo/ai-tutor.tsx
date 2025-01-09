'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Send, Loader2, Brain, ArrowRight } from "lucide-react";
import { sampleQuestions } from './demo-data';

export function AiTutorDemo() {
  const [answer, setAnswer] = useState("");
  const [generating, setGenerating] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [currentQuestion] = useState(sampleQuestions[0]);

  const handleSubmit = async () => {
    if (!answer.trim() || generating) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/demo/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: answer.trim(),
          subject: currentQuestion.subject,
          topic: currentQuestion.topic
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFeedback(data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to generate feedback:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-purple-300/20"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-purple-100">{currentQuestion.subject} - {currentQuestion.topic}</h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-200">
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>
          </div>

          <p className="text-lg text-white mb-6">{currentQuestion.question}</p>

          <div className="space-y-4">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[120px] bg-white/5 border-purple-300/20 text-purple-100 placeholder:text-purple-300/40 focus:border-purple-400 focus:ring-purple-400/20"
            />

            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || generating}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting AI Feedback...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Get AI Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Feedback Section */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-purple-300/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-300" />
                </div>
                <h3 className="font-medium text-purple-100">AI Tutor Feedback</h3>
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="space-y-4 text-purple-200/80">
                  {feedback.feedback.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {feedback.hints && feedback.hints.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium text-purple-100">Helpful Hints:</h4>
                    <ul className="space-y-2">
                      {feedback.hints.map((hint: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2 text-purple-200/60"
                        >
                          <ArrowRight className="h-4 w-4 text-purple-400" />
                          {hint}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
