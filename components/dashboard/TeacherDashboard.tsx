'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Class {
  id: string;
  name: string;
  description?: string;
  students: Student[];
}

interface QuizQuestion {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
}

interface Assignment {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  class: Class;
  subject: string;
  topic: string;
  questions: QuizQuestion[];
  submissions: Array<{
    id: string;
    content: string;
    grade?: number;
    student: Student;
    answers?: Array<{
      questionId: string;
      answer: string;
      isCorrect: boolean;
    }>;
  }>;
}

export default function TeacherDashboard({ user }: { user: any }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedAssignmentForPerformance, setSelectedAssignmentForPerformance] = useState<Assignment | null>(null);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showStudentPerformance, setShowStudentPerformance] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' });
  const [newClass, setNewClass] = useState({ name: '', description: '' });
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    classId: '',
    dueDate: '',
    subject: '',
    topic: '',
    yearGroup: '7',
    complexity: 'medium',
    questionCount: 5
  });
  const [isNewStudentDialogOpen, setIsNewStudentDialogOpen] = useState(false);
  const [isNewClassDialogOpen, setIsNewClassDialogOpen] = useState(false);
  const [isAddStudentsDialogOpen, setIsAddStudentsDialogOpen] = useState(false);
  const [isNewAssignmentDialogOpen, setIsNewAssignmentDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'classes' | 'assignments'>('overview');

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'classes') {
      fetchClasses();
    } else if (activeTab === 'assignments') {
      fetchAssignments();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch students',
        variant: 'destructive',
      });
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch classes',
        variant: 'destructive',
      });
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/assignments');
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch assignments',
        variant: 'destructive',
      });
    }
  };

  const createAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newAssignment.title || !newAssignment.classId || !newAssignment.dueDate || 
          !newAssignment.subject || !newAssignment.topic || !newAssignment.yearGroup || 
          !newAssignment.complexity || !newAssignment.questionCount) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      
      setAssignments(prev => [...prev, data]);
      setIsNewAssignmentDialogOpen(false);
      setNewAssignment({
        title: '',
        classId: '',
        dueDate: '',
        subject: '',
        topic: '',
        yearGroup: '7',
        complexity: 'medium',
        questionCount: 5
      });

      toast({
        title: 'Success',
        description: 'Assignment created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create assignment',
        variant: 'destructive',
      });
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete assignment');

      // Remove the assignment from state
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      
      toast({
        title: 'Success',
        description: 'Assignment deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete assignment',
        variant: 'destructive',
      });
    }
  };

  const viewAssignmentQuestions = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowQuestionDialog(true);
  };

  const createStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newStudent.name || !newStudent.email || !newStudent.password) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      toast({
        title: 'Success',
        description: 'Student created successfully',
      });
      
      setIsNewStudentDialogOpen(false);
      setNewStudent({ name: '', email: '', password: '' });
      fetchStudents();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create student',
        variant: 'destructive',
      });
    }
  };

  const resetPassword = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/reset-password`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to reset password');
      
      const data = await response.json();
      
      toast({
        title: 'Success',
        description: `Password reset successfully. Temporary password: ${data.temporaryPassword}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password',
        variant: 'destructive',
      });
    }
  };

  const createClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newClass.name) {
        toast({
          title: 'Error',
          description: 'Please enter a class name',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass),
      });
      
      if (!response.ok) throw new Error('Failed to create class');
      
      toast({
        title: 'Success',
        description: 'Class created successfully',
      });
      
      setIsNewClassDialogOpen(false);
      setNewClass({ name: '', description: '' });
      fetchClasses();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create class',
        variant: 'destructive',
      });
    }
  };

  const openAddStudentsDialog = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedStudents([]);
    setIsAddStudentsDialogOpen(true);
  };

  const addStudentsToClass = async () => {
    try {
      if (!selectedClassId || selectedStudents.length === 0) {
        toast({
          title: 'Error',
          description: 'Please select at least one student',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`/api/classes/${selectedClassId}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIds: selectedStudents }),
      });
      
      if (!response.ok) throw new Error('Failed to add students to class');
      
      toast({
        title: 'Success',
        description: 'Students added to class successfully',
      });
      
      setIsAddStudentsDialogOpen(false);
      setSelectedStudents([]);
      fetchClasses();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add students to class',
        variant: 'destructive',
      });
    }
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const calculateStudentStats = (assignment: Assignment) => {
    const stats = {
      averageGrade: 0,
      questionStats: {} as Record<string, { correct: number; total: number; questionText: string }>,
      studentPerformance: [] as Array<{
        student: Student;
        grade: number;
        struggledQuestions: Array<{ questionId: string; questionText: string }>;
      }>,
    };

    if (!assignment.submissions || assignment.submissions.length === 0) {
      return stats;
    }

    // Calculate average grade
    const totalGrade = assignment.submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);
    stats.averageGrade = totalGrade / assignment.submissions.length;

    // Initialize question stats
    if (assignment.questions && Array.isArray(assignment.questions)) {
      assignment.questions.forEach(q => {
        if (q && q.id) {
          stats.questionStats[q.id] = {
            correct: 0,
            total: 0,
            questionText: q.questionText || 'Question text not available'
          };
        }
      });
    }

    // Calculate per-student performance and question statistics
    assignment.submissions.forEach(submission => {
      if (!submission || !submission.student) return;

      const struggledQuestions: Array<{ questionId: string; questionText: string }> = [];
      
      if (submission.answers && Array.isArray(submission.answers)) {
        submission.answers.forEach(answer => {
          if (!answer || !answer.questionId) return;

          const questionStat = stats.questionStats[answer.questionId];
          if (questionStat) {
            questionStat.total++;
            if (answer.isCorrect) {
              questionStat.correct++;
            } else {
              const question = assignment.questions?.find(q => q?.id === answer.questionId);
              if (question) {
                struggledQuestions.push({
                  questionId: answer.questionId,
                  questionText: question.questionText || 'Question text not available'
                });
              }
            }
          }
        });
      }

      stats.studentPerformance.push({
        student: submission.student,
        grade: submission.grade || 0,
        struggledQuestions
      });
    });

    return stats;
  };

  const renderAssignments = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <Button onClick={() => setIsNewAssignmentDialogOpen(true)}>
          Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
              <CardDescription>
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Class: {assignment.class?.name}</p>
              <p>Subject: {assignment.subject}</p>
              <p>Topic: {assignment.topic}</p>
              <p>Questions: {assignment.questions?.length || 0}</p>
              <p>Submissions: {assignment.submissions?.length || 0}</p>
              {assignment.submissions?.length > 0 && (
                <p className="text-green-600 font-medium">
                  Average Grade: {
                    Math.round(
                      assignment.submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0) / 
                      assignment.submissions.length
                    )
                  }%
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 mt-auto">
              <div className="flex justify-between w-full">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setShowQuestionDialog(true);
                  }}
                >
                  View Questions
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteAssignment(assignment.id)}
                >
                  Delete
                </Button>
              </div>
              {assignment.submissions?.length > 0 && (
                <Button 
                  className="w-full"
                  variant="secondary"
                  onClick={() => {
                    setSelectedAssignmentForPerformance(assignment);
                    setShowStudentPerformance(true);
                  }}
                >
                  View Student Performance
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Questions Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAssignment?.title} - Questions
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {!selectedAssignment?.questions || selectedAssignment.questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No questions available for this assignment.</p>
              </div>
            ) : (
              selectedAssignment.questions.map((question, index) => (
                <Card key={question.id} className="p-4">
                  <h3 className="font-semibold mb-2">Question {index + 1}</h3>
                  <p className="mb-4 text-lg">{question.questionText}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className={`p-2 rounded ${
                        question.correctOption === 'A' 
                          ? 'bg-green-100 text-green-700 font-medium' 
                          : 'hover:bg-gray-50'
                      }`}>
                        A: {question.optionA}
                      </p>
                      <p className={`p-2 rounded ${
                        question.correctOption === 'B' 
                          ? 'bg-green-100 text-green-700 font-medium' 
                          : 'hover:bg-gray-50'
                      }`}>
                        B: {question.optionB}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className={`p-2 rounded ${
                        question.correctOption === 'C' 
                          ? 'bg-green-100 text-green-700 font-medium' 
                          : 'hover:bg-gray-50'
                      }`}>
                        C: {question.optionC}
                      </p>
                      <p className={`p-2 rounded ${
                        question.correctOption === 'D' 
                          ? 'bg-green-100 text-green-700 font-medium' 
                          : 'hover:bg-gray-50'
                      }`}>
                        D: {question.optionD}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-green-600 font-medium">
                      Correct Answer: {question.correctOption}
                    </p>
                    {question.explanation && (
                      <div className="mt-2 p-3 bg-gray-50 rounded">
                        <p className="font-medium text-sm text-gray-600">Explanation:</p>
                        <p className="text-muted-foreground mt-1">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Performance Dialog */}
      <Dialog 
        open={showStudentPerformance} 
        onOpenChange={setShowStudentPerformance}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Student Performance - {selectedAssignmentForPerformance?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedAssignmentForPerformance && (
            <div className="space-y-6">
              {/* Overall Statistics */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Overall Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Grade</p>
                    <p className="text-2xl font-bold">
                      {Math.round(calculateStudentStats(selectedAssignmentForPerformance).averageGrade)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">
                      {selectedAssignmentForPerformance.submissions?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Questions</p>
                    <p className="text-2xl font-bold">
                      {selectedAssignmentForPerformance.questions?.length || 0}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Question Statistics */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Question Analysis</h3>
                {selectedAssignmentForPerformance.questions && 
                selectedAssignmentForPerformance.questions.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(calculateStudentStats(selectedAssignmentForPerformance).questionStats)
                      .map(([questionId, stats]) => (
                        <div key={questionId} className="border-b pb-2">
                          <p className="font-medium">{stats.questionText}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-muted-foreground">
                              Correct Answers: {stats.correct}/{stats.total}
                            </p>
                            <p className={`text-sm font-medium ${
                              (stats.correct / stats.total) * 100 >= 70 
                                ? 'text-green-600' 
                                : (stats.correct / stats.total) * 100 >= 50 
                                  ? 'text-yellow-600' 
                                  : 'text-red-600'
                            }`}>
                              {Math.round((stats.correct / stats.total) * 100)}% Success Rate
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No questions available for analysis
                  </p>
                )}
              </Card>

              {/* Individual Student Performance */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Individual Performance</h3>
                {selectedAssignmentForPerformance.submissions && 
                selectedAssignmentForPerformance.submissions.length > 0 ? (
                  <div className="space-y-4">
                    {calculateStudentStats(selectedAssignmentForPerformance)
                      .studentPerformance
                      .sort((a, b) => b.grade - a.grade)
                      .map((student) => (
                        <Card key={student.student.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{student.student.name}</p>
                              <p className="text-sm text-gray-500">{student.student.email}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${
                                student.grade >= 70 
                                  ? 'text-green-600' 
                                  : student.grade >= 50 
                                    ? 'text-yellow-600' 
                                    : 'text-red-600'
                              }`}>
                                {student.grade}%
                              </p>
                            </div>
                          </div>
                          {student.struggledQuestions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-red-600">
                                Struggled with {student.struggledQuestions.length} questions:
                              </p>
                              <ul className="mt-1 space-y-1">
                                {student.struggledQuestions.map((q) => (
                                  <li key={q.questionId} className="text-sm text-muted-foreground">
                                    • {q.questionText}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Card>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No student submissions available
                  </p>
                )}
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      
      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button 
          variant={activeTab === 'students' ? 'default' : 'outline'}
          onClick={() => setActiveTab('students')}
        >
          Student Management
        </Button>
        <Button 
          variant={activeTab === 'classes' ? 'default' : 'outline'}
          onClick={() => setActiveTab('classes')}
        >
          Class Management
        </Button>
        <Button 
          variant={activeTab === 'assignments' ? 'default' : 'outline'}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </Button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Your Classes</h3>
            <p className="text-gray-600">Manage your classes and students.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Create Quiz</h3>
            <p className="text-gray-600">Create new quizzes and assignments.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Grade Assignments</h3>
            <p className="text-gray-600">Review and grade student submissions.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Analytics</h3>
            <p className="text-gray-600">View class performance analytics.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Resources</h3>
            <p className="text-gray-600">Manage teaching resources and materials.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Schedule</h3>
            <p className="text-gray-600">View and manage your teaching schedule.</p>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <Card>
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isNewStudentDialogOpen} onOpenChange={setIsNewStudentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mb-4">Create New Student</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Student</DialogTitle>
                </DialogHeader>
                <form onSubmit={createStudent} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="Enter student name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      placeholder="Enter student email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Initial Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      placeholder="Enter initial password"
                    />
                  </div>
                  <Button type="submit">Create Student</Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="space-y-4">
              {students.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No students found. Create one to get started!</p>
              ) : (
                students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                    <Button variant="outline" onClick={() => resetPassword(student.id)}>
                      Reset Password
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'classes' && (
        <Card>
          <CardHeader>
            <CardTitle>Class Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isNewClassDialogOpen} onOpenChange={setIsNewClassDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mb-4">Create New Class</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Class</DialogTitle>
                </DialogHeader>
                <form onSubmit={createClass} className="space-y-4">
                  <div>
                    <Label htmlFor="className">Class Name</Label>
                    <Input
                      id="className"
                      value={newClass.name}
                      onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                      placeholder="Enter class name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classDescription">Description</Label>
                    <Input
                      id="classDescription"
                      value={newClass.description}
                      onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                      placeholder="Enter class description"
                    />
                  </div>
                  <Button type="submit">Create Class</Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddStudentsDialogOpen} onOpenChange={setIsAddStudentsDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Students to Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                        <Label htmlFor={`student-${student.id}`}>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                  <Button onClick={addStudentsToClass}>Add Selected Students</Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-4">
              {classes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No classes found. Create one to get started!</p>
              ) : (
                classes.map((cls) => (
                  <div key={cls.id} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{cls.name}</h3>
                        {cls.description && (
                          <p className="text-sm text-gray-500">{cls.description}</p>
                        )}
                      </div>
                      <Button onClick={() => openAddStudentsDialog(cls.id)}>
                        Add Students
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Students</h4>
                      {cls.students.length === 0 ? (
                        <p className="text-sm text-gray-500">No students in this class</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {cls.students.map((student) => (
                            <div key={student.id} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                              <p className="font-medium">{student.name}</p>
                              <p className="text-gray-500">{student.email}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'assignments' && renderAssignments()}

      <Dialog open={isNewAssignmentDialogOpen} onOpenChange={setIsNewAssignmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
          </DialogHeader>
          <form onSubmit={createAssignment} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                placeholder="Enter assignment title"
              />
            </div>
            <div>
              <Label htmlFor="class">Class</Label>
              <Select
                value={newAssignment.classId}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, classId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newAssignment.subject}
                onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                placeholder="Enter subject (e.g., Mathematics)"
              />
            </div>
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={newAssignment.topic}
                onChange={(e) => setNewAssignment({ ...newAssignment, topic: e.target.value })}
                placeholder="Enter topic (e.g., Quadratic Equations)"
              />
            </div>
            <div>
              <Label htmlFor="yearGroup">Year Group</Label>
              <Select
                value={newAssignment.yearGroup}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, yearGroup: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year group" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 7 }, (_, i) => i + 7).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      Year {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="complexity">Complexity</Label>
              <Select
                value={newAssignment.complexity}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, complexity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Select
                value={newAssignment.questionCount.toString()}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, questionCount: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number of questions" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map((count) => (
                    <SelectItem key={count} value={count.toString()}>
                      {count} Questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Create Assignment</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
