'use client';

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateClassModal } from "./CreateClassModal";
import { ManageClassModal } from "./ManageClassModal";
import { Badge } from "@/components/ui/badge";

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
  teacherId?: string;
  teacher?: Teacher;
  _count?: {
    students: number;
  };
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
  onClassCreated: () => void;
}

export function ClassesTab({
  classes = [],
  teachers = [],
  students = [],
  isLoading = false,
  searchTerm,
  setSearchTerm,
  schoolId,
  onClassCreated,
}: ClassesTabProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.teacher?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Button
          size="sm"
          className="h-8"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{classItem.name}</div>
                    {classItem.description && (
                      <div className="text-sm text-muted-foreground">
                        {classItem.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {classItem.teacher ? (
                    <div className="font-medium">{classItem.teacher.name}</div>
                  ) : (
                    <Badge variant="outline">No Teacher Assigned</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    {classItem._count?.students || 0} students
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(classItem.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedClass(classItem);
                      setIsManageModalOpen(true);
                    }}
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={onClassCreated}
        schoolId={schoolId}
        teachers={teachers}
      />

      {selectedClass && (
        <ManageClassModal
          isOpen={isManageModalOpen}
          onClose={() => {
            setIsManageModalOpen(false);
            setSelectedClass(null);
          }}
          onSuccess={onClassCreated}
          classData={selectedClass}
          teachers={teachers}
          students={students}
          schoolId={schoolId}
        />
      )}
    </div>
  );
}
