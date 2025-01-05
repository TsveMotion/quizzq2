'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Users, BookOpen, Calendar } from "lucide-react";
import { format } from 'date-fns';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  createdAt: string;
  submissionCount: number;
}

interface ClassDetails {
  id: string;
  name: string;
  createdAt: string;
  students: Student[];
  assignments: Assignment[];
  school: {
    name: string;
  };
}

interface ViewClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
}

export function ViewClassDetailsModal({
  isOpen,
  onClose,
  classId,
}: ViewClassDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!classId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/teachers/classes/${classId}/details`);
        if (!response.ok) throw new Error('Failed to fetch class details');
        const data = await response.json();
        setClassDetails(data);
      } catch (error) {
        console.error('Error fetching class details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchClassDetails();
    }
  }, [isOpen, classId]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{classDetails?.name || 'Class Details'}</DialogTitle>
          <DialogDescription>
            {classDetails?.school.name} • Created {classDetails?.createdAt ? format(new Date(classDetails.createdAt), 'MMM d, yyyy') : ''}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
            <TabsList>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Students ({classDetails?.students.length || 0})
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Assignments ({classDetails?.assignments.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {classDetails?.students.map((student) => (
                    <Card key={student.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {classDetails?.students.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No students enrolled in this class yet.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="assignments" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {classDetails?.assignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                {assignment.submissionCount} submissions
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {classDetails?.assignments.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No assignments created for this class yet.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
