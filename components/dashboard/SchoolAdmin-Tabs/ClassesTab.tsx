'use client';

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ClassWithTeacher, Teacher, Student } from './types';
import { CreateClassModal } from "./CreateClassModal";
import { Filter, Plus, Users, BookOpen, MoreVertical, Trash, GraduationCap, CalendarDays } from "lucide-react";

interface ClassesTabProps {
  classes: ClassWithTeacher[];
  teachers: Teacher[];
  students: Student[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  schoolId: string;
  onClassesChange: (classes: ClassWithTeacher[]) => void;
}

export function ClassesTab() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassWithTeacher[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classToDelete, setClassToDelete] = useState<ClassWithTeacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    if (!session?.user?.schoolId) {
      console.error('No school ID in session');
      return;
    }
    fetchData(session.user.schoolId);
  }, [session?.user?.schoolId]);

  const fetchData = async (schoolId: string | null | undefined) => {
    if (!schoolId) {
      console.error('No school ID provided');
      return;
    }
    try {
      const [classesRes, teachersRes, studentsRes] = await Promise.all([
        fetch(`/api/schools/${schoolId}/classes`),
        fetch(`/api/schools/${schoolId}/teachers`),
        fetch(`/api/schools/${schoolId}/students`)
      ]);

      const [classesData, teachersData, studentsData] = await Promise.all([
        classesRes.json(),
        teachersRes.json(),
        studentsRes.json()
      ]);

      if (!classesRes.ok) throw new Error('Failed to fetch classes');
      if (!teachersRes.ok) throw new Error('Failed to fetch teachers');
      if (!studentsRes.ok) throw new Error('Failed to fetch students');

      setClasses(classesData);
      setTeachers(teachersData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!classToDelete || !session?.user?.schoolId) return;

    try {
      const response = await fetch(`/api/schools/${session.user.schoolId}/classes/${classToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete class');
      }

      setClasses(classes.filter(c => c.id !== classToDelete.id));
      setClassToDelete(null);
      setIsModalOpen(false);

      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session?.user?.schoolId) {
    return;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Class
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[600px] rounded-md border">
        {viewMode === 'table' ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Quizzes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium">{classItem.name}</TableCell>
                  <TableCell>{classItem.teacher.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      <Users className="mr-1 h-3 w-3" />
                      {classItem._count.students}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      <BookOpen className="mr-1 h-3 w-3" />
                      {classItem._count.quizzes}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(classItem.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Class</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                          Are you sure you want to delete the class &quot;{classItem.name}&quot;?
                        </DialogDescription>
                        <DialogFooter>
                          <DialogTrigger asChild>
                            <Button variant="ghost">Cancel</Button>
                          </DialogTrigger>
                          <Button variant="destructive" onClick={() => {
                            setClassToDelete(classItem);
                            handleDeleteClass();
                          }}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id}>
                <CardHeader>
                  <CardTitle>{classItem.name}</CardTitle>
                  <CardDescription>{classItem.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span>{classItem.teacher.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>{classItem._count.students} Students</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>{classItem._count.quizzes} Quizzes</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>{format(new Date(classItem.createdAt), "MMM d, yyyy")}</span>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full mt-4"
                      onClick={() => {
                        setClassToDelete(classItem);
                        handleDeleteClass();
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete Class
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      <CreateClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchData(session.user.schoolId);
        }}
        schoolId={session?.user?.schoolId || ''}
        teachers={teachers}
      />
    </div>
  );
}
