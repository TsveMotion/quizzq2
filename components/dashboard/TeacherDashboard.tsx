'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Assignment {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  class: Class;
  submissions: Array<{
    id: string;
    content: string;
    grade?: number;
    student: Student;
  }>;
}

export default function TeacherDashboard({ user }: { user: any }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
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
          !newAssignment.subject || !newAssignment.topic || !newAssignment.yearGroup || !newAssignment.complexity || !newAssignment.questionCount) {
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

      if (!response.ok) throw new Error('Failed to create assignment');

      toast({
        title: 'Success',
        description: 'Assignment created successfully',
      });

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
      fetchAssignments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create assignment',
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

      toast({
        title: 'Success',
        description: 'Assignment deleted successfully',
      });

      fetchAssignments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete assignment',
        variant: 'destructive',
      });
    }
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

      {activeTab === 'assignments' && (
        <Card>
          <CardHeader>
            <CardTitle>Assignment Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isNewAssignmentDialogOpen} onOpenChange={setIsNewAssignmentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mb-4">Create New Assignment</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                </DialogHeader>
                <form onSubmit={createAssignment} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Assignment Title</Label>
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
                      placeholder="e.g., Mathematics, Physics, History"
                    />
                  </div>
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      value={newAssignment.topic}
                      onChange={(e) => setNewAssignment({ ...newAssignment, topic: e.target.value })}
                      placeholder="e.g., Quadratic Equations, Newton's Laws"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearGroup">Year Group</Label>
                    <Select
                      value={newAssignment.yearGroup}
                      onValueChange={(value) => setNewAssignment({ ...newAssignment, yearGroup: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Year 7</SelectItem>
                        <SelectItem value="8">Year 8</SelectItem>
                        <SelectItem value="9">Year 9</SelectItem>
                        <SelectItem value="10">Year 10 (GCSE)</SelectItem>
                        <SelectItem value="11">Year 11 (GCSE)</SelectItem>
                        <SelectItem value="12">Year 12 (A-Level)</SelectItem>
                        <SelectItem value="13">Year 13 (A-Level)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="complexity">Complexity Level</Label>
                    <Select
                      value={newAssignment.complexity}
                      onValueChange={(value) => setNewAssignment({ ...newAssignment, complexity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy - Basic Understanding</SelectItem>
                        <SelectItem value="medium">Medium - Applied Knowledge</SelectItem>
                        <SelectItem value="hard">Hard - Deep Understanding</SelectItem>
                        <SelectItem value="challenging">Challenging - Complex Problem Solving</SelectItem>
                        <SelectItem value="complicated">Complicated - Advanced Analysis</SelectItem>
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
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Questions</SelectItem>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="8">8 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Create Assignment</Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="space-y-4">
              {assignments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No assignments found. Create one to get started!</p>
              ) : (
                assignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">{assignment.title}</h3>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAssignment(assignment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      Class: {assignment.class.name}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      Due: {format(new Date(assignment.dueDate), 'PPP p')}
                    </div>
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: assignment.content }} />
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Submissions ({assignment.submissions.length})</h4>
                      <div className="space-y-2">
                        {assignment.submissions.map((submission) => (
                          <div key={submission.id} className="text-sm">
                            <span className="font-medium">{submission.student.name}</span>
                            {submission.grade !== null && (
                              <span className="ml-2 text-gray-500">
                                Grade: {submission.grade}/100
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Toaster />
    </div>
  );
}
