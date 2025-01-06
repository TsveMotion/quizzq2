'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Users, Pencil, Trash2, GraduationCap, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Class {
  id: string;
  name: string;
  description?: string;
  teachers?: Teacher[];
  _count?: {
    students: number;
    teachers: number;
  };
}

interface ManageClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classData: Class;
  teachers: Teacher[];
  students: Student[];
  schoolId: string;
}

export function ManageClassModal({
  isOpen,
  onClose,
  onSuccess,
  classData,
  teachers = [],
  students = [],
  schoolId,
}: ManageClassModalProps) {
  const [name, setName] = useState(classData?.name || '');
  const [description, setDescription] = useState(classData?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [classTeachers, setClassTeachers] = useState<Teacher[]>(classData?.teachers || []);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTeachers, setAvailableTeachers] = useState<Teacher[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch class data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchClassData();
    }
  }, [isOpen]);

  // Initialize available teachers when teachers prop changes
  useEffect(() => {
    const teacherIds = new Set(classTeachers.map(t => t.id));
    setAvailableTeachers(teachers.filter(t => !teacherIds.has(t.id)));
  }, [teachers, classTeachers]);

  // Initialize available students when students prop changes
  useEffect(() => {
    const studentIds = new Set(classStudents.map(s => s.id));
    setAvailableStudents(students.filter(s => !studentIds.has(s.id)));
  }, [students, classStudents]);

  const fetchClassData = async () => {
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        fetch(`/api/admin/classes/${classData.id}/students`),
        fetch(`/api/admin/classes/${classData.id}/teachers`)
      ]);

      if (!studentsRes.ok || !teachersRes.ok) {
        throw new Error('Failed to fetch class data');
      }

      const [studentsData, teachersData] = await Promise.all([
        studentsRes.json(),
        teachersRes.json()
      ]);

      setClassStudents(studentsData);
      setClassTeachers(teachersData);
    } catch (error) {
      console.error('Error fetching class data:', error);
      toast({
        title: "Error",
        description: "Failed to load class data",
        variant: "destructive",
      });
    }
  };

  const handleUpdateClass = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/classes/${classData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) throw new Error('Failed to update class');

      toast({
        title: "Success",
        description: "Class updated successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating class:', error);
      toast({
        title: "Error",
        description: "Failed to update class",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTeacher = async (teacher: Teacher) => {
    try {
      const response = await fetch(`/api/admin/classes/${classData.id}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId: teacher.id }),
      });

      if (!response.ok) throw new Error('Failed to add teacher to class');

      setClassTeachers([...classTeachers, teacher]);
      setAvailableTeachers(availableTeachers.filter(t => t.id !== teacher.id));
      
      toast({
        title: "Success",
        description: "Teacher added to class successfully",
      });
    } catch (error) {
      console.error('Error adding teacher:', error);
      toast({
        title: "Error",
        description: "Failed to add teacher to class",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTeacher = async (teacher: Teacher) => {
    try {
      const response = await fetch(`/api/admin/classes/${classData.id}/teachers`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId: teacher.id }),
      });

      if (!response.ok) throw new Error('Failed to remove teacher from class');

      setClassTeachers(classTeachers.filter(t => t.id !== teacher.id));
      setAvailableTeachers([...availableTeachers, teacher]);
      
      toast({
        title: "Success",
        description: "Teacher removed from class successfully",
      });
    } catch (error) {
      console.error('Error removing teacher:', error);
      toast({
        title: "Error",
        description: "Failed to remove teacher from class",
        variant: "destructive",
      });
    }
  };

  const handleAddStudent = async (student: Student) => {
    try {
      const response = await fetch(`/api/admin/classes/${classData.id}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: student.id }),
      });

      if (!response.ok) throw new Error('Failed to add student to class');

      setClassStudents([...classStudents, student]);
      setAvailableStudents(availableStudents.filter(s => s.id !== student.id));
      
      toast({
        title: "Success",
        description: "Student added to class successfully",
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: "Failed to add student to class",
        variant: "destructive",
      });
    }
  };

  const handleRemoveStudent = async (student: Student) => {
    try {
      const response = await fetch(`/api/admin/classes/${classData.id}/students`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: student.id }),
      });

      if (!response.ok) throw new Error('Failed to remove student from class');

      setClassStudents(classStudents.filter(s => s.id !== student.id));
      setAvailableStudents([...availableStudents, student]);
      
      toast({
        title: "Success",
        description: "Student removed from class successfully",
      });
    } catch (error) {
      console.error('Error removing student:', error);
      toast({
        title: "Error",
        description: "Failed to remove student from class",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClass = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/classes/${classData.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete class');

      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Class</DialogTitle>
          <DialogDescription>
            Update class details, manage teachers and students, or delete the class.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 overflow-hidden">
          <TabsList className="inline-flex h-14 items-center justify-center gap-6 rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="details"
              className="relative h-14 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                <span>Details</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="teachers"
              className="relative h-14 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Teachers</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="students"
              className="relative h-14 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Students</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={handleUpdateClass}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Class'
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isLoading}
                >
                  Delete Class
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teachers" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h3 className="font-medium">Class Teachers</h3>
                <p className="text-sm text-muted-foreground">
                  {classTeachers.length} teachers assigned
                </p>
              </div>
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[200px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Current Teachers */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Current Teachers</h4>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {classTeachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-2 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {teacher.email}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTeacher(teacher)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Available Teachers */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Available Teachers</h4>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {availableTeachers
                      .filter(teacher =>
                        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((teacher) => (
                        <div
                          key={teacher.id}
                          className="flex items-center justify-between p-2 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.email}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddTeacher(teacher)}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h3 className="font-medium">Class Students</h3>
                <p className="text-sm text-muted-foreground">
                  {classStudents.length} students enrolled
                </p>
              </div>
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[200px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Current Students */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Current Students</h4>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {classStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-2 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStudent(student)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Available Students */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Available Students</h4>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {availableStudents
                      .filter(student =>
                        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-2 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.email}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddStudent(student)}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSuccess();
            onClose();
          }}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class
              and remove all student and teacher associations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
