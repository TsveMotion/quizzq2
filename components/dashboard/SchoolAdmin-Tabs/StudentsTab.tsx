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
import { Plus, Search, Mail, Trash, UserCircle, CalendarDays } from "lucide-react";
import { CreateStudentModal } from "./CreateStudentModal";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

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

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/students/${studentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      toast({
        title: "Success",
        description: "Student deleted successfully",
      });

      onStudentsChange();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student",
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
          <h2 className="text-2xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage students and their class enrollments
          </p>
        </div>
        <div className="flex items-center space-x-2">
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

      <CreateStudentModal
        isOpen={isAddingStudent}
        onClose={() => setIsAddingStudent(false)}
        onSuccess={onStudentsChange}
        schoolId={schoolId}
      />

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
                        {student.createdAt ? format(new Date(student.createdAt), "MMM d, yyyy") : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.location.href = `mailto:${student.email}`}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
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
