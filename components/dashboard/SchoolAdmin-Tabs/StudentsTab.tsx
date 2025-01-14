'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CreateStudentModal } from "./CreateStudentModal";
import { EditStudentModal } from "./EditStudentModal";
import { Filter, Plus, Users, BookOpen, MoreVertical, Trash, GraduationCap, CalendarDays } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: {
    classes: number;
    quizResults: number;
  };
}

export function StudentsTab() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'classes' | 'quizzes'>('name');
  const [filterClassCount, setFilterClassCount] = useState<string>('all');

  useEffect(() => {
    if (session?.user?.schoolId) {
      fetchStudents(session.user.schoolId);
    }
  }, [session]);

  const fetchStudents = async (schoolId: string) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/students`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch students');
      }
      
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch students',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete || !session?.user?.schoolId) return;

    try {
      const response = await fetch(`/api/schools/${session.user.schoolId}/students/${studentToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      setStudents(students.filter(s => s.id !== studentToDelete.id));
      setStudentToDelete(null);

      toast({
        title: "Success",
        description: `${studentToDelete.name} has been deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterClassCount === 'all') return matchesSearch;
    if (filterClassCount === 'none') return matchesSearch && student._count.classes === 0;
    if (filterClassCount === 'one') return matchesSearch && student._count.classes === 1;
    return matchesSearch && student._count.classes > 1;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'classes') {
      return b._count.classes - a._count.classes;
    } else {
      return b._count.quizResults - a._count.quizResults;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-50">Students</h2>
          <p className="text-blue-200">Manage your school's students</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddingStudent(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-blue-800/20 border-blue-800/40 text-blue-50 placeholder:text-blue-400"
          />
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy('name')}
            className={`border-blue-800/40 text-blue-200 hover:bg-blue-800/20 ${
              sortBy === 'name' ? 'bg-blue-800/30' : ''
            }`}
          >
            Name
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy('classes')}
            className={`border-blue-800/40 text-blue-200 hover:bg-blue-800/20 ${
              sortBy === 'classes' ? 'bg-blue-800/30' : ''
            }`}
          >
            Classes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy('quizzes')}
            className={`border-blue-800/40 text-blue-200 hover:bg-blue-800/20 ${
              sortBy === 'quizzes' ? 'bg-blue-800/30' : ''
            }`}
          >
            Quizzes
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            className="border-blue-800/40 text-blue-200 hover:bg-blue-800/20"
          >
            {viewMode === 'table' ? (
              <Users className="h-4 w-4" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-blue-800/40 bg-blue-800/20">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-blue-800/30 border-blue-800/40">
              <TableHead className="text-blue-200">Name</TableHead>
              <TableHead className="text-blue-200">Email</TableHead>
              <TableHead className="text-blue-200">Classes</TableHead>
              <TableHead className="text-blue-200">Quizzes</TableHead>
              <TableHead className="text-blue-200 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStudents.map((student) => (
              <TableRow
                key={student.id}
                className="hover:bg-blue-800/30 border-blue-800/40"
              >
                <TableCell className="font-medium text-blue-50">
                  {student.name}
                </TableCell>
                <TableCell className="text-blue-200">{student.email}</TableCell>
                <TableCell>
                  <Badge className="bg-blue-500/20 text-blue-200">
                    <BookOpen className="mr-1 h-3 w-3" />
                    {student._count.classes}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-blue-500/20 text-blue-200">
                    <GraduationCap className="mr-1 h-3 w-3" />
                    {student._count.quizResults}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStudentToEdit(student)}
                      className="h-8 w-8 text-blue-200 hover:bg-blue-800/30"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStudentToDelete(student)}
                      className="h-8 w-8 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
        <AlertDialogContent className="bg-blue-900 border-blue-800/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-blue-50">Delete Student</AlertDialogTitle>
            <AlertDialogDescription className="text-blue-200">
              Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-blue-800/40 text-blue-200 hover:bg-blue-800/20"
              onClick={() => setStudentToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteStudent}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateStudentModal
        isOpen={isAddingStudent}
        onClose={() => setIsAddingStudent(false)}
        onSuccess={() => {
          setIsAddingStudent(false);
          if (session?.user?.schoolId) {
            fetchStudents(session.user.schoolId);
          }
        }}
        schoolId={session?.user?.schoolId || ''}
      />

      <EditStudentModal
        isOpen={!!studentToEdit}
        onClose={() => setStudentToEdit(null)}
        onSuccess={() => {
          setStudentToEdit(null);
          if (session?.user?.schoolId) {
            fetchStudents(session.user.schoolId);
          }
        }}
        student={studentToEdit}
        schoolId={session?.user?.schoolId || ''}
      />
    </div>
  );
}
