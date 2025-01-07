'use client';

import { useState, useEffect } from "react";
import { User } from "@prisma/client";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface TeachersTabProps {
  schoolId: string;
}

interface Teacher extends User {
  teachingClasses?: {
    id: string;
    name: string;
    students: {
      id: string;
      name: string;
      email: string;
    }[];
  }[];
  _count?: {
    teachingClasses: number;
    students: number;
  };
}

export function TeachersTab({ schoolId }: TeachersTabProps) {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'classes' | 'students'>('name');
  const [filterClassCount, setFilterClassCount] = useState<string>('all');
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/schooladmin/teachers');
        if (!response.ok) throw new Error('Failed to fetch teachers');
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        toast({
          title: "Error",
          description: "Failed to load teachers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [toast]);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingTeacher(true);

    try {
      const response = await fetch('/api/schooladmin/teachers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeacher),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create teacher');
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Teacher added successfully",
      });

      // Reset form and close modal
      setNewTeacher({ name: "", email: "", password: "" });
      setIsAddingTeacher(false);

      // Add the new teacher to the list
      setTeachers(prev => [data, ...prev]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add teacher",
        variant: "destructive",
      });
    } finally {
      setIsAddingTeacher(false);
    }
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    setTeacherToDelete(teacher);
  };

  const confirmDeleteTeacher = async () => {
    if (!teacherToDelete) return;

    try {
      const response = await fetch(`/api/schooladmin/teachers/${teacherToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete teacher');
      }

      toast({
        title: "Success",
        description: `${teacherToDelete.name} has been deleted successfully`,
      });

      // Remove teacher from the list
      setTeachers(prev => prev.filter(t => t.id !== teacherToDelete.id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete teacher",
        variant: "destructive",
      });
    } finally {
      setTeacherToDelete(null);
    }
  };

  const handleExportTeachers = () => {
    const csvContent = [
      ['Name', 'Email', 'Classes', 'Students', 'Joined Date'].join(','),
      ...teachers.map(teacher => [
        teacher.name,
        teacher.email,
        teacher._count?.teachingClasses || 0,
        teacher._count?.students || 0,
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

  const filteredTeachers = teachers
    .filter((teacher) =>
      (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClassCount === 'all' ||
        (filterClassCount === 'no-classes' && (!teacher._count?.teachingClasses || teacher._count.teachingClasses === 0)) ||
        (filterClassCount === 'with-classes' && teacher._count?.teachingClasses && teacher._count.teachingClasses > 0))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'classes':
          return (b._count?.teachingClasses || 0) - (a._count?.teachingClasses || 0);
        case 'students':
          return (b._count?.students || 0) - (a._count?.students || 0);
        default:
          return 0;
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Teachers</h2>
          <p className="text-sm text-muted-foreground">
            Manage your school&apos;s teachers
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

          <div className="flex items-center space-x-2">
            <Select
              value={filterClassCount}
              onValueChange={setFilterClassCount}
            >
              <SelectTrigger className="w-[130px]">
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
              <SelectTrigger className="w-[130px]">
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

            <Dialog open={isAddingTeacher} onOpenChange={setIsAddingTeacher}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                  <DialogDescription>
                    Add a new teacher to your school. They will receive an email with their login credentials.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTeacher}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={newTeacher.name}
                        onChange={(e) =>
                          setNewTeacher({ ...newTeacher, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={newTeacher.email}
                        onChange={(e) =>
                          setNewTeacher({ ...newTeacher, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newTeacher.password}
                        onChange={(e) =>
                          setNewTeacher({ ...newTeacher, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isAddingTeacher}>
                      {isAddingTeacher ? "Adding..." : "Add Teacher"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

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
                        {teacher._count?.teachingClasses || 0} classes
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {teacher._count?.students || 0} students
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
    </div>
  );
}
