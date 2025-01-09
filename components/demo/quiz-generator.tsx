'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface QuizGeneratorProps {
  onGenerate: (data: any) => Promise<any>;
}

export function QuizGeneratorDemo({ onGenerate }: QuizGeneratorProps) {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("Solve this equation: 2x + 5 = 13");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    if (!answer || isLoading) return;
    setIsLoading(true);
    try {
      const result = await onGenerate({
        question,
        answer,
        type: "mathematics"
      });
      setFeedback(result.feedback);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-indigo-900/50 border border-white/10 shadow-2xl"
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="relative p-8 space-y-6">
          {/* Subject and Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-white/5">
                <svg
                  className="w-5 h-5 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-purple-100">Mathematics - GCSE</h3>
                <p className="text-sm text-purple-200/60">Foundation</p>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h4 className="text-xl font-medium text-purple-100">{question}</h4>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full bg-white/5 border-white/10 text-purple-100 placeholder-purple-200/40 rounded-xl focus:ring-purple-500/20"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              className="text-purple-200 hover:text-purple-100 hover:bg-white/5"
              onClick={() => {/* Handle previous */}}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Question
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!answer || isLoading}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/20 rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get AI Feedback
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              className="text-purple-200 hover:text-purple-100 hover:bg-white/5"
              onClick={() => {/* Handle next */}}
            >
              Next Question
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-purple-100">AI Feedback</span>
              </div>
              <p className="text-purple-200/80">{feedback}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
