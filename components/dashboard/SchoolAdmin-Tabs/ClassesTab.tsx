'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  Download,
  FileEdit,
  Grid,
  MoreVertical,
  Plus,
  Table as TableIcon,
  Trash,
  Users,
} from "lucide-react";
import {
  Plus as PlusIcon, 
  Search, 
  Users as UsersIcon, 
  Trash as TrashIcon, 
  GraduationCap, 
  CalendarDays, 
  Pencil,
  Download as DownloadIcon,
  MoreVertical as MoreVerticalIcon,
  UserCog,
  Filter,
  FileEdit as FileEditIcon
} from "lucide-react";
import { CreateClassModal } from "./CreateClassModal";
import { ManageClassModal } from "./ManageClassModal";
import { ManageClassStudentsModal } from "./ManageClassStudentsModal";
import { Badge } from "@/components/ui/badge";
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

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Class {
  id: string;
  name: string;
  description?: string;
  teacher: Teacher;
  students?: Student[];
  createdAt: Date;
}

interface ClassesTabProps {
  classes: Class[];
  teachers: Teacher[];
  students: Student[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  schoolId: string;
  onClassesChange: () => void;
}

export function ClassesTab({
  classes,
  teachers,
  students,
  isLoading,
  searchTerm,
  setSearchTerm,
  schoolId,
  onClassesChange,
}: ClassesTabProps) {
  const { toast } = useToast();
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<Class | null>(null);
  const [selectedClassForEdit, setSelectedClassForEdit] = useState<Class | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'students' | 'teacher'>('name');
  const [filterStudentCount, setFilterStudentCount] = useState<string>('all');
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [editClassData, setEditClassData] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);

