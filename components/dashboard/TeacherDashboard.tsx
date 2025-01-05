'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import {
  LayoutGrid,
  Users,
  FileText,
  Search,
  PlusCircle,
  UserPlus,
  GraduationCap,
  ClipboardList,
  Info,
  Eye,
  Clock,
  Loader2,
  BarChart2,
  Key,
  Plus,
  MoreVertical,
  ChevronDown,
  Calendar as CalendarIcon,
  Trash2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledIn?: any[];
  progress: {
    averageScore: number;
    totalSubmissions: number;
  };
}

interface Class {
  id: string;
  name: string;
  description?: string;
  yearGroup: string;
  students: Student[];
  assignments: any[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  subject: string;
  topic: string;
  yearGroup: string;
  complexity: string;
  class: Class;
  questions: QuizQuestion[];
  submissions: Array<{
    id: string;
    student: Student;
    answers?: Array<{
      questionId: string;
      answer: string;
      isCorrect: boolean;
    }>;
  }>;
  content?: string;
  stats: {
    submissionCount: number;
    totalStudents: number;
    averageScore: number;
  };
}

interface Student {
  id: string;
  name: string;
  email: string;
  classes: Array<{
    id: string;
    name: string;
  }>;
  progress: number;
  averageScore: number;
  totalAssignments: number;
  completedAssignments: number;
}

export default function TeacherDashboard({ user }: { user: any }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isViewClassDetailsOpen, setIsViewClassDetailsOpen] = useState(false);
  const [isCreateClassDialogOpen, setIsCreateClassDialogOpen] = useState(false);
  const [isCreateAssignmentDialogOpen, setIsCreateAssignmentDialogOpen] = useState(false);
  const [isAddStudentsDialogOpen, setIsAddStudentsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreateStudentDialogOpen, setIsCreateStudentDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { toast } = useToast();

  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
  });

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    topic: '',
    yearGroup: '',
    complexity: '1',
    dueDate: new Date(),
    numberOfQuestions: '5'
  });

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    activeAssignments: 0,
    averageScore: 0,
  });

  const [isViewStudentDetailsOpen, setIsViewStudentDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const [searchStudentsQuery, setSearchStudentsQuery] = useState('');
  const [searchStudentsResults, setSearchStudentsResults] = useState<Student[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState<string[]>([]);
  const [addingStudents, setAddingStudents] = useState(false);

  const [isGeneratingAssignment, setIsGeneratingAssignment] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const debouncedSearch = useDebounce<string>(searchTerm, 300);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classesRes, assignmentsRes, studentsRes] = await Promise.all([
        fetch(`/api/teachers/${user.id}/classes`),
        fetch(`/api/teachers/${user.id}/assignments`),
        fetch(`/api/teachers/${user.id}/school/students`)
      ]);

      if (!classesRes.ok || !assignmentsRes.ok || !studentsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [classesData, assignmentsData, studentsData] = await Promise.all([
        classesRes.json(),
        assignmentsRes.json(),
        studentsRes.json()
      ]);

      setClasses(classesData);
      setAssignments(assignmentsData);
      setStudents(studentsData);
      setFilteredStudents(studentsData);

      // Calculate stats
      const totalStudents = studentsData.length;
      const totalClasses = classesData.length;
      const activeAssignments = assignmentsData.length;
      const averageScore = assignmentsData.reduce((acc: number, assignment: any) => {
        return acc + (assignment.stats?.averageScore || 0);
      }, 0) / (assignmentsData.length || 1);

      setStats({
        totalStudents,
        totalClasses,
        activeAssignments,
        averageScore: Math.round(averageScore)
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  useEffect(() => {
    if (debouncedSearch) {
      const searchResults = students.filter(student => 
        student.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredStudents(searchResults);
    } else {
      setFilteredStudents(students);
    }
  }, [debouncedSearch, students]);

  const handleCreateClass = async () => {
    if (!newClass.name) {
      toast({
        title: 'Error',
        description: 'Please fill in the class name',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/teachers/${user.id}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClass),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create class');
      }

      const createdClass = await response.json();
      setClasses([...classes, createdClass]);
      setIsCreateClassDialogOpen(false);
      setNewClass({
        name: '',
        description: '',
      });

      toast({
        title: 'Success',
        description: 'Class created successfully',
      });
    } catch (error: any) {
      console.error('Error creating class:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create class',
        variant: 'destructive',
      });
    }
  };

  const handleCreateAssignment = async (classId: string) => {
    if (!newAssignment.title || !newAssignment.subject || !newAssignment.topic || !selectedClass) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingAssignment(true);
    try {
      // First generate the questions
      const generateResponse = await fetch(`/api/teachers/${user.id}/assignments/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAssignment.title,
          subject: newAssignment.subject,
          topic: newAssignment.topic,
          numberOfQuestions: parseInt(newAssignment.numberOfQuestions)
        }),
      });

      if (!generateResponse.ok) {
        const error = await generateResponse.json();
        throw new Error(error.error || 'Failed to generate assignment');
      }

      const { questions } = await generateResponse.json();

      // Then create the assignment with the generated questions
      const createResponse = await fetch(`/api/teachers/${user.id}/classes/${selectedClass.id}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAssignment.title,
          subject: newAssignment.subject,
          topic: newAssignment.topic,
          dueDate: newAssignment.dueDate,
          questions: questions
        }),
      });

      if (!createResponse.ok) {
        const error = await createResponse.json();
        throw new Error(error.error || 'Failed to create assignment');
      }

      const createdAssignment = await createResponse.json();

      toast({
        title: 'Success',
        description: 'Assignment created successfully',
      });

      setIsCreateAssignmentDialogOpen(false);
      setNewAssignment({
        title: '',
        subject: '',
        topic: '',
        dueDate: new Date(),
        numberOfQuestions: '5'
      });

      // Update the assignments list and refresh data
      setAssignments(prev => [...prev, createdAssignment]);
      fetchData(); // Refresh all data to ensure everything is up to date
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create assignment',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingAssignment(false);
    }
  };

  const searchStudents = async (query: string | undefined) => {
    // Reset error state
    setSearchError(null);

    // Handle empty or undefined query
    if (!query || query.trim() === '') {
      setSearchStudentsResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/teachers/${user.id}/school/students/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to search students');
      }

      const data = await response.json();
      setSearchStudentsResults(data);
    } catch (error) {
      console.error('Error searching students:', error);
      setSearchError(error instanceof Error ? error.message : 'Failed to search students');
      setSearchStudentsResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = useDebounce((value: string) => {
    searchStudents(value);
  }, 300);

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAddStudents = async (classId: string) => {
    try {
      if (selectedStudents.length === 0) {
        toast({
          title: 'Error',
          description: 'Please select at least one student',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`/api/teachers/${user.id}/classes/${classId}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIds: selectedStudents }),
      });

      if (!response.ok) {
        throw new Error('Failed to add students');
      }

      const updatedClass = await response.json();
      setClasses(prev => prev.map(c => c.id === classId ? updatedClass : c));
      setIsAddStudentsDialogOpen(false);
      setSelectedStudents([]);
      setSearchQuery('');
      setSearchResults([]);

      toast({
        title: 'Success',
        description: 'Students added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add students',
        variant: 'destructive',
      });
    }
  };

  const handleViewClassDetails = (cls: Class) => {
    setSelectedClass(cls);
    setIsViewClassDetailsOpen(true);
  };

  const handleCreateStudent = async () => {
    try {
      if (!newStudent.name || !newStudent.email || !newStudent.password) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`/api/teachers/${user.id}/students/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create student');
      }

      const createdStudent = await response.json();
      setStudents(prev => [...prev, createdStudent]);
      setIsCreateStudentDialogOpen(false);
      setNewStudent({ name: '', email: '', password: '' });

      toast({
        title: 'Success',
        description: 'Student created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create student',
        variant: 'destructive',
      });
    }
  };

  const handleViewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsViewStudentDetailsOpen(true);
  };

  const handleResetPassword = async () => {
    if (!selectedStudent || !newPassword) return;

    setIsResettingPassword(true);
    try {
      const response = await fetch(
        `/api/teachers/${user.id}/students/${selectedStudent.id}/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }

      toast({
        title: 'Success',
        description: 'Password reset successfully',
      });

      setIsResetPasswordDialogOpen(false);
      setNewPassword('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSearchStudents = async (query: string) => {
    setSearchStudentsQuery(query);
    if (!query.trim()) {
      setSearchStudentsResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/teachers/${user.id}/school/students/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search students');
      }
      const data = await response.json();
      setSearchStudentsResults(data);
    } catch (error) {
      console.error('Error searching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to search students',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddStudentsToClass = async () => {
    if (!selectedClass || selectedStudentsToAdd.length === 0) return;

    setAddingStudents(true);
    try {
      const response = await fetch(`/api/teachers/${user.id}/classes/${selectedClass.id}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentIds: selectedStudentsToAdd }),
      });

      if (!response.ok) {
        throw new Error('Failed to add students to class');
      }

      toast({
        title: 'Success',
        description: 'Students added to class successfully',
      });

      // Reset states and refresh data
      setSelectedStudentsToAdd([]);
      setSearchStudentsQuery('');
      setSearchStudentsResults([]);
      setIsAddStudentsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error adding students:', error);
      toast({
        title: 'Error',
        description: 'Failed to add students to class',
        variant: 'destructive',
      });
    } finally {
      setAddingStudents(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        searchStudents(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const isOverdue = (dateString: string | undefined | null) => {
    if (!dateString) return false;
    try {
      return new Date(dateString) < new Date();
    } catch (error) {
      console.error('Error checking if overdue:', error);
      return false;
    }
  };

  const isDueSoon = (dateString: string | undefined | null) => {
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

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/teachers/${user.id}/assignments/${assignmentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete assignment');
      }

      toast({
        title: 'Success',
        description: 'Assignment deleted successfully',
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete assignment',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      const response = await fetch(`/api/teachers/${user.id}/classes/${classId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete class');
      }

      toast({
        title: 'Success',
        description: 'Class deleted successfully',
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete class',
        variant: 'destructive',
      });
    }
  };

  const renderClassDetails = (cls: Class) => {
    const classAssignments = assignments.filter(a => a.class.id === cls.id);
    
    return (
      <Dialog open={isViewClassDetailsOpen} onOpenChange={setIsViewClassDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Class Details: {cls.name}</DialogTitle>
            <DialogDescription>View and manage class information</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Class Information</h3>
                <p className="text-sm text-muted-foreground">
                  Total Students: {cls.students.length}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleAddStudents(cls.id)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Students
                </Button>
                <Button
                  onClick={() => {
                    setSelectedClass(cls);
                    setIsCreateAssignmentDialogOpen(true);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            </div>

            <Tabs defaultValue="assignments" className="w-full">
              <TabsList>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>

              <TabsContent value="assignments" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead>Average Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classAssignments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No assignments yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        classAssignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell>{assignment.title}</TableCell>
                            <TableCell>{format(new Date(assignment.dueDate), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              {(assignment.submissions?.length || 0)} / {cls.students?.length || 0}
                            </TableCell>
                            <TableCell>
                              {assignment.stats?.averageScore ? (
                                <div className="flex items-center gap-2">
                                  <span>{Math.round(assignment.stats.averageScore)}%</span>
                                  <Progress value={assignment.stats.averageScore} className="w-20" />
                                </div>
                              ) : (
                                'No submissions'
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedAssignment(assignment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Average Score</TableHead>
                        <TableHead>Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cls.students.map((student) => {
                        const studentSubmissions = classAssignments.map(assignment => {
                          const submission = assignment.submissions?.find(s => s?.student?.id === student.id);
                          if (!submission) return null;
                          
                          const correctAnswers = submission.answers?.filter(a => a?.isCorrect)?.length || 0;
                          const totalQuestions = assignment.questions?.length || 1;
                          return {
                            score: (correctAnswers / totalQuestions) * 100,
                            assignmentId: assignment.id
                          };
                        }).filter(Boolean);

                        const averageScore = studentSubmissions.length > 0
                          ? studentSubmissions.reduce((acc, curr) => acc + (curr?.score || 0), 0) / studentSubmissions.length
                          : 0;

                        return (
                          <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                              {studentSubmissions.length} / {classAssignments.length}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{Math.round(averageScore)}%</span>
                                <Progress value={averageScore} className="w-20" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewStudentDetails(student)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateClassDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Class
          </Button>
          <Button onClick={() => setIsCreateAssignmentDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAssignments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="classes">
        <TabsList className="bg-muted/50 p-1 gap-2 rounded-lg">
          <TabsTrigger 
            value="classes"
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-white/50 transition-all duration-200 rounded-md px-6 py-2"
          >
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span>Classes</span>
              <Badge variant="secondary" className="ml-2 bg-muted-foreground/10">
                {classes.length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="assignments"
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-white/50 transition-all duration-200 rounded-md px-6 py-2"
          >
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-4 w-4" />
              <span>Assignments</span>
              <Badge variant="secondary" className="ml-2 bg-muted-foreground/10">
                {assignments.length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="students"
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-white/50 transition-all duration-200 rounded-md px-6 py-2"
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Students</span>
              <Badge variant="secondary" className="ml-2 bg-muted-foreground/10">
                {students.length}
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Class Management</CardTitle>
                  <CardDescription>Manage your classes and students</CardDescription>
                </div>
                <Button onClick={() => setIsCreateClassDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Class
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Active Assignments</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : classes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No classes found. Create your first class to get started!
                        </TableCell>
                      </TableRow>
                    ) : (
                      classes.map((cls) => {
                        const activeAssignments = cls.assignments?.length || 0;
                        const averageScore = cls.assignments?.reduce((acc: number, assignment: any) => {
                          return acc + (assignment.stats?.averageScore || 0);
                        }, 0) / (activeAssignments || 1);

                        return (
                          <TableRow key={cls.id}>
                            <TableCell className="font-medium">
                              {cls.name}
                              {cls.description && (
                                <div className="text-sm text-muted-foreground">
                                  {cls.description}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{cls.students?.length || 0} students</TableCell>
                            <TableCell>{activeAssignments} assignments</TableCell>
                            <TableCell>
                              <Badge variant={
                                averageScore >= 70 ? "success" : 
                                averageScore >= 50 ? "warning" : 
                                "destructive"
                              }>
                                {Math.round(averageScore)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedClass(cls);
                                    setIsViewClassDetailsOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteClass(cls.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Assignments</CardTitle>
                  <CardDescription>Manage and track student assignments</CardDescription>
                </div>
                <Button onClick={() => setIsCreateAssignmentDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Assignment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <div className="col-span-full flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <h3 className="font-semibold">No assignments found</h3>
                      <p className="text-sm text-muted-foreground">
                        Create your first assignment to get started!
                      </p>
                    </div>
                  </div>
                ) : (
                  assignments.map((assignment) => (
                    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <CardDescription>
                              {assignment.class.name} • {assignment.subject}
                            </CardDescription>
                          </div>
                          <Badge variant={
                            isOverdue(assignment.dueDate) ? "destructive" :
                            isDueSoon(assignment.dueDate) ? "warning" :
                            "success"
                          }>
                            {isOverdue(assignment.dueDate) ? "Overdue" :
                             isDueSoon(assignment.dueDate) ? "Due Soon" :
                             "Active"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {(assignment.submissions?.length || 0)} / {(assignment.stats?.totalStudents || 0)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {(assignment.stats?.averageScore || 0)}% avg
                              </span>
                            </div>
                          </div>
                          <Progress 
                            value={((assignment.submissions?.length || 0) / (assignment.stats?.totalStudents || 1)) * 100} 
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="ghost" 
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Students</CardTitle>
                  <CardDescription>View and manage your students</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search students..."
                    value={searchTerm ?? ''}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {searchError && (
                <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
                  {searchError}
                </div>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          {searchTerm ? "No students found matching your search" : "Enter a search term to find students"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            {student.classes?.map(cls => (
                              <Badge key={cls.id} variant="secondary" className="mr-1">
                                {cls.name}
                              </Badge>
                            ))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={student.progress} className="w-[60px]" />
                              <span className="text-sm text-muted-foreground">
                                {student.completedAssignments}/{student.totalAssignments}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.averageScore >= 70 ? "default" : "destructive"}>
                              {student.averageScore}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // View student details
                                window.location.href = `/students/${student.id}`;
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {/* Assignment Details Dialog */}
      <Dialog 
        open={selectedAssignment !== null} 
        onOpenChange={(open) => !open && setSelectedAssignment(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
            <DialogTitle>{selectedAssignment?.title}</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.class?.name} • {selectedAssignment?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Assignment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(selectedAssignment?.stats?.submissionCount || 0)} / {(selectedAssignment?.stats?.totalStudents || 0)}
                  </div>
                  <Progress 
                    value={((selectedAssignment?.stats?.submissionCount || 0) / 
                           (selectedAssignment?.stats?.totalStudents || 1)) * 100} 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(selectedAssignment?.stats?.averageScore || 0)}%
                  </div>
                  <Progress 
                    value={selectedAssignment?.stats?.averageScore || 0} 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Due Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatDate(selectedAssignment?.dueDate)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isOverdue(selectedAssignment?.dueDate) ? 'Overdue' :
                     isDueSoon(selectedAssignment?.dueDate) ? 'Due Soon' :
                     'Active'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold sticky top-0 bg-background z-10">
                Questions
              </h3>
              <div className="space-y-6">
                {selectedAssignment?.questions?.map((question, index) => (
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
                        {(question.options as string[]).map((text, idx) => {
                          const option = String.fromCharCode(65 + idx); // Convert 0-3 to A-D
                          const isCorrect = question.correctAnswerIndex === idx;
                          return (
                            <div
                              key={option}
                              className={cn(
                                "p-4 rounded-lg border",
                                isCorrect && "bg-green-50 border-green-200 shadow-sm"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium",
                                  isCorrect ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                                )}>
                                  {option}
                                </div>
                                <span className={cn(
                                  isCorrect && "text-green-700 font-medium"
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
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Other Dialogs */}
      {selectedClass && renderClassDetails(selectedClass)}

      <Dialog open={isCreateClassDialogOpen} onOpenChange={setIsCreateClassDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>
              Create a new class and add students later
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Class Name</Label>
              <Input
                placeholder="Enter class name"
                value={newClass.name}
                onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter class description"
                value={newClass.description}
                onChange={(e) => setNewClass(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateClassDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClass}>Create Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateAssignmentDialogOpen} onOpenChange={setIsCreateAssignmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Create an AI-generated quiz assignment for your class
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Assignment Title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder="e.g., Mathematics"
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input
                  placeholder="e.g., Algebra"
                  value={newAssignment.topic}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select
                value={selectedClass?.id || ''}
                onValueChange={(value) => {
                  const selected = classes.find(c => c.id === value);
                  setSelectedClass(selected || null);
                }}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="datetime-local"
                  value={newAssignment.dueDate.toISOString().slice(0, 16)}
                  onChange={(e) => setNewAssignment(prev => ({ 
                    ...prev, 
                    dueDate: new Date(e.target.value) 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Select
                  value={newAssignment.numberOfQuestions}
                  onValueChange={(value) => setNewAssignment(prev => ({ 
                    ...prev, 
                    numberOfQuestions: value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of questions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateAssignmentDialogOpen(false);
                setNewAssignment({
                  title: '',
                  subject: '',
                  topic: '',
                  dueDate: new Date(),
                  numberOfQuestions: '5'
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedClass && handleCreateAssignment(selectedClass.id)}
              disabled={isGeneratingAssignment}
            >
              {isGeneratingAssignment ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddStudentsDialogOpen} onOpenChange={setIsAddStudentsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Students to {selectedClass?.name}</DialogTitle>
            <DialogDescription>
              Search and select students to add to this class
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name or email..."
                  className="pl-8"
                  value={searchStudentsQuery}
                  onChange={(e) => handleSearchStudents(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Classes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isSearching ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : searchStudentsResults.length > 0 ? (
                    searchStudentsResults.map((student) => {
                      const isAlreadyInClass = selectedClass?.students?.some(s => s.id === student.id);
                      const isSelected = selectedStudentsToAdd.includes(student.id);

                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              disabled={isAlreadyInClass}
                              onCheckedChange={(checked) => {
                                setSelectedStudentsToAdd(prev => 
                                  checked 
                                    ? [...prev, student.id]
                                    : prev.filter(id => id !== student.id)
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            {student.classes?.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {student.classes.map(cls => (
                                  <Badge 
                                    key={cls.id} 
                                    variant={cls.id === selectedClass?.id ? "default" : "outline"}
                                  >
                                    {cls.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">No classes</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : searchStudentsQuery ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <p className="text-sm text-muted-foreground">No students found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <p className="text-sm text-muted-foreground">Search for students to add to this class</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <div className="text-sm text-muted-foreground">
                {selectedStudentsToAdd.length} student{selectedStudentsToAdd.length !== 1 ? 's' : ''} selected
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddStudentsDialogOpen(false);
                    setSearchStudentsQuery('');
                    setSearchStudentsResults([]);
                    setSelectedStudentsToAdd([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddStudentsToClass}
                  disabled={selectedStudentsToAdd.length === 0 || addingStudents}
                >
                  {addingStudents ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>Add Selected Students</>
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedClass && (
        <div className="flex justify-end space-x-4 mb-4">
          <Button
            variant="outline"
            onClick={() => setIsAddStudentsDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Students
          </Button>
          <Button
            onClick={() => setIsCreateAssignmentDialogOpen(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>
      )}
      <Toaster />
    </div>
  );
}
