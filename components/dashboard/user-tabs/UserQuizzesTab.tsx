'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

type Quiz = {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  difficulty: string;
  isPremium: boolean;
  totalQuestions: number;
  timeLimit: number;
  submission?: {
    score: number;
    completedAt: string;
    totalCorrect: number;
    percentageCorrect: number;
  } | null;
};

export function UserQuizzesTab() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const { data: quizzes, error, isLoading } = useSWR<Quiz[]>('/api/user/quizzes');

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load quizzes. Please try again later.",
      variant: "destructive",
    });
  }

  // Get unique subjects for filter
  const subjects = quizzes ? ['all', ...Array.from(new Set(quizzes.map(q => q.subject)))] : ['all'];
  
  // Filter quizzes based on search and filters
  const filteredQuizzes = quizzes?.filter(quiz => {
    const matchesSearch = 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || quiz.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    const matchesPremium = !showPremiumOnly || quiz.isPremium;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesPremium;
  });

  const startQuiz = (quizId: string) => {
    // TODO: Implement quiz start functionality
    console.log('Starting quiz:', quizId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white/5 border-white/10"
        />
        
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject === 'all' ? 'All Subjects' : subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showPremiumOnly ? "default" : "outline"}
          onClick={() => setShowPremiumOnly(!showPremiumOnly)}
          className={showPremiumOnly ? "bg-white/10" : "border-white/10"}
        >
          {showPremiumOnly ? "Premium Only" : "All Quizzes"}
        </Button>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes?.map((quiz) => (
          <Card key={quiz.id} className="p-6 bg-gray-900/40 border-white/10 hover:bg-gray-900/60 transition-colors">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{quiz.title}</h3>
                  <p className="text-sm text-gray-400">{quiz.subject} - {quiz.topic}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={quiz.difficulty === 'EASY' ? 'default' : quiz.difficulty === 'MEDIUM' ? 'secondary' : 'destructive'}>
                    {quiz.difficulty}
                  </Badge>
                  {quiz.isPremium && (
                    <Badge variant="premium">Premium</Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-300 mb-4 flex-grow">{quiz.description}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Questions: {quiz.totalQuestions}</span>
                  <span>Time: {quiz.timeLimit} min</span>
                </div>

                {quiz.submission && (
                  <div className="bg-white/5 p-3 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span>Last Score:</span>
                      <span className="font-semibold">{quiz.submission.percentageCorrect.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Correct: {quiz.submission.totalCorrect}/{quiz.totalQuestions}</span>
                      <span>{new Date(quiz.submission.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full bg-white/10 hover:bg-white/20"
                  onClick={() => startQuiz(quiz.id)}
                >
                  {quiz.submission ? 'Retake Quiz' : 'Start Quiz'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredQuizzes?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No quizzes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
