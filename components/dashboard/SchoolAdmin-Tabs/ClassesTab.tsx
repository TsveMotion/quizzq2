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
import { Plus, Search, Users, Trash, GraduationCap, CalendarDays, Pencil } from "lucide-react";
import { CreateClassModal } from "./CreateClassModal";
import { ManageClassModal } from "./ManageClassModal";
import { ManageClassStudentsModal } from "./ManageClassStudentsModal";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

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

  const filteredClasses = classes.filter(
    (class_) =>
      class_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (class_.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      class_.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClass = async (classId: string) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/classes/${classId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete class");
      }

      toast({
        title: "Success",
        description: "Class deleted successfully",
      });

      onClassesChange();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
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
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedClassForStudents(class_)}
                          title="Manage Students"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedClassForEdit(class_)}
                          title="Edit Class"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClass(class_.id)}
                          title="Delete Class"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
