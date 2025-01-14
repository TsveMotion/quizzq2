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
import { CreateTeacherModal } from "./CreateTeacherModal";
import { EditTeacherModal } from "./EditTeacherModal";
import { Filter, Plus, Users, BookOpen, MoreVertical, Trash, GraduationCap } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: {
    classes: number;
    students: number;
  };
}

export function TeachersTab() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'classes' | 'students'>('name');

  useEffect(() => {
    if (session?.user?.schoolId) {
      fetchTeachers();
    }
  }, [session]);

  const fetchTeachers = async () => {
    if (!session?.user?.schoolId) return;
    
    try {
      const response = await fetch('/api/schooladmin/teachers');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch teachers');
      }
      
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch teachers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!teacherToDelete || !session?.user?.schoolId) return;

    try {
      const response = await fetch(`/api/schooladmin/teachers/${teacherToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error('Failed to delete teacher');
      }

      setTeachers(teachers.filter(t => t.id !== teacherToDelete.id));
      setTeacherToDelete(null);

      toast({
        title: "Success",
        description: `${teacherToDelete.name} has been deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete teacher",
        variant: "destructive",
      });
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'classes') {
      return b._count.classes - a._count.classes;
    } else {
      return b._count.students - a._count.students;
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
          <h2 className="text-2xl font-bold text-blue-50">Teachers</h2>
          <p className="text-blue-200">Manage your school's teachers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddingTeacher(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search teachers..."
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
            onClick={() => setSortBy('students')}
            className={`border-blue-800/40 text-blue-200 hover:bg-blue-800/20 ${
              sortBy === 'students' ? 'bg-blue-800/30' : ''
            }`}
          >
            Students
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
              <TableHead className="text-blue-200">Students</TableHead>
              <TableHead className="text-blue-200 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeachers.map((teacher) => (
              <TableRow
                key={teacher.id}
                className="hover:bg-blue-800/30 border-blue-800/40"
              >
                <TableCell className="font-medium text-blue-50">
                  {teacher.name}
                </TableCell>
                <TableCell className="text-blue-200">{teacher.email}</TableCell>
                <TableCell>
                  <Badge className="bg-blue-500/20 text-blue-200">
                    <BookOpen className="mr-1 h-3 w-3" />
                    {teacher._count.classes}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-blue-500/20 text-blue-200">
                    <GraduationCap className="mr-1 h-3 w-3" />
                    {teacher._count.students}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTeacherToEdit(teacher)}
                      className="h-8 w-8 text-blue-200 hover:bg-blue-800/30"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTeacherToDelete(teacher)}
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

      <AlertDialog open={!!teacherToDelete} onOpenChange={() => setTeacherToDelete(null)}>
        <AlertDialogContent className="bg-blue-900 border-blue-800/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-blue-50">Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription className="text-blue-200">
              Are you sure you want to delete {teacherToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-blue-800/40 text-blue-200 hover:bg-blue-800/20"
              onClick={() => setTeacherToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteTeacher}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateTeacherModal
        isOpen={isAddingTeacher}
        onClose={() => setIsAddingTeacher(false)}
        onSuccess={() => {
          setIsAddingTeacher(false);
          fetchTeachers();
        }}
        schoolId={session?.user?.schoolId || ''}
      />

      <EditTeacherModal
        isOpen={!!teacherToEdit}
        onClose={() => setTeacherToEdit(null)}
        onSuccess={() => {
          setTeacherToEdit(null);
          fetchTeachers();
        }}
        teacher={teacherToEdit}
        schoolId={session?.user?.schoolId || ''}
      />
    </div>
  );
}
