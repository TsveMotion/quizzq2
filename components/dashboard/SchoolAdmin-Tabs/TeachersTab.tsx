'use client';

import { useState, useEffect } from "react";
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
  GraduationCap,
  CalendarDays,
  UserCog,
  Filter,
  Download,
  MoreVertical,
  Send,
  FileEdit,
  Users,
} from "lucide-react";
import { CreateTeacherModal } from "./CreateTeacherModal";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { EditTeacherModal } from "./EditTeacherModal";

interface Teacher {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  teachingClasses?: {
    id: string;
    name: string;
    students: {
      id: string;
      name: string;
      email: string;
    }[];
  }[];
}

interface TeachersTabProps {
  teachers: Teacher[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  schoolId: string;
  onTeachersChange: () => void;
}

export function TeachersTab({
  teachers,
  isLoading,
  searchTerm,
  setSearchTerm,
  schoolId,
  onTeachersChange,
}: TeachersTabProps) {
  const { toast } = useToast();
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'classes' | 'students'>('name');
  const [filterClassCount, setFilterClassCount] = useState<string>('all');

  const filteredTeachers = teachers
    .filter(
      (teacher) =>
        (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterClassCount === 'all' ||
          (filterClassCount === 'no-classes' && (!teacher.teachingClasses || teacher.teachingClasses.length === 0)) ||
          (filterClassCount === 'with-classes' && teacher.teachingClasses && teacher.teachingClasses.length > 0))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'classes':
          return (b.teachingClasses?.length || 0) - (a.teachingClasses?.length || 0);
        case 'students':
          return (
            (b.teachingClasses?.reduce((total, cls) => total + (cls.students?.length || 0), 0) || 0) -
            (a.teachingClasses?.reduce((total, cls) => total + (cls.students?.length || 0), 0) || 0)
          );
        default:
          return 0;
      }
    });

  const handleDeleteTeacher = async (teacher: Teacher) => {
    setTeacherToDelete(teacher);
  };

  const confirmDeleteTeacher = async () => {
    if (!teacherToDelete) return;

    try {
      const response = await fetch(`/api/schools/${schoolId}/teachers/${teacherToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete teacher");
      }

      toast({
        title: "Success",
        description: `${teacherToDelete.name} has been deleted successfully`,
      });

      onTeachersChange();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete teacher",
        variant: "destructive",
      });
    } finally {
      setTeacherToDelete(null);
    }
  };

  const handleExportTeachers = () => {
    const csvContent = [
      ['Name', 'Email', 'Classes', 'Students', 'Joined Date'].join(','),
      ...filteredTeachers.map(teacher => [
        teacher.name,
        teacher.email,
        teacher.teachingClasses?.length || 0,
        teacher.teachingClasses?.reduce((total, cls) => total + (cls.students?.length || 0), 0) || 0,
        format(new Date(teacher.createdAt), "MMM d, yyyy")
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers.csv';
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

  const TeacherCard = ({ teacher }: { teacher: Teacher }) => {
    const totalStudents = teacher.teachingClasses?.reduce(
      (total, cls) => total + (cls.students?.length || 0),
      0
    ) || 0;
    const maxStudents = 100; // Example maximum
    const progress = (totalStudents / maxStudents) * 100;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{teacher.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTeacherToEdit(teacher)}>
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDeleteTeacher(teacher)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>{teacher.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Students</span>
              <span className="font-medium">{totalStudents}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              {teacher.teachingClasses?.length || 0} classes
            </Badge>
            <span className="text-xs text-muted-foreground">
              Joined {format(new Date(teacher.createdAt), "MMM d, yyyy")}
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
            <h2 className="text-2xl font-bold tracking-tight">Teachers</h2>
            <p className="text-muted-foreground">
              Manage teachers and their class assignments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleExportTeachers}
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
                  <SelectItem value="all">All Teachers</SelectItem>
                  <SelectItem value="with-classes">With Classes</SelectItem>
                  <SelectItem value="no-classes">No Classes</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value: 'name' | 'classes' | 'students') => setSortBy(value)}
              >
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="classes">Classes Count</SelectItem>
                  <SelectItem value="students">Students Count</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>
              <Button onClick={() => setIsAddingTeacher(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </div>
          </div>
        </div>

        <CreateTeacherModal
          isOpen={isAddingTeacher}
          onClose={() => setIsAddingTeacher(false)}
          onSuccess={onTeachersChange}
          schoolId={schoolId}
        />

        {teacherToEdit && (
          <EditTeacherModal
            isOpen={!!teacherToEdit}
            onClose={() => setTeacherToEdit(null)}
            onSuccess={onTeachersChange}
            teacher={teacherToEdit}
            schoolId={schoolId}
          />
        )}

        <AlertDialog open={!!teacherToDelete} onOpenChange={() => setTeacherToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {teacherToDelete?.name}? This action cannot be undone.
                The teacher will be removed from all associated classes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteTeacher}
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
                    <TableHead>Students</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        {searchTerm ? (
                          <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                            <Search className="h-8 w-8 mb-2" />
                            <p>No teachers found matching "{searchTerm}"</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                            <GraduationCap className="h-8 w-8 mb-2" />
                            <p>No teachers added yet</p>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {teacher.teachingClasses?.length || 0} classes
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {teacher.teachingClasses?.reduce(
                              (total, class_) => total + (class_.students?.length || 0),
                              0
                            ) || 0} students
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {format(new Date(teacher.createdAt), "MMM d, yyyy")}
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
                              <DropdownMenuItem onClick={() => setTeacherToEdit(teacher)}>
                                <FileEdit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteTeacher(teacher)}
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
            {filteredTeachers.length === 0 ? (
              <div className="col-span-full h-[200px] flex flex-col items-center justify-center text-sm text-muted-foreground">
                {searchTerm ? (
                  <>
                    <Search className="h-8 w-8 mb-2" />
                    <p>No teachers found matching "{searchTerm}"</p>
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-8 w-8 mb-2" />
                    <p>No teachers added yet</p>
                  </>
                )}
              </div>
            ) : (
              filteredTeachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
