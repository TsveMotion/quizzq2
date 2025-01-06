'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  BarChart,
  CheckCircle,
  Clock,
  FileText,
  PieChart,
  Users,
  XCircle,
  Search,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  submission?: {
    id: string;
    status: string;
    content?: string;
    grade?: number;
    submittedAt: string;
    answers: {
      questionId: string;
      answer: number;
      isCorrect: boolean;
    }[];
  };
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface AssignmentDetailsDialogProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    className: string;
    questions: Question[];
  };
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentDetailsDialog({
  assignment,
  isOpen,
  onClose,
}: AssignmentDetailsDialogProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'grade' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      fetchStudentSubmissions();
    }
  }, [isOpen, assignment.id]);

  const fetchStudentSubmissions = async () => {
    try {
      const response = await fetch(
        `/api/teachers/assignments/${assignment.id}/submissions`
      );
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load student submissions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSubmissionStats = () => {
    const total = students.length;
    const submitted = students.filter(s => s.submission).length;
    const graded = students.filter(s => s.submission?.grade !== undefined).length;
    const averageGrade = submitted > 0 
      ? students.reduce((acc, s) => acc + (s.submission?.grade || 0), 0) / submitted 
      : 0;

    return { total, submitted, graded, averageGrade };
  };

  const getQuestionStats = () => {
    if (!assignment?.questions?.length) return [];
    
    const stats = assignment.questions.map((q, index) => {
      const attempts = students.filter(s => s.submission?.answers?.some(a => a.questionId === q.id)).length;
      const correct = students.filter(s => 
        s.submission?.answers?.some(a => a.questionId === q.id && a.isCorrect)
      ).length;
      return {
        questionNumber: index + 1,
        attempts,
        correct,
        percentageCorrect: attempts > 0 ? (correct / attempts) * 100 : 0
      };
    });

    return stats;
  };

  const filteredAndSortedStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'grade') {
        const gradeA = a.submission?.grade || -1;
        const gradeB = b.submission?.grade || -1;
        return sortOrder === 'asc' ? gradeA - gradeB : gradeB - gradeA;
      } else {
        const dateA = a.submission?.submittedAt ? new Date(a.submission.submittedAt).getTime() : 0;
        const dateB = b.submission?.submittedAt ? new Date(b.submission.submittedAt).getTime() : 0;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });

  const toggleSort = (newSortBy: 'name' | 'grade' | 'date') => {
    if (sortBy === newSortBy) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const stats = getSubmissionStats();
  const questionStats = getQuestionStats();

  if (!assignment) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle>{assignment.title}</DialogTitle>
          <DialogDescription>
            {assignment.className} • Due {format(new Date(assignment.dueDate), 'PPP')}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4">
            <TabsContent value="overview" className="space-y-4">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{assignment.description}</p>
                </CardContent>
              </Card>

              {/* Questions */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {assignment.questions.map((question, index) => (
                    <div key={question.id} className="space-y-2 p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between">
                        <Label className="text-base font-medium">
                          {index + 1}. {question.question}
                        </Label>
                        <Badge variant="outline" className="ml-2">
                          {getQuestionStats().find(s => s.questionNumber === index + 1)?.percentageCorrect.toFixed(0)}% correct
                        </Badge>
                      </div>
                      <div className="grid gap-2 pl-6">
                        {JSON.parse(question.options).map((option: string, optionIndex: number) => (
                          <div 
                            key={optionIndex} 
                            className={cn(
                              "p-2 rounded-md transition-colors",
                              optionIndex === question.correctAnswerIndex
                                ? "bg-green-500/10 border-green-500/20 border"
                                : "bg-card border-border/50 border"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {optionIndex === question.correctAnswerIndex ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={cn(
                                optionIndex === question.correctAnswerIndex && "font-medium text-green-500"
                              )}>
                                {option}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="pl-6 mt-2 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submissions" className="space-y-4">
              {/* Search and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSort('name')}
                    className={cn(sortBy === 'name' && 'bg-accent')}
                  >
                    Name {sortBy === 'name' && <ArrowUpDown className="ml-1 h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSort('grade')}
                    className={cn(sortBy === 'grade' && 'bg-accent')}
                  >
                    Grade {sortBy === 'grade' && <ArrowUpDown className="ml-1 h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSort('date')}
                    className={cn(sortBy === 'date' && 'bg-accent')}
                  >
                    Date {sortBy === 'date' && <ArrowUpDown className="ml-1 h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Student Submissions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAndSortedStudents.map((student) => (
                  <Card key={student.id} className="relative overflow-hidden">
                    <div className={cn(
                      "absolute inset-0 w-1",
                      student.submission
                        ? student.submission.grade >= 70
                          ? "bg-green-500"
                          : student.submission.grade >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        : "bg-gray-200"
                    )} />
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <CardTitle className="text-sm font-medium leading-none">
                            {student.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {student.email}
                          </p>
                        </div>
                        {student.submission && (
                          <Badge variant={
                            student.submission.grade >= 70 ? "success" :
                            student.submission.grade >= 50 ? "warning" : "destructive"
                          } className="ml-auto">
                            {student.submission.grade}%
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      {student.submission ? (
                        <>
                          <div className="flex justify-between text-xs text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(student.submission.submittedAt), 'PP')}
                            </span>
                            <span>
                              {student.submission.answers.filter(a => a.isCorrect).length}/{assignment.questions.length}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {student.submission.answers.map((answer, index) => (
                              <div
                                key={answer.questionId}
                                className={cn(
                                  "flex-1 h-1.5 rounded-full",
                                  answer.isCorrect ? "bg-green-500" : "bg-red-500"
                                )}
                                title={`Question ${index + 1}: ${answer.isCorrect ? 'Correct' : 'Incorrect'}`}
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <AlertCircle className="h-3 w-3" />
                          <span>Not submitted</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Submissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.submitted}</div>
                    <p className="text-xs text-muted-foreground">
                      {((stats.submitted / stats.total) * 100).toFixed(1)}% submitted
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Graded
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.graded}</div>
                    <p className="text-xs text-muted-foreground">
                      {((stats.graded / stats.submitted) * 100).toFixed(1)}% graded
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Grade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.averageGrade.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Question Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Question Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {questionStats.map((stat, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Question {stat.questionNumber}</span>
                          <span>{stat.correct}/{stat.attempts} correct</span>
                        </div>
                        <Progress value={stat.percentageCorrect} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
