'use client';

import { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Form schemas
const classFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

const assignmentFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dueDate: z.string().optional(),
  topic: z.string().min(2, 'Topic must be at least 2 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numQuestions: z.number().min(1).max(20),
});

const addStudentFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const createStudentFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const resetPasswordFormSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function TeacherDashboard({ user }) {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [isManagingClass, setIsManagingClass] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { toast } = useToast();

  const classForm = useForm({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const assignmentForm = useForm({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      topic: '',
      difficulty: 'medium',
      numQuestions: 5,
    },
  });

  const addStudentForm = useForm({
    resolver: zodResolver(addStudentFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const createStudentForm = useForm({
    resolver: zodResolver(createStudentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const resetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
    },
  });

  useEffect(() => {
    if (user?.id) {
      fetchClasses();
      fetchAssignments();
      fetchAllStudents();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && allStudents.length > 0) {
      // Filter out students already in the class
      const classStudentIds = new Set(students.map(s => s.id));
      const filtered = allStudents.filter(
        student => !classStudentIds.has(student.id) &&
        (student.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
         student.email.toLowerCase().includes(studentSearch.toLowerCase()))
      );
      setAvailableStudents(filtered);
    }
  }, [selectedClass, allStudents, students, studentSearch]);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }

      const data = await response.json();
      setClasses(data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch classes',
        variant: 'destructive',
      });
    }
  };

  const fetchClassStudents = async () => {
    if (!selectedClass) return;
    
    try {
      const response = await fetch(`/api/classes/${selectedClass.id}/students`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch students',
        variant: 'destructive',
      });
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await fetch('/api/students', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setAllStudents(data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch students',
        variant: 'destructive',
      });
    }
  };

  const onAddStudent = async (data) => {
    try {
      const response = await fetch(`/api/classes/${selectedClass.id}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add student');
      }

      toast({
        title: 'Success',
        description: 'Student added successfully',
      });

      setIsAddingStudent(false);
      addStudentForm.reset();
      fetchClassStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add student',
        variant: 'destructive',
      });
    }
  };

  const onRemoveStudent = async (studentId) => {
    try {
      const response = await fetch(`/api/classes/${selectedClass.id}/students/${studentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to remove student');
      }

      toast({
        title: 'Success',
        description: 'Student removed successfully',
      });

      fetchClassStudents();
    } catch (error) {
      console.error('Error removing student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove student',
        variant: 'destructive',
      });
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/assignments', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await response.json();
      setAssignments(data.assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch assignments',
        variant: 'destructive',
      });
    }
  };

  const onCreateClass = async (data) => {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create class');
      }

      toast({
        title: 'Success',
        description: 'Class created successfully',
      });

      setIsAddingClass(false);
      classForm.reset();
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create class',
        variant: 'destructive',
      });
    }
  };

  const onCreateAssignment = async (data) => {
    try {
      if (!selectedClass) {
        throw new Error('Please select a class first');
      }

      const response = await fetch(`/api/classes/${selectedClass.id}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create assignment');
      }

      toast({
        title: 'Success',
        description: 'Assignment created successfully',
      });

      setIsCreatingAssignment(false);
      assignmentForm.reset();
      fetchAssignments();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create assignment',
        variant: 'destructive',
      });
    }
  };

  const onCreateStudent = async (data) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create student');
      }

      toast({
        title: 'Success',
        description: 'Student created successfully',
      });

      setIsCreatingStudent(false);
      createStudentForm.reset();
      fetchAllStudents();
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create student',
        variant: 'destructive',
      });
    }
  };

  const onResetPassword = async (data) => {
    try {
      const response = await fetch(`/api/students/${selectedStudent.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }

      toast({
        title: 'Success',
        description: 'Password reset successfully',
      });

      setIsResettingPassword(false);
      resetPasswordForm.reset();
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
      
      <Tabs defaultValue="classes">
        <TabsList className="mb-4">
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Your Classes</CardTitle>
              <CardDescription>Manage your classes and students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsAddingClass(true)}>
                  Create New Class
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls) => (
                  <Card key={cls.id}>
                    <CardHeader>
                      <CardTitle>{cls.name}</CardTitle>
                      <CardDescription>{cls.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Students: {cls.students?.length || 0}</p>
                      <p>Assignments: {cls.assignments?.length || 0}</p>
                      <div className="mt-4 space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedClass(cls);
                            setIsManagingClass(true);
                          }}
                        >
                          Manage Students
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Create and manage assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsCreatingAssignment(true)}>
                  Create New Assignment
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <CardTitle>{assignment.title}</CardTitle>
                      <CardDescription>{assignment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</p>
                      <p>Submissions: {assignment.submissions?.length || 0}</p>
                      <div className="mt-4">
                        <Button variant="outline">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Manage your students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsCreatingStudent(true)}>
                  Create New Student
                </Button>
              </div>

              <ScrollArea className="h-[600px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name || 'N/A'}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.enrolledIn?.length || 0} classes</TableCell>
                        <TableCell>
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsResettingPassword(true);
                              }}
                            >
                              Reset Password
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View class performance and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Analytics content will be added later */}
              <p>Analytics feature coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Class Dialog */}
      <Dialog open={isAddingClass} onOpenChange={setIsAddingClass}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>
              Create a new class for your students
            </DialogDescription>
          </DialogHeader>

          <Form {...classForm}>
            <form onSubmit={classForm.handleSubmit(onCreateClass)} className="space-y-4">
              <FormField
                control={classForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter class name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={classForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter class description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingClass(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Class</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Create Assignment Dialog */}
      <Dialog open={isCreatingAssignment} onOpenChange={setIsCreatingAssignment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment using AI-generated questions
            </DialogDescription>
          </DialogHeader>

          <Form {...assignmentForm}>
            <form onSubmit={assignmentForm.handleSubmit(onCreateAssignment)} className="space-y-4">
              <FormField
                control={assignmentForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter assignment title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={assignmentForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter assignment description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={assignmentForm.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the topic for AI to generate questions" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={assignmentForm.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border rounded-md p-2"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={assignmentForm.control}
                  name="numQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          max="20"
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={assignmentForm.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="datetime-local" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreatingAssignment(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Assignment</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Manage Class Dialog */}
      <Dialog open={isManagingClass} onOpenChange={setIsManagingClass}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Class: {selectedClass?.name}</DialogTitle>
            <DialogDescription>
              Add or remove students from this class
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Students */}
            <div className="space-y-4">
              <div className="font-semibold">Current Students</div>
              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name || 'N/A'}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onRemoveStudent(student.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {students.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No students in this class
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Available Students */}
            <div className="space-y-4">
              <div className="font-semibold">Add Students</div>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
                <Button onClick={() => setIsCreatingStudent(true)}>
                  New Student
                </Button>
              </div>
              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name || 'N/A'}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddStudent({ email: student.email })}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {availableStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          {studentSearch
                            ? 'No matching students found'
                            : 'No available students'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Enter the student's email address to add them to the class
            </DialogDescription>
          </DialogHeader>

          <Form {...addStudentForm}>
            <form onSubmit={addStudentForm.handleSubmit(onAddStudent)} className="space-y-4">
              <FormField
                control={addStudentForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="student@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Add Student</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Create Student Dialog */}
      <Dialog open={isCreatingStudent} onOpenChange={setIsCreatingStudent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Student</DialogTitle>
            <DialogDescription>
              Create a new student account
            </DialogDescription>
          </DialogHeader>

          <Form {...createStudentForm}>
            <form onSubmit={createStudentForm.handleSubmit(onCreateStudent)} className="space-y-4">
              <FormField
                control={createStudentForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createStudentForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="student@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createStudentForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Create Student</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResettingPassword} onOpenChange={setIsResettingPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {selectedStudent?.name || selectedStudent?.email}
            </DialogDescription>
          </DialogHeader>

          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-4">
              <FormField
                control={resetPasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Reset Password</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
