'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssignmentDialog } from './AssignmentDialog';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  className: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  attachments?: {
    id: string;
    fileName: string;
    url: string;
  }[];
  questions: {
    id: string;
    question: string;
    options: string;
  }[];
  submission?: {
    content: string;
    files: string[];
    submittedAt: string;
    feedback?: string;
    answers?: { [key: string]: number };
  };
}

export function AssignmentsTab() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchAssignments = useCallback(async () => {
    try {
      const response = await fetch('/api/student/assignments');
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive"
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{assignment.title}</CardTitle>
              <Badge variant={assignment.status === 'pending' ? 'destructive' : 'default'}>
                {assignment.status === 'pending' ? 'Not Submitted' : 
                 assignment.status === 'submitted' ? 'Submitted' : 
                 `Graded: ${assignment.grade}%`}
              </Badge>
            </div>
            <CardDescription>
              Due {format(new Date(assignment.dueDate), 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {assignment.description}
            </p>
            <Button 
              onClick={() => {
                setSelectedAssignment(assignment);
                setIsDialogOpen(true);
              }}
              variant="outline"
              className="w-full"
            >
              {assignment.status === 'pending' ? 'Submit Assignment' : 'View Submission'}
            </Button>
          </CardContent>
        </Card>
      ))}

      {selectedAssignment && (
        <AssignmentDialog
          assignment={selectedAssignment}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedAssignment(null);
            fetchAssignments();
          }}
        />
      )}
    </div>
  );
}
