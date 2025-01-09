'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, FileText, Sparkles, CheckCircle2, AlertCircle, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { QuizQuestion, QuizResponse } from '@/lib/openai';
import cn from 'classnames';

const subjects = [
  { value: 'math', label: 'Mathematics - GCSE', topics: ['Algebra', 'Geometry', 'Number', 'Statistics'] },
  { value: 'english', label: 'English Language - GCSE', topics: ['Reading Comprehension', 'Writing', 'Grammar', 'Literature'] },
  { value: 'science', label: 'Combined Science - GCSE', topics: ['Biology', 'Chemistry', 'Physics'] },
  { value: 'geography', label: 'Geography - GCSE', topics: ['Physical Geography', 'Human Geography', 'Environmental Issues'] },
];

const questionCounts = [
  { value: '3', label: '3 Questions' },
  { value: '5', label: '5 Questions' },
];

const difficulties = [
  { value: 'foundation', label: 'Foundation' },
  { value: 'higher', label: 'Higher' },
];

interface QuestionState {
  userAnswer: string;
  response: QuizResponse | null;
  isChecking: boolean;
}

interface QuizGeneratorDemoProps {
  onGenerate?: (data: any) => Promise<any>;
}

export function QuizGeneratorDemo({ onGenerate }: QuizGeneratorDemoProps) {
  const [subject, setSubject] = useState(subjects[0].value);
  const [questionCount, setQuestionCount] = useState('3'); 
  const [difficulty, setDifficulty] = useState('foundation');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[] | null>(null);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();

  const currentSubject = subjects.find(s => s.value === subject)!;

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setGeneratedQuiz(null);
      setQuestionStates({});
      setCurrentQuestionIndex(0);
      
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: currentSubject.label,
          topics: selectedTopics,
          numQuestions: Math.min(parseInt(questionCount), 3),
          difficulty,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate quiz');
      }

      const data = await response.json();
      setGeneratedQuiz(data.quiz);
      
      // Initialize question states
      const states: Record<number, QuestionState> = {};
      data.quiz.forEach((_: unknown, index: number) => {
        states[index] = {
          userAnswer: '',
          response: null,
          isChecking: false,
        };
      });
      setQuestionStates(states);

      toast({
        title: "Quiz Generated Successfully!",
        description: `Created ${data.quiz.length} questions on ${selectedTopics.join(', ')}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Error Generating Quiz",
        description: "Please try again later",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckAnswer = async (index: number, question: QuizQuestion) => {
    try {
      setQuestionStates(prev => ({
        ...prev,
        [index]: { ...prev[index], isChecking: true }
      }));

      const response = await fetch('/api/quiz/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.question,
          userAnswer: questionStates[index].userAnswer,
          correctAnswer: question.correctAnswer,
          subject: currentSubject.label,
          topic: question.topic,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check answer');
      }

      const data = await response.json();
      setQuestionStates(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          response: data,
          isChecking: false,
        }
      }));

      // Auto-advance to next question after a short delay if answer is correct
      if (data.isCorrect && currentQuestionIndex < (generatedQuiz?.length || 0) - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
        }, 1500);
      }
    } catch (error) {
      console.error('Error checking answer:', error);
      toast({
        title: "Error Checking Answer",
        description: "Please try again",
        variant: "destructive",
      });
      setQuestionStates(prev => ({
        ...prev,
        [index]: { ...prev[index], isChecking: false }
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < (generatedQuiz?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#4169E1]/20 p-2 rounded-lg">
            <Target className="w-6 h-6 text-[#4169E1]" />
          </div>
          <span className="text-lg font-semibold text-white/90">Quiz Generator</span>
        </div>
        <Badge className="bg-gradient-to-r from-[#4169E1]/20 to-[#7B68EE]/20 text-white border border-white/10 px-3 py-1">
          GCSE Level
        </Badge>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-white/90 tracking-tight">
          Generate a Custom Quiz
        </h3>

        <div className="grid gap-6">
          <div className="space-y-2">
            <Label className="text-white/90">Subject</Label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4169E1]/5 to-[#7B68EE]/5 blur-xl rounded-xl transition-all duration-300 group-hover:blur-2xl" />
              <select 
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setSelectedTopics([]);
                }}
                className="relative w-full bg-[#151d3b]/80 backdrop-blur-xl text-white/90 rounded-xl p-4 border border-white/10 transition-all duration-300 hover:border-white/20 focus:border-[#4169E1]/50 focus:ring-1 focus:ring-[#4169E1]/50 outline-none"
              >
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value} className="bg-[#151d3b]">
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/90">Topics</Label>
            <div className="grid grid-cols-2 gap-3">
              {currentSubject.topics.map((topic) => (
                <label 
                  key={topic} 
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer",
                    "hover:bg-[#4169E1]/10",
                    selectedTopics.includes(topic) 
                      ? "bg-[#4169E1]/20 border-[#4169E1]/50 text-white" 
                      : "bg-[#151d3b]/80 border-white/10 text-white/70"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTopics([...selectedTopics, topic]);
                      } else {
                        setSelectedTopics(selectedTopics.filter(t => t !== topic));
                      }
                    }}
                    className="hidden"
                  />
                  <CheckCircle2 
                    className={cn(
                      "w-5 h-5 transition-all",
                      selectedTopics.includes(topic) 
                        ? "text-[#4169E1] scale-100" 
                        : "text-white/20 scale-90"
                    )}
                  />
                  <span className="flex-1">{topic}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/90">Number of Questions</Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4169E1]/5 to-[#7B68EE]/5 blur-xl rounded-xl transition-all duration-300 group-hover:blur-2xl" />
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  className="relative w-full bg-[#151d3b]/80 backdrop-blur-xl text-white/90 rounded-xl p-4 border border-white/10 transition-all duration-300 hover:border-white/20 focus:border-[#4169E1]/50 focus:ring-1 focus:ring-[#4169E1]/50 outline-none"
                >
                  {questionCounts.map((count) => (
                    <option key={count.value} value={count.value} className="bg-[#151d3b]">
                      {count.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Difficulty</Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4169E1]/5 to-[#7B68EE]/5 blur-xl rounded-xl transition-all duration-300 group-hover:blur-2xl" />
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="relative w-full bg-[#151d3b]/80 backdrop-blur-xl text-white/90 rounded-xl p-4 border border-white/10 transition-all duration-300 hover:border-white/20 focus:border-[#4169E1]/50 focus:ring-1 focus:ring-[#4169E1]/50 outline-none"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty.value} value={difficulty.value} className="bg-[#151d3b]">
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || selectedTopics.length === 0}
          className={cn(
            "w-full relative group overflow-hidden",
            "bg-gradient-to-r from-[#4169E1] to-[#7B68EE] hover:from-[#4169E1]/90 hover:to-[#7B68EE]/90",
            "text-white font-medium py-6 mt-4",
            "transition-all duration-300",
            "disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
          )}
          size="lg"
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Generating Quiz...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Generate Quiz</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
        </Button>
      </div>

      {generatedQuiz && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4169E1]/10 to-[#7B68EE]/10 blur-xl rounded-xl" />
            <div className="relative bg-[#151d3b]/80 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-white/90">Question {currentQuestionIndex + 1} of {generatedQuiz.length}</h4>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === generatedQuiz.length - 1}
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {generatedQuiz[currentQuestionIndex] && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-white/90 font-medium mb-2">
                            {generatedQuiz[currentQuestionIndex].question}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Badge variant="outline">{generatedQuiz[currentQuestionIndex].topic}</Badge>
                            <Badge variant="outline">{generatedQuiz[currentQuestionIndex].difficulty}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Input
                          value={questionStates[currentQuestionIndex]?.userAnswer || ''}
                          onChange={(e) => setQuestionStates(prev => ({
                            ...prev,
                            [currentQuestionIndex]: { ...prev[currentQuestionIndex], userAnswer: e.target.value }
                          }))}
                          placeholder="Type your answer here..."
                          className="flex-1 bg-[#151d3b]/50 border-white/10 text-white/90 placeholder:text-white/30"
                        />
                        <Button
                          onClick={() => handleCheckAnswer(currentQuestionIndex, generatedQuiz[currentQuestionIndex])}
                          disabled={!questionStates[currentQuestionIndex]?.userAnswer || questionStates[currentQuestionIndex]?.isChecking}
                          className={cn(
                            "relative group overflow-hidden",
                            "bg-gradient-to-r from-[#4169E1] to-[#7B68EE]",
                            "hover:from-[#4169E1]/90 hover:to-[#7B68EE]/90",
                            "disabled:from-gray-600 disabled:to-gray-700"
                          )}
                        >
                          {questionStates[currentQuestionIndex]?.isChecking ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      <AnimatePresence>
                        {questionStates[currentQuestionIndex]?.response && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={cn(
                              "p-4 rounded-lg",
                              questionStates[currentQuestionIndex].response.isCorrect
                                ? "bg-green-500/10 border border-green-500/20"
                                : "bg-red-500/10 border border-red-500/20"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              {questionStates[currentQuestionIndex].response.isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                              )}
                              <div className="space-y-2">
                                <p className="text-white/90">{questionStates[currentQuestionIndex].response.feedback}</p>
                                <p className="text-white/70 text-sm">{questionStates[currentQuestionIndex].response.explanation}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
