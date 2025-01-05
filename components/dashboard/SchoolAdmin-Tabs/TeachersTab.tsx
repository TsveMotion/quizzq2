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
import { Plus, Search, Mail, Trash, GraduationCap, CalendarDays } from "lucide-react";
import { CreateTeacherModal } from "./CreateTeacherModal";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

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

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/teachers/${teacherId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });

      onTeachersChange();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete teacher",
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
          <h2 className="text-2xl font-bold tracking-tight">Teachers</h2>
          <p className="text-muted-foreground">
            Manage teachers and their class assignments
          </p>
        </div>
        <div className="flex items-center space-x-2">
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

      <CreateTeacherModal
        isOpen={isAddingTeacher}
        onClose={() => setIsAddingTeacher(false)}
        onSuccess={onTeachersChange}
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
                        {teacher.createdAt ? format(new Date(teacher.createdAt), "MMM d, yyyy") : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.location.href = `mailto:${teacher.email}`}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTeacher(teacher.id)}
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
