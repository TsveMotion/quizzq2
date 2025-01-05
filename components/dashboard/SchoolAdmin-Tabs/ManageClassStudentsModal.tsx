'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, PlusCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Class {
  id: string;
  name: string;
  students?: Student[];
}

interface ManageClassStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classData: Class;
  schoolId: string;
  allStudents: Student[];
}

export function ManageClassStudentsModal({
  isOpen,
  onClose,
  onSuccess,
  classData,
  schoolId,
  allStudents,
}: ManageClassStudentsModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchClassStudents = async () => {
      try {
        const response = await fetch(`/api/admin/classes/${classData.id}/students`);
        if (!response.ok) throw new Error('Failed to fetch class students');
        const data = await response.json();
        setClassStudents(data);
        
        // Filter out students already in the class
        const studentIds = new Set(data.map((s: Student) => s.id));
        setAvailableStudents(allStudents.filter(s => !studentIds.has(s.id)));
      } catch (error) {
        console.error('Error fetching class students:', error);
        toast({
          title: "Error",
          description: "Failed to load class students",
          variant: "destructive",
        });
      }
    };

    if (isOpen) {
      fetchClassStudents();
    }
  }, [isOpen, classData.id, schoolId, allStudents, toast]);

  const handleAddStudent = async (student: Student) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/classes/${classData.id}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: student.id }),
      });

      if (!response.ok) throw new Error('Failed to add student to class');

      setClassStudents([...classStudents, student]);
      setAvailableStudents(availableStudents.filter(s => s.id !== student.id));
      onSuccess();
      
      toast({
        title: "Success",
        description: "Student added to class successfully",
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: "Failed to add student to class",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStudent = async (student: Student) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/classes/${classData.id}/students`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: student.id }),
      });

      if (!response.ok) throw new Error('Failed to remove student from class');

      setClassStudents(classStudents.filter(s => s.id !== student.id));
      setAvailableStudents([...availableStudents, student]);
      onSuccess();
      
      toast({
        title: "Success",
        description: "Student removed from class successfully",
      });
    } catch (error) {
      console.error('Error removing student:', error);
      toast({
        title: "Error",
        description: "Failed to remove student from class",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAvailableStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Students in {classData.name}</DialogTitle>
          <DialogDescription>
            Add or remove students from this class.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <h3 className="font-medium">Current Students</h3>
              <p className="text-sm text-muted-foreground">
                {classStudents.length} students enrolled
              </p>
            </div>
            <div className="relative w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Current Students */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Enrolled Students</h4>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {classStudents.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No students enrolled yet
                    </div>
                  ) : (
                    classStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-2 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStudent(student)}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Available Students */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Available Students</h4>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredAvailableStudents.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      {searchTerm ? 'No matching students found' : 'No available students'}
                    </div>
                  ) : (
                    filteredAvailableStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-2 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAddStudent(student)}
                          disabled={isLoading}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
