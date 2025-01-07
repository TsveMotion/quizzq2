'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface ClassDetails {
  id: string;
  name: string;
  subject: string;
  description: string;
  schedule: string;
  teacherName: string;
  studentCount: number;
  assignments: {
    id: string;
    title: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
    grade?: number;
  }[];
  announcements: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  }[];
}

interface ViewStudentClassDetailsModalProps {
  classId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewStudentClassDetailsModal({
  classId,
  isOpen,
  onClose
}: ViewStudentClassDetailsModalProps) {
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchClassDetails = useCallback(async () => {
    if (!classId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/student/classes/${classId}`);
      if (!response.ok) throw new Error('Failed to fetch class details');
      const data = await response.json();
      setClassDetails(data);
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch class details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [classId, toast]);

  useEffect(() => {
    if (isOpen) {
      fetchClassDetails();
    }
  }, [isOpen, fetchClassDetails]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Class Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : classDetails ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{classDetails.name}</CardTitle>
                <CardDescription>{classDetails.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm font-medium">Teacher</p>
                    <p className="text-sm text-muted-foreground">{classDetails.teacherName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Schedule</p>
                    <p className="text-sm text-muted-foreground">{classDetails.schedule}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{classDetails.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {classDetails.assignments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classDetails.assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {format(new Date(assignment.dueDate), 'PPP')}
                          </p>
                        </div>
                        <Badge variant={
                          assignment.status === 'graded' ? 'default' :
                          assignment.status === 'submitted' ? 'secondary' : 'destructive'
                        }>
                          {assignment.status === 'graded' ? `Graded: ${assignment.grade}%` :
                           assignment.status === 'submitted' ? 'Submitted' : 'Not Submitted'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {classDetails.announcements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classDetails.announcements.map((announcement) => (
                      <div key={announcement.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{announcement.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(announcement.createdAt), 'PPP')}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {announcement.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">Failed to load class details</p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
