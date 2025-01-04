'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface QuizQuestion {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  submissions: Array<{
    id: string;
    answer: string;
    isCorrect: boolean;
  }>;
}

interface Assignment {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  questions: QuizQuestion[];
  submissions: Array<{
    id: string;
    content?: string;
    grade?: number;
    answers: Array<{
      questionId: string;
      answer: string;
      isCorrect: boolean;
    }>;
  }>;
}

interface Class {
  id: string;
  name: string;
  description?: string;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  assignments: Assignment[];
}

export default function StudentDashboard({ user }: { user: any }) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'assignments' | 'practice'>('overview');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>>([
    {
      role: 'system',
      content: "I'm your study helper! I can help you understand concepts and guide you to find answers, but I won't give direct answers to quiz questions."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isTyping) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsTyping(true);

    try {
      const response = await fetch('/api/student/ai-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          context: selectedAssignment ? {
            subject: selectedAssignment.subject,
            topic: selectedAssignment.topic,
          } : undefined
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'classes' || activeTab === 'assignments') {
      fetchClasses();
    }
  }, [activeTab]);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/student/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch your classes',
        variant: 'destructive',
      });
    }
  };

  const submitAssignment = async (assignmentId: string) => {
    try {
      if (Object.keys(selectedAnswers).length === 0) {
        toast({
          title: 'Error',
          description: 'Please answer at least one question',
          variant: 'destructive',
        });
        return;
      }

      // Find the assignment
      const assignment = classes
        .flatMap(cls => cls.assignments)
        .find(a => a.id === assignmentId);

      if (!assignment) {
        toast({
          title: 'Error',
          description: 'Assignment not found',
          variant: 'destructive',
        });
        return;
      }

      // Check if all questions are answered
      if (!assignment.questions || assignment.questions.length === 0) {
        toast({
          title: 'Error',
          description: 'No questions found in this assignment',
          variant: 'destructive',
        });
        return;
      }

      const unansweredQuestions = assignment.questions.filter(
        q => !selectedAnswers[q.id]
      );

      if (unansweredQuestions.length > 0) {
        toast({
          title: 'Warning',
          description: `You have ${unansweredQuestions.length} unanswered questions. Please answer all questions before submitting.`,
          variant: 'destructive',
        });
        return;
      }

      setSubmissionStatus('submitting');

      const response = await fetch(`/api/student/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: Object.entries(selectedAnswers).map(([questionId, answer]) => ({
            questionId,
            answer
          }))
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit assignment');
      }

      const result = await response.json();

      setSubmissionStatus('submitted');
      toast({
        title: 'Success',
        description: `Assignment submitted successfully! Your grade: ${result.grade}%`,
      });

      // Show explanations for all questions
      const newExplanations = assignment.questions.reduce((acc, question) => {
        acc[question.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setShowExplanation(newExplanations);

      // Reset selected answers
      setSelectedAnswers({});

      // Refresh classes to update submission status
      await fetchClasses();
    } catch (error) {
      setSubmissionStatus('idle');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit assignment',
        variant: 'destructive',
      });
    }
  };

  const renderQuestion = (question: QuizQuestion, index: number, assignment: Assignment) => {
    const submission = assignment.submissions[0];
    const answer = submission?.answers.find(a => a.questionId === question.id);
    const isSubmitted = !!submission;
    const isCorrect = answer?.isCorrect;

    return (
      <Card key={question.id} className="mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-start">
            <h4 className="font-medium">Question {index + 1}</h4>
            {isSubmitted && (
              <div className="text-sm text-muted-foreground">
                Your answer: {answer?.answer}
                <span className={answer?.isCorrect ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                  ({answer?.isCorrect ? "Correct" : "Incorrect"})
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p className="font-medium">{question.questionText}</p>
          </div>
          
          <div className="space-y-2">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionText = question[`option${option}` as keyof QuizQuestion] as string;
              const isSelected = selectedAnswers[question.id] === option;
              const isDisabled = isSubmitted;
              
              return (
                <div
                  key={option}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isDisabled ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-50'
                  } ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    if (!isDisabled) {
                      setSelectedAnswers(prev => ({
                        ...prev,
                        [question.id]: option
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

          {(isSubmitted || showExplanation[question.id]) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Explanation:</p>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const getPendingAssignments = () => {
    return classes.flatMap(cls => 
      cls.assignments.filter(assignment => 
        !assignment.submissions.length && new Date(assignment.dueDate) > new Date()
      )
    );
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [practiceQuiz, setPracticeQuiz] = useState<{
    questions: Array<{
      questionText: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctOption: string;
      explanation: string;
    }>;
  } | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [showPracticeResults, setShowPracticeResults] = useState(false);

  return (
    <div className="p-6 pb-16">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      
      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button 
          variant={activeTab === 'classes' ? 'default' : 'outline'}
          onClick={() => setActiveTab('classes')}
        >
          My Classes
        </Button>
        <Button 
          variant={activeTab === 'assignments' ? 'default' : 'outline'}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </Button>
        <Button 
          variant={activeTab === 'practice' ? 'default' : 'outline'}
          onClick={() => setActiveTab('practice')}
        >
          Practice Quizzes
        </Button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Enrolled Classes</h3>
                  <p className="text-2xl font-bold">{classes.length}</p>
                </div>
                <div>
                  <h3 className="font-medium">Pending Assignments</h3>
                  <p className="text-2xl font-bold">{getPendingAssignments().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="space-y-4">
          {classes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">You are not enrolled in any classes yet.</p>
          ) : (
            classes.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {cls.description && (
                    <p className="text-gray-600 mb-4">{cls.description}</p>
                  )}
                  <div className="text-sm text-gray-500 mb-4">
                    Teacher: {cls.teacher.name} ({cls.teacher.email})
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Assignments</h3>
                    {cls.assignments.length === 0 ? (
                      <p className="text-gray-500">No assignments yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {cls.assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => setSelectedAssignment(assignment)}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{assignment.title}</h4>
                              <span className="text-sm text-gray-500">
                                Due: {format(new Date(assignment.dueDate), 'PPP')}
                              </span>
                            </div>
                            {assignment.submissions.length > 0 && (
                              <div className="mt-2 text-sm text-green-600">
                                Submitted {assignment.submissions[0].grade !== null && 
                                  `- Grade: ${assignment.submissions[0].grade}/100`}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {getPendingAssignments().length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending assignments.</p>
          ) : (
            getPendingAssignments().map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{assignment.title}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      Due: {format(new Date(assignment.dueDate), 'PPP p')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {assignment.questions?.map((question, index) => 
                      renderQuestion(question, index, assignment)
                    )}
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {Object.keys(selectedAnswers).length} of {assignment.questions?.length || 0} questions answered
                      </div>
                      <Button 
                        onClick={() => submitAssignment(assignment.id)}
                        disabled={
                          submissionStatus === 'submitting' || 
                          !assignment.questions?.length ||
                          Object.keys(selectedAnswers).length !== assignment.questions?.length
                        }
                      >
                        {submissionStatus === 'submitting' 
                          ? 'Submitting...' 
                          : submissionStatus === 'submitted'
                            ? 'Submitted!'
                            : 'Submit Assignment'
                        }
                      </Button>
                    </div>
                    {assignment.questions?.length > 0 && 
                     Object.keys(selectedAnswers).length !== assignment.questions?.length && (
                      <p className="text-sm text-yellow-600 mt-2">
                        Please answer all {assignment.questions.length} questions before submitting.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Practice Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  
                  setIsGenerating(true);
                  setPracticeQuiz(null);
                  setPracticeAnswers({});
                  setShowPracticeResults(false);
                  
                  try {
                    const response = await fetch('/api/student/practice-quiz', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        subject: formData.get('subject'),
                        topic: formData.get('topic'),
                        numberOfQuestions: parseInt(formData.get('numberOfQuestions') as string),
                        complexity: parseInt(formData.get('complexity') as string),
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
                }}
                className="space-y-4"
              >
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
                    <label className="text-sm font-medium">Complexity (1-5)</label>
                    <select
                      name="complexity"
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
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  ) : (
                    'Generate Quiz'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isGenerating && !practiceQuiz && (
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

          {practiceQuiz && (
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
      )}

      <Dialog open={showAiHelper} onOpenChange={setShowAiHelper}>
        <DialogContent className="max-w-2xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>AI Study Helper</span>
              {isTyping && (
                <span className="text-sm text-muted-foreground animate-pulse">
                  typing...
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Ask for help understanding concepts. I won't give direct answers, but I'll guide you to find them yourself.
            </DialogDescription>
          </DialogHeader>
          
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 mb-4 h-[calc(80vh-12rem)]"
          >
            {messages.map((message, index) => (
              message.role !== 'system' && (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <span className="font-bold text-blue-700">{children}</span>,
                            em: ({ children }) => <span className="italic text-gray-600">{children}</span>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            code: ({ children }) => (
                              <code className="bg-gray-200 rounded px-1 py-0.5 text-sm font-mono">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="mt-auto">
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask for help understanding a concept..."
                disabled={isTyping}
              />
              <Button type="submit" disabled={isTyping || !currentMessage.trim()}>
                Send
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        className="fixed bottom-4 right-4 shadow-lg"
        onClick={() => setShowAiHelper(true)}
      >
        <div className="flex items-center gap-2">
          <span>AI Study Helper</span>
          {isTyping && (
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          )}
        </div>
      </Button>

      <Toaster />
    </div>
  );
}
