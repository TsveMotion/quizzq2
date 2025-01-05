'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import PracticeQuizzes from './PracticeQuizzes';
import { useSession } from 'next-auth/react';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  BookOpen,
  Eye,
  Clock,
  PenSquare,
  CheckSquare,
  ListChecks,
  Settings,
  Bell,
  Sun,
  Moon,
  Languages,
  ChevronRight,
  Send,
  Bot,
  Sparkles,
  Loader2,
  X,
  Pencil,
  Home,
  BarChart3,
  Brain,
  Trophy,
  Target,
  BookOpenCheck,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

interface AssignmentType {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  class: {
    id: string;
    name: string;
  };
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex?: number;
    explanation?: string;
    selectedOption?: number;
  }[];
  status: {
    submitted: boolean;
    score?: number;
    submittedAt?: string;
  };
}

interface AssignmentCardProps {
  assignment: AssignmentType;
  onSelect: (assignment: AssignmentType) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onSelect }) => {
  const hasSubmission = assignment.submissions && assignment.submissions.length > 0;
  const submission = hasSubmission ? assignment.submissions[0] : null;
  const score = submission?.grade || 0;
  const isOverdue = new Date(assignment.dueDate) < new Date() && !hasSubmission;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{assignment.title}</CardTitle>
          {hasSubmission ? (
            <Badge variant="outline" className="bg-green-50">
              Score: {score}%
            </Badge>
          ) : isOverdue ? (
            <Badge variant="destructive">Overdue</Badge>
          ) : (
            <Badge variant="outline">Pending</Badge>
          )}
        </div>
        <CardDescription>
          {assignment.class.name} • Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <ListChecks className="mr-2 h-4 w-4" />
            {assignment.questions.length} Questions
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {hasSubmission ? 'Completed' : 'Not started'}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onSelect(assignment)}
          variant={hasSubmission ? "outline" : "default"}
        >
          {hasSubmission ? (
            <>
              <Eye className="mr-2 h-4 w-4" />
              View Results
            </>
          ) : (
            <>
              <PenSquare className="mr-2 h-4 w-4" />
              Start Assignment
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const AssignmentView = ({ 
  assignment,
  onClose,
  onSubmit
}: { 
  assignment: AssignmentType;
  onClose: () => void;
  onSubmit: (answers: { questionId: string; selectedOption: number }[]) => Promise<void>;
}) => {
  const [answers, setAnswers] = useState<{ questionId: string; selectedOption: number }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing !== -1) {
        const newAnswers = [...prev];
        newAnswers[existing] = { questionId, selectedOption: optionIndex };
        return newAnswers;
      }
      return [...prev, { questionId, selectedOption: optionIndex }];
    });
  };

  const handleSubmit = async () => {
    if (answers.length !== assignment.questions.length) {
      toast({
        title: "Error",
        description: "Please answer all questions before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(answers);
      toast({
        title: "Success",
        description: "Assignment submitted successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assignment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = assignment.questions[currentQuestionIndex];
  const selectedAnswer = answers.find(a => a.questionId === currentQuestion.id)?.selectedOption;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{assignment.title}</DialogTitle>
          <DialogDescription>
            {assignment.class.name} • {assignment.subject}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {assignment.questions.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {answers.length} of {assignment.questions.length} answered
            </div>
          </div>

          <Progress 
            value={(answers.length / assignment.questions.length) * 100} 
            className="h-2"
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className="justify-start h-auto py-4 px-4"
                    onClick={() => handleOptionSelect(currentQuestion.id, index)}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center mr-2">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.min(assignment.questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === assignment.questions.length - 1}
            >
              Next
            </Button>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={answers.length !== assignment.questions.length || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Assignment'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AssignmentTabs = {
  ALL: 'All',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue'
} as const;

type AssignmentTabType = keyof typeof AssignmentTabs;

export default function StudentDashboard({ user }: { user: any }) {
  const { data: session } = useSession();
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentType | null>(null);
  const [assignmentTab, setAssignmentTab] = useState<AssignmentTabType>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'assignments' | 'practice'>('overview');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleAssignmentSubmit = async (answers: { questionId: string; selectedOption: number }[]) => {
    if (!session?.user?.id || !selectedAssignment) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/students/${session.user.id}/assignments/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          answers: answers.map(a => ({
            questionId: a.questionId,
            selectedOption: a.selectedOption
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assignment');
      }

      const submissionData = await response.json();
      
      // Update the assignments list with the new submission
      setAssignments(prevAssignments => 
        prevAssignments.map(assignment => 
          assignment.id === selectedAssignment.id
            ? {
                ...assignment,
                submissions: [{
                  id: submissionData.id,
                  grade: submissionData.grade,
                  answers: submissionData.answers
                }]
              }
            : assignment
        )
      );

      // Show success message
      toast({
        title: "Success!",
        description: "Assignment submitted successfully",
      });

      // Close the assignment view and clear selection
      setSelectedAssignment(null);
      
      // Switch to the completed tab
      setAssignmentTab('COMPLETED');
      
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to submit assignment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const renderQuestionForSubmission = (question: AssignmentType['questions'][0], index: number) => (
    <Card key={question.id} className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="text-base">
          Question {index + 1}
        </CardTitle>
        <CardDescription className="mt-2 text-base font-normal text-foreground">
          {question.question}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((text, idx) => {
            const option = String.fromCharCode(65 + idx);
            const isSelected = selectedAnswers[question.id] === idx;
            
            return (
              <div
                key={option}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-colors",
                  isSelected && "bg-primary/10 border-primary"
                )}
                onClick={() => handleAnswerSelect(question.id, idx)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {option}
                  </div>
                  <span>{text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const getFilteredAssignments = () => {
    switch (assignmentTab) {
      case 'PENDING':
        return assignments.filter(a => !a.submissions?.length);
      case 'COMPLETED':
        return assignments.filter(a => a.submissions?.length > 0);
      case 'OVERDUE':
        return assignments.filter(a => {
          const dueDate = new Date(a.dueDate);
          return !a.submissions?.length && dueDate < new Date();
        });
      default:
        return assignments;
    }
  };

  const calculateAverageScore = () => {
    const submittedAssignments = assignments.filter(a => a.submissions?.length > 0);
    if (submittedAssignments.length === 0) return 0;
    
    const totalScore = submittedAssignments.reduce((acc, curr) => {
      const submission = curr.submissions?.[0];
      return acc + (submission?.grade || 0);
    }, 0);
    
    return Math.round(totalScore / submittedAssignments.length);
  };

  const getNextDueDate = () => {
    const pendingAssignments = assignments.filter(a => !a.submissions?.length)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
    return pendingAssignments[0]?.dueDate ? formatDate(pendingAssignments[0].dueDate) : 'None';
  };

  const getPendingAssignments = () => {
    return assignments.filter(a => !a.submissions?.length);
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/students/${session?.user.id}/assignments`);
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user.id) {
      fetchAssignments();
    }
  }, [session?.user.id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const isOverdue = (dateString: string | undefined) => {
    if (!dateString) return false;
    try {
      return new Date(dateString) < new Date();
    } catch (error) {
      console.error('Error checking if overdue:', error);
      return false;
    }
  };

  const isDueSoon = (dateString: string | undefined) => {
    if (!dateString) return false;
    try {
      const dueDate = new Date(dateString);
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return dueDate > now && dueDate <= tomorrow;
    } catch (error) {
      console.error('Error checking if due soon:', error);
      return false;
    }
  };

  const performanceData = [
    { month: 'Jan', score: 85 },
    { month: 'Feb', score: 78 },
    { month: 'Mar', score: 92 },
    { month: 'Apr', score: 88 },
    { month: 'May', score: 95 },
  ];

  const subjectPerformance = [
    { subject: 'Math', score: 85, total: 100 },
    { subject: 'Science', score: 92, total: 100 },
    { subject: 'English', score: 78, total: 100 },
    { subject: 'History', score: 88, total: 100 },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <BookOpenCheck className="h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="ai-quiz" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Quiz Creator
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Assignments
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {assignments.filter(a => a.status.submitted).length} completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Score
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateAverageScore()}%
                </div>
                <p className="text-xs text-muted-foreground">
                  From {assignments.filter(a => a.status.submitted).length} submissions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Due Date
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getNextDueDate()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {getPendingAssignments().length} pending assignments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Study Streak
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 days</div>
                <p className="text-xs text-muted-foreground">
                  Keep it up!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectPerformance.map((subject) => (
                    <div key={subject.subject}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {subject.subject}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {subject.score}/{subject.total}
                        </span>
                      </div>
                      <Progress value={(subject.score / subject.total) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
              <div className="flex gap-2">
                {Object.entries(AssignmentTabs).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={assignmentTab === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAssignmentTab(key as AssignmentTabType)}
                    className="min-w-[100px]"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {assignments.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="space-y-3">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/60" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">No Assignments Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Your assignments will appear here once they are assigned by your teachers.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredAssignments().map((assignment) => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment}
                    onSelect={setSelectedAssignment}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai-quiz">
          <Card>
            <CardHeader>
              <CardTitle>AI Quiz Creator</CardTitle>
              <CardDescription>
                Generate personalized quizzes to test your knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic or Subject</label>
                <input
                  type="text"
                  placeholder="e.g., World War II, Algebra, Shakespeare..."
                  className="w-full p-2 border rounded-md"
                  value={''}
                  onChange={(e) => {}}
                />
              </div>
              <Button 
                className="w-full"
                onClick={() => {}}
                disabled={true}
              >
                <Brain className="h-4 w-4 mr-2" />
                Generate Quiz
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-notif" />
                  <label htmlFor="email-notif">Email notifications for new assignments</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="due-notif" />
                  <label htmlFor="due-notif">Due date reminders</label>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Theme</h3>
                <select className="w-full p-2 border rounded-md">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Language</h3>
                <select className="w-full p-2 border rounded-md">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assignment Details Dialog */}
      <Dialog 
        open={selectedAssignment !== null} 
        onOpenChange={(open) => !open && setSelectedAssignment(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
            <DialogTitle>{selectedAssignment?.title}</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.class.name} • {selectedAssignment?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Assignment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Due Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatDate(selectedAssignment?.dueDate)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedAssignment?.status.submitted ? 'Submitted' :
                     isOverdue(selectedAssignment?.dueDate) ? 'Overdue' :
                     isDueSoon(selectedAssignment?.dueDate) ? 'Due Soon' :
                     'Active'}
                  </p>
                </CardContent>
              </Card>
              {selectedAssignment?.status.submitted ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Your Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedAssignment.status.score}%
                    </div>
                    <Progress 
                      value={selectedAssignment.status.score} 
                      className="h-2 mt-2"
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.keys(selectedAnswers).length} / {selectedAssignment?.questions.length}
                    </div>
                    <Progress 
                      value={
                        (Object.keys(selectedAnswers).length / 
                        (selectedAssignment?.questions.length || 1)) * 100
                      } 
                      className="h-2 mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Questions answered
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold sticky top-0 bg-background z-10">
                Questions
              </h3>
              <div className="space-y-6">
                {selectedAssignment?.status.submitted
                  ? selectedAssignment?.questions.map((question, index) => (
                      <Card key={question.id} className="overflow-hidden">
                        <CardHeader className="border-b">
                          <CardTitle className="text-base">
                            Question {index + 1}
                          </CardTitle>
                          <CardDescription className="mt-2 text-base font-normal text-foreground">
                            {question.question}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {question.options.map((text, idx) => {
                              const option = String.fromCharCode(65 + idx);
                              const isCorrect = question.correctAnswerIndex === idx;
                              const isSelected = question.selectedOption === idx;
                              return (
                                <div
                                  key={option}
                                  className={cn(
                                    "p-4 rounded-lg border",
                                    isCorrect && "bg-green-50 border-green-200 shadow-sm",
                                    isSelected && !isCorrect && "bg-red-50 border-red-200"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium",
                                      isCorrect ? "bg-green-500 text-white" :
                                      isSelected && !isCorrect ? "bg-red-500 text-white" :
                                      "bg-muted text-muted-foreground"
                                    )}>
                                      {option}
                                    </div>
                                    <span className={cn(
                                      isCorrect && "text-green-700 font-medium",
                                      isSelected && !isCorrect && "text-red-700"
                                    )}>
                                      {text}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {question.explanation && (
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                              <p className="font-medium text-sm text-muted-foreground mb-1">
                                Explanation
                              </p>
                              <p className="text-sm">
                                {question.explanation}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  : selectedAssignment?.questions.map((question, index) => 
                      renderQuestionForSubmission(question, index)
                    )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {selectedAssignment && !selectedAssignment.status.submitted && (
            <div className="sticky bottom-0 bg-background pt-4 border-t">
              <AssignmentView 
                assignment={selectedAssignment} 
                onClose={() => setSelectedAssignment(null)} 
                onSubmit={handleAssignmentSubmit}
              />
            </div>
          )}
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
