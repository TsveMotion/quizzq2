'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'assignments'>('overview');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

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

  return (
    <div className="p-6">
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

      <Toaster />
    </div>
  );
}