  const filteredClasses = classes
    .filter(
      (class_) =>
        (class_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (class_.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          class_.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStudentCount === 'all' ||
          (filterStudentCount === 'no-students' && (!class_.students || class_.students.length === 0)) ||
          (filterStudentCount === 'with-students' && class_.students && class_.students.length > 0))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'students':
          return (b.students?.length || 0) - (a.students?.length || 0);
        case 'teacher':
          return a.teacher.name.localeCompare(b.teacher.name);
        default:
          return 0;
      }
    });

  const handleDeleteClass = async (class_: Class) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/classes/${class_.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete class");
      }

      toast({
        title: "Success",
        description: `${class_.name} has been deleted successfully`,
      });

      // Refresh the classes list
      onClassesChange();
    } catch (error) {
      console.error("[DELETE_CLASS_ERROR]", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  const handleEditClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClassData) return;

    try {
      const response = await fetch(`/api/schools/${schoolId}/classes/${editClassData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: editClassData.name,
          description: editClassData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update class");
      }

      toast({
        title: "Success",
        description: "Class updated successfully",
      });

      setIsEditingClass(false);
      setEditClassData(null);
      
      // Refresh the classes list
      onClassesChange();
    } catch (error) {
      console.error("[EDIT_CLASS_ERROR]", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update class",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (class_: Class) => {
    if (confirm(`Are you sure you want to delete ${class_.name}? This action cannot be undone.`)) {
      handleDeleteClass(class_);
    }
  };

  const openEditDialog = (class_: Class) => {
    setEditClassData({
      id: class_.id,
      name: class_.name,
      description: class_.description || "",
    });
    setIsEditingClass(true);
  };

  const ClassCard = ({ class_ }: { class_: Class }) => {
    const totalStudents = class_.students?.length || 0;
    const maxStudents = 50; // Example maximum
    const progress = (totalStudents / maxStudents) * 100;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{class_.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSelectedClassForStudents(class_)}>
                  <UsersIcon className="mr-2 h-4 w-4" />
                  Manage Students
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openEditDialog(class_)}>
                  <FileEditIcon className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => confirmDelete(class_)}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>{class_.description || "No description"}</CardDescription>
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
              <GraduationCap className="mr-1 h-3 w-3" />
              {class_.teacher.name}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Created {format(new Date(class_.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Classes</h2>
          <p className="text-muted-foreground">
            Manage classes, students, and teacher assignments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const csvContent = [
                ['Name', 'Description', 'Teacher', 'Students', 'Created Date'].join(','),
                ...filteredClasses.map(class_ => [
                  class_.name,
                  class_.description || '',
                  class_.teacher.name,
                  class_.students?.length || 0,
                  format(new Date(class_.createdAt), "MMM d, yyyy")
                ].join(','))
              ].join('\n');

              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'classes.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }}
            className="h-9 w-9"
          >
            <DownloadIcon className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2 bg-muted p-1 rounded-md">
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-7"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-7"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={filterStudentCount}
              onValueChange={(value) => setFilterStudentCount(value)}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Filter by students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="with-students">With Students</SelectItem>
                <SelectItem value="no-students">No Students</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value: 'name' | 'students' | 'teacher') => setSortBy(value)}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="students">Student Count</SelectItem>
                <SelectItem value="teacher">Teacher Name</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
            <Button onClick={() => setIsAddingClass(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </div>
        </div>
      </div>

      <CreateClassModal
        isOpen={isAddingClass}
        onClose={() => setIsAddingClass(false)}
        onSuccess={onClassesChange}
        schoolId={schoolId}
        teachers={teachers}
      />

      {selectedClassForStudents && (
        <ManageClassStudentsModal
          isOpen={!!selectedClassForStudents}
          onClose={() => setSelectedClassForStudents(null)}
          onSuccess={onClassesChange}
          classData={selectedClassForStudents}
          schoolId={schoolId}
          allStudents={students}
        />
      )}

      {selectedClassForEdit && (
        <ManageClassModal
          isOpen={!!selectedClassForEdit}
          onClose={() => setSelectedClassForEdit(null)}
          onSuccess={onClassesChange}
          classData={selectedClassForEdit}
          schoolId={schoolId}
          teachers={teachers}
        />
      )}

      <Dialog open={isEditingClass} onOpenChange={(open) => {
        if (!open) {
          setEditClassData(null);
        }
        setIsEditingClass(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditClass}>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editClassData?.name || ""}
                  onChange={(e) => setEditClassData(prev => prev ? {...prev, name: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editClassData?.description || ""}
                  onChange={(e) => setEditClassData(prev => prev ? {...prev, description: e.target.value} : null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => {
                setIsEditingClass(false);
                setEditClassData(null);
              }}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {viewMode === 'table' ? (
        <div className="rounded-md border">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm ? (
                        <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                          <Search className="h-8 w-8 mb-2" />
                          <p>No classes found matching "{searchTerm}"</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                          <GraduationCap className="h-8 w-8 mb-2" />
                          <p>No classes added yet</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((class_) => (
                    <TableRow key={class_.id}>
                      <TableCell className="font-medium">{class_.name}</TableCell>
                      <TableCell>{class_.description || "-"}</TableCell>
                      <TableCell>{class_.teacher.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {class_.students?.length || 0} students
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {class_.createdAt ? format(new Date(class_.createdAt), "MMM d, yyyy") : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedClassForStudents(class_)}>
                              <UsersIcon className="mr-2 h-4 w-4" />
                              Manage Students
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(class_)}>
                              <FileEditIcon className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => confirmDelete(class_)}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
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
          {filteredClasses.length === 0 ? (
            <div className="col-span-full h-[200px] flex flex-col items-center justify-center text-sm text-muted-foreground">
              {searchTerm ? (
                <>
                  <Search className="h-8 w-8 mb-2" />
                  <p>No classes found matching "{searchTerm}"</p>
                </>
              ) : (
                <>
                  <GraduationCap className="h-8 w-8 mb-2" />
                  <p>No classes added yet</p>
                </>
              )}
            </div>
          ) : (
            filteredClasses.map((class_) => (
              <ClassCard key={class_.id} class_={class_} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
