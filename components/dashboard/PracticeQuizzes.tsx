'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface PracticeQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
}

interface PracticeQuiz {
  questions: PracticeQuestion[];
}

export default function PracticeQuizzes() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [practiceQuiz, setPracticeQuiz] = useState<PracticeQuiz | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [showPracticeResults, setShowPracticeResults] = useState(false);

  const handleGenerateQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setIsGenerating(true);
    setPracticeQuiz(null);
    setPracticeAnswers({});
    setShowPracticeResults(false);
    
    try {
      const response = await fetch('/api/student/practice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: formData.get('subject'),
          topic: formData.get('topic'),
          numberOfQuestions: parseInt(formData.get('numberOfQuestions') as string),
          difficulty: parseInt(formData.get('difficulty') as string),
          ageGroup: formData.get('ageGroup'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setPracticeQuiz(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate practice quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Practice Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateQuiz} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  name="subject"
                  placeholder="e.g., Mathematics, Science, History"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <Input
                  name="topic"
                  placeholder="e.g., Algebra, Chemical Reactions"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <select
                  name="numberOfQuestions"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  {[5, 10, 15, 20].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty (1-5)</label>
                <select
                  name="difficulty"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  {[1, 2, 3, 4, 5].map(level => (
                    <option key={level} value={level}>
                      {level} - {
                        level === 1 ? 'Basic' :
                        level === 2 ? 'Elementary' :
                        level === 3 ? 'Intermediate' :
                        level === 4 ? 'Advanced' :
                        'Expert'
                      }
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Age Group</label>
                <select
                  name="ageGroup"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  {[
                    'Year 7 (11-12 years)',
                    'Year 8 (12-13 years)',
                    'Year 9 (13-14 years)',
                    'Year 10 (14-15 years)',
                    'Year 11 (15-16 years)'
                  ].map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-current rounded-full animate-spin" />
                  <span>Generating Your Quiz...</span>
                </div>
              ) : (
                'Generate Quiz'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isGenerating && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4" />
            <h3 className="text-lg font-medium mb-2">Creating Your Custom Quiz</h3>
            <div className="text-muted-foreground text-center space-y-1">
              <p>Our AI is crafting questions just for you...</p>
              <p className="text-sm">This may take a few moments</p>
            </div>
          </CardContent>
        </Card>
      )}

      {practiceQuiz && practiceQuiz.questions && practiceQuiz.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Practice Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {practiceQuiz.questions.map((question, index) => (
                <div key={index} className="space-y-4">
                  <div className="font-medium">Question {index + 1}</div>
                  <p className="text-lg">{question.questionText}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map((option) => {
                      const optionText = question[`option${option}` as keyof typeof question] as string;
                      const isSelected = practiceAnswers[index] === option;
                      const showResult = showPracticeResults;
                      const isCorrect = showResult && option === question.correctOption;
                      const isWrong = showResult && isSelected && option !== question.correctOption;
                      
                      return (
                        <div
                          key={option}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            showResult ? 'cursor-default' : 'hover:bg-gray-50'
                          } ${
                            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          } ${
                            isCorrect ? 'border-green-500 bg-green-50' :
                            isWrong ? 'border-red-500 bg-red-50' : ''
                          }`}
                          onClick={() => {
                            if (!showPracticeResults) {
                              setPracticeAnswers(prev => ({
                                ...prev,
                                [index]: option
                              }));
                            }
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                            }`}>
                              {option}
                            </div>
                            <span>{optionText}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {showPracticeResults && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      practiceAnswers[index] === question.correctOption
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`font-medium ${
                        practiceAnswers[index] === question.correctOption
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}>
                        {practiceAnswers[index] === question.correctOption
                          ? 'Correct!'
                          : `Incorrect. The correct answer is ${question.correctOption}`}
                      </p>
                      <p className="mt-2 text-gray-600">{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">
                  {Object.keys(practiceAnswers).length} of {practiceQuiz.questions.length} questions answered
                </div>
                <Button
                  onClick={() => setShowPracticeResults(true)}
                  disabled={Object.keys(practiceAnswers).length !== practiceQuiz.questions.length}
                >
                  Check Answers
                </Button>
              </div>

              {showPracticeResults && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Quiz Results</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {practiceQuiz.questions.filter((_, index) => 
                      practiceAnswers[index] === practiceQuiz.questions[index].correctOption
                    ).length} / {practiceQuiz.questions.length} Correct
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setPracticeQuiz(null);
                      setPracticeAnswers({});
                      setShowPracticeResults(false);
                    }}
                  >
                    Generate New Quiz
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
