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
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  PlusCircle,
  Search,
  Calendar,
  BarChart2,
  Settings,
  UserPlus,
  FileText,
  CheckCircle2,
  XCircle,
  Clock
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
}

export default function TeacherDashboard({ user }: { user: any }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    activeAssignments: 0,
    averageScore: 0,
  });

  const [isCreateStudentDialogOpen, setIsCreateStudentDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isAddingStudent, setIsAddingStudent] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchClasses(),
        fetchAssignments(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`/api/teachers/${user.id}/classes`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
      
      // Update stats
      const totalStudents = data.reduce((acc, cls) => acc + cls.students.length, 0);
      setStats(prev => ({
        ...prev,
        totalStudents,
        totalClasses: data.length
      }));
    } catch (error) {
      throw error;
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/teachers/${user.id}/assignments`);
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data);

      // Update stats
      const activeAssignments = data.filter(a => new Date(a.dueDate) > new Date()).length;
      const completedAssignments = data.filter(a => a.submissions.length > 0);
      const totalScores = completedAssignments.reduce((acc, assignment) => {
        const assignmentScore = assignment.submissions.reduce((sum, sub) => {
          const correctAnswers = sub.answers?.filter(a => a.isCorrect).length || 0;
          return sum + (correctAnswers / assignment.questions.length) * 100;
        }, 0);
        return acc + (assignmentScore / assignment.submissions.length);
      }, 0);
      const averageScore = completedAssignments.length > 0 
        ? totalScores / completedAssignments.length 
        : 0;

      setStats(prev => ({
        ...prev,
        activeAssignments,
        averageScore: Math.round(averageScore)
      }));
    } catch (error) {
      throw error;
    }
  };

  const createClass = async () => {
    try {
      const response = await fetch(`/api/teachers/${user.id}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '',
          yearGroup: '',
          description: ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create class');
      }

      await fetchClasses();
      toast({
        title: 'Success',
        description: 'Class created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create class',
        variant: 'destructive',
      });
    }
  };

  const createAssignment = async () => {
    try {
      const response = await fetch(`/api/teachers/${user.id}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '',
          classId: '',
          dueDate: '',
          subject: '',
          topic: '',
          yearGroup: '',
          complexity: '',
          questions: []
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create assignment');
      }

      await fetchAssignments();
      toast({
        title: 'Success',
        description: 'Assignment created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create assignment',
        variant: 'destructive',
      });
    }
  };

  const addStudentToClass = async (classId: string, studentData: { name: string; email: string; password: string }) => {
    try {
      const response = await fetch(`/api/teachers/${user.id}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...studentData,
          classId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      await fetchClasses();
      toast({
        title: 'Success',
        description: 'Student added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add student',
        variant: 'destructive',
      });
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/teachers/${user.id}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      await fetchData();
      setIsCreateStudentDialogOpen(false);
      setNewStudent({ name: '', email: '', password: '' });
      toast({
        title: 'Success',
        description: 'Student created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create student',
        variant: 'destructive',
      });
    }
  };

  const handleCreateClass = () => {
    setSelectedClass(null);
    // Add your dialog logic here
  };

  const handleCreateAssignment = () => {
    setSelectedAssignment(null);
    // Add your dialog logic here
  };

  const handleAddStudent = (classId: string) => {
    // Add your dialog logic here
  };

  const handleAddStudentDialog = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newStudent,
          role: 'student',
          schoolId: user.schoolId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create student');
      }

      const newStudentData = await response.json();
      setStudents([...students, newStudentData]);
      setNewStudent({ name: '', email: '', password: '' });
      setIsAddingStudent(false);
      toast({
        title: 'Success',
        description: 'Student added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/teachers/${user.id}/students`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch students',
          variant: 'destructive',
        });
      }
    };

    fetchStudents();
  }, [user.id]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleCreateClass}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Class
          </Button>
          <Button onClick={handleCreateAssignment}>
            <FileText className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

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

      <Tabs defaultValue="classes" className="space-y-6">
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
                {stats.totalStudents}
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Class Management</CardTitle>
                  <CardDescription>Manage your classes and students</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search classes..."
                      className="pl-8"
                    />
                  </div>
                  <Button onClick={handleCreateClass}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Class
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Year Group</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Active Assignments</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>Year {cls.yearGroup}</TableCell>
                      <TableCell>{cls.students.length} students</TableCell>
                      <TableCell>
                        {assignments.filter(a => a.class.id === cls.id && new Date(a.dueDate) > new Date()).length}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" onClick={() => handleAddStudent(cls.id)}>
                          Add Student
                        </Button>
                        <Button variant="ghost" onClick={() => setSelectedClass(cls)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Assignments</CardTitle>
                  <CardDescription>Manage and track assignments</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assignments..."
                      className="pl-8"
                    />
                  </div>
                  <Button onClick={handleCreateAssignment}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Average Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => {
                    const submissionCount = assignment.submissions.length;
                    const averageScore = submissionCount > 0
                      ? Math.round(
                          assignment.submissions.reduce((acc, sub) => {
                            const correctAnswers = sub.answers?.filter(a => a.isCorrect).length || 0;
                            return acc + (correctAnswers / assignment.questions.length) * 100;
                          }, 0) / submissionCount
                        )
                      : 0;

                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">
                          <div>{assignment.title}</div>
                          {assignment.content && (
                            <div className="text-sm text-muted-foreground">
                              {assignment.content}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{assignment.class.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          {submissionCount} / {assignment.class.students.length}
                        </TableCell>
                        <TableCell>
                          <Badge variant={averageScore >= 70 ? "success" : averageScore >= 50 ? "warning" : "destructive"}>
                            {averageScore}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" onClick={() => setSelectedAssignment(assignment)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Students</h2>
            <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Create a new student account. They will receive their login credentials via email.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingStudent(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudentDialog}>Add Student</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>My Students</CardTitle>
                <CardDescription>Manage your students and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {student.enrolledIn?.map((cls) => (
                              <Badge key={cls.id} variant="outline">
                                {cls.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {student.progress.averageScore}% Average
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {student.progress.totalSubmissions} Submissions
                              </div>
                            </div>
                            <Badge 
                              variant={
                                student.progress.averageScore >= 80 ? "success" :
                                student.progress.averageScore >= 60 ? "warning" :
                                "destructive"
                              }
                            >
                              {student.progress.averageScore}%
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
