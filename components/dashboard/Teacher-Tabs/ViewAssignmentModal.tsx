'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Users, Calendar, Download } from "lucide-react";
import { format } from 'date-fns';

interface Student {
  id: string;
  name: string;
  email: string;
  submission?: {
    id: string;
    createdAt: string;
    status: string;
    grade?: number;
  };
}

interface AssignmentDetails {
  id: string;
  title: string;
  content: string;
  description: string;
  dueDate: string;
  class: {
    name: string;
    students: Student[];
  };
  _count: {
    submissions: number;
  };
}

interface ViewAssignmentModalProps {
  assignmentId: string;
  onClose: () => void;
}

export function ViewAssignmentModal({
  assignmentId,
  onClose,
}: ViewAssignmentModalProps) {
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      if (!assignmentId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/teachers/assignments/${assignmentId}`);
        if (!response.ok) throw new Error('Failed to fetch assignment details');
        const data = await response.json();
        setAssignment(data);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{assignment?.title || 'Assignment Details'}</DialogTitle>
          <DialogDescription>
            {assignment?.class.name} • Due {assignment?.dueDate ? format(new Date(assignment.dueDate), 'PPP') : ''}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="space-y-6 p-4">
              {/* Assignment Description */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {assignment?.description}
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Content */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Content</h3>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {assignment?.content}
                  </div>
                </CardContent>
              </Card>

              {/* Submission Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {assignment?._count.submissions} of {assignment?.class.students.length} submissions
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Due {assignment?.dueDate ? format(new Date(assignment.dueDate), 'PPP') : ''}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>

              {/* Student Submissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Student Submissions</h3>
                {assignment?.class.students.map((student) => (
                  <Card key={student.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {student.submission ? (
                          <>
                            <span className="text-sm text-muted-foreground">
                              Submitted {format(new Date(student.submission.createdAt), 'PPP')}
                            </span>
                            <Button variant="outline" size="sm">View</Button>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not submitted</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
