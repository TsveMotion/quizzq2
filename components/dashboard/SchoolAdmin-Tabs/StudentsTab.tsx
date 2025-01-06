'use client';

import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Search,
  Mail,
  Trash,
  UserCircle,
  CalendarDays,
  UserCog,
  Filter,
  Download,
  MoreVertical,
  Send,
  FileEdit,
  Users,
} from "lucide-react";
import { CreateStudentModal } from "./CreateStudentModal";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { EditStudentModal } from "./EditStudentModal";

interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  enrolledClasses?: {
    id: string;
    name: string;
    teacher: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

interface StudentsTabProps {
  students: Student[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  schoolId: string;
  onStudentsChange: () => void;
}

export function StudentsTab({
  students,
  isLoading,
  searchTerm,
  setSearchTerm,
  schoolId,
  onStudentsChange,
}: StudentsTabProps) {
  const { toast } = useToast();
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'classes' | 'teachers'>('name');
  const [filterClassCount, setFilterClassCount] = useState<string>('all');

  const filteredStudents = students
    .filter(
      (student) =>
        (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterClassCount === 'all' ||
          (filterClassCount === 'no-classes' && (!student.enrolledClasses || student.enrolledClasses.length === 0)) ||
          (filterClassCount === 'with-classes' && student.enrolledClasses && student.enrolledClasses.length > 0))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'classes':
          return (b.enrolledClasses?.length || 0) - (a.enrolledClasses?.length || 0);
        case 'teachers':
          return (
            (new Set(b.enrolledClasses?.map(cls => cls.teacher.id) || []).size) -
            (new Set(a.enrolledClasses?.map(cls => cls.teacher.id) || []).size)
          );
        default:
          return 0;
      }
    });

  const handleDeleteStudent = async (student: Student) => {
    setStudentToDelete(student);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      const response = await fetch(`/api/schools/${schoolId}/students/${studentToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete student");
      }

      toast({
        title: "Success",
        description: `${studentToDelete.name} has been deleted successfully`,
      });

      onStudentsChange();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student",
        variant: "destructive",
      });
    } finally {
      setStudentToDelete(null);
    }
  };

  const handleExportStudents = () => {
    const csvContent = [
      ['Name', 'Email', 'Classes', 'Teachers', 'Joined Date'].join(','),
      ...filteredStudents.map(student => [
        student.name,
        student.email,
        student.enrolledClasses?.length || 0,
        new Set(student.enrolledClasses?.map(cls => cls.teacher.id) || []).size,
        format(new Date(student.createdAt), "MMM d, yyyy")
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const StudentCard = ({ student }: { student: Student }) => {
    const totalClasses = student.enrolledClasses?.length || 0;
    const maxClasses = 10; // Example maximum
    const progress = (totalClasses / maxClasses) * 100;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{student.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setStudentToEdit(student)}>
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDeleteStudent(student)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>{student.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Classes</span>
              <span className="font-medium">{totalClasses}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              {new Set(student.enrolledClasses?.map(cls => cls.teacher.id) || []).size} teachers
            </Badge>
            <span className="text-xs text-muted-foreground">
              Joined {format(new Date(student.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Students</h2>
            <p className="text-muted-foreground">
              Manage students and their class enrollments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleExportStudents}
              className="h-9 w-9"
            >
              <Download className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2 bg-muted p-1 rounded-md">
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-7"
              >
                <UserCog className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-7"
              >
                <Users className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={filterClassCount}
                onValueChange={(value) => setFilterClassCount(value)}
              >
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Filter by classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="with-classes">With Classes</SelectItem>
                  <SelectItem value="no-classes">No Classes</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value: 'name' | 'classes' | 'teachers') => setSortBy(value)}
              >
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="classes">Classes Count</SelectItem>
                  <SelectItem value="teachers">Teachers Count</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>
              <Button onClick={() => setIsAddingStudent(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          </div>
        </div>

        <CreateStudentModal
          isOpen={isAddingStudent}
          onClose={() => setIsAddingStudent(false)}
          onSuccess={onStudentsChange}
          schoolId={schoolId}
        />

        {studentToEdit && (
          <EditStudentModal
            isOpen={!!studentToEdit}
            onClose={() => setStudentToEdit(null)}
            onSuccess={onStudentsChange}
            student={studentToEdit}
            schoolId={schoolId}
          />
        )}

        <AlertDialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Student</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
                The student will be removed from all enrolled classes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteStudent}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {viewMode === 'table' ? (
          <div className="rounded-md border">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        {searchTerm ? (
                          <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                            <Search className="h-8 w-8 mb-2" />
                            <p>No students found matching "{searchTerm}"</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                            <UserCircle className="h-8 w-8 mb-2" />
                            <p>No students added yet</p>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {student.enrolledClasses?.length || 0} classes
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {new Set(
                              student.enrolledClasses?.map(
                                (class_) => class_.teacher.id
                              ) || []
                            ).size || 0} teachers
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {format(new Date(student.createdAt), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setStudentToEdit(student)}>
                                <FileEdit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteStudent(student)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.length === 0 ? (
              <div className="col-span-full h-[200px] flex flex-col items-center justify-center text-sm text-muted-foreground">
                {searchTerm ? (
                  <>
                    <Search className="h-8 w-8 mb-2" />
                    <p>No students found matching "{searchTerm}"</p>
                  </>
                ) : (
                  <>
                    <UserCircle className="h-8 w-8 mb-2" />
                    <p>No students added yet</p>
                  </>
                )}
              </div>
            ) : (
              filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
