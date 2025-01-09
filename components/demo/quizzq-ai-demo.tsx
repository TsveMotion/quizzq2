'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Calculator, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import cn from 'classnames';

// Sample GCSE Math questions
const questions = [
  {
    id: 1,
    subject: 'Mathematics - GCSE',
    topic: 'Algebra',
    difficulty: 'Foundation',
    question: 'Solve this equation: 2x + 5 = 13',
    hint: 'Subtract 5 from both sides, then divide by 2',
  },
  {
    id: 2,
    subject: 'Mathematics - GCSE',
    topic: 'Geometry',
    difficulty: 'Foundation',
    question: 'Calculate the area of a rectangle with length 8cm and width 5cm',
    hint: 'Use the formula: Area = length × width',
  },
  {
    id: 3,
    subject: 'Mathematics - GCSE',
    topic: 'Number',
    difficulty: 'Foundation',
    question: 'What is 15% of 80?',
    hint: 'Convert 15% to a decimal (0.15) and multiply',
  },
];

export function QuizzQAIDemo() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAnswer('');
      setFeedback(null);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
      setFeedback(null);
    }
  };

  const handleGetFeedback = async () => {
    setIsLoading(true);
    // Simulate AI feedback delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sample feedback based on the current question
    const feedbackMessages = {
      1: `Let's solve this step by step:
1. Start with 2x + 5 = 13
2. Subtract 5 from both sides: 2x = 8
3. Divide both sides by 2: x = 4
Therefore, x = 4 is the solution. You can verify this by plugging it back into the original equation.`,
      2: `The area of a rectangle can be found using the formula A = l × w
In this case: Area = 8cm × 5cm = 40cm²`,
      3: `To find 15% of 80:
1. Convert 15% to a decimal: 15% = 0.15
2. Multiply: 80 × 0.15 = 12
Therefore, 15% of 80 is 12`,
    };

    setFeedback(feedbackMessages[currentQuestion.id as keyof typeof feedbackMessages]);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#4169E1]/20 p-2 rounded-lg">
            <Calculator className="w-6 h-6 text-[#4169E1]" />
          </div>
          <span className="text-lg font-semibold text-white/90">{currentQuestion.subject}</span>
        </div>
        <Badge className="bg-gradient-to-r from-[#4169E1]/20 to-[#7B68EE]/20 text-white border border-white/10 px-3 py-1">
          {currentQuestion.difficulty}
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white/90 tracking-tight">
              {currentQuestion.question}
            </h3>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4169E1]/5 to-[#7B68EE]/5 blur-xl rounded-xl transition-all duration-300 group-hover:blur-2xl" />
              <div className="relative bg-[#151d3b]/80 backdrop-blur-xl rounded-xl border border-white/10 transition-all duration-300 group-hover:border-white/20">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full bg-transparent text-white/90 placeholder:text-white/30 resize-none min-h-[120px] p-6 border-none focus:ring-0 focus:outline-none"
                />
              </div>
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#4169E1]/10 to-[#7B68EE]/10 blur-xl rounded-xl" />
                <div className="relative bg-gradient-to-r from-[#4169E1]/5 to-[#7B68EE]/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#4169E1]/20 p-1.5 rounded-lg">
                      <Brain className="w-4 h-4 text-[#4169E1]" />
                    </div>
                    <span className="font-semibold text-[#4169E1]">AI Feedback</span>
                  </div>
                  <div className="text-white/80 whitespace-pre-line leading-relaxed">
                    {feedback}
                  </div>
                </div>
              </motion.div>
            )}

            <Button 
              onClick={handleGetFeedback}
              disabled={isLoading || !answer.trim()}
              className={cn(
                "w-full relative group overflow-hidden",
                "bg-gradient-to-r from-[#4169E1] to-[#7B68EE] hover:from-[#4169E1]/90 hover:to-[#7B68EE]/90",
                "text-white font-medium py-6",
                "transition-all duration-300",
                "disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
              )}
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Getting Feedback...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>Get AI Feedback</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className={cn(
            "relative group overflow-hidden",
            "bg-transparent border border-[#4169E1]/30 text-white",
            "hover:bg-[#4169E1]/10 hover:border-[#4169E1]/50",
            "transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Previous Question
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          variant="outline"
          className={cn(
            "relative group overflow-hidden",
            "bg-transparent border border-[#4169E1]/30 text-white",
            "hover:bg-[#4169E1]/10 hover:border-[#4169E1]/50",
            "transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Next Question
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
