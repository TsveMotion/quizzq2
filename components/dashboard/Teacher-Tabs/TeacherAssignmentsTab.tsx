'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface Assignment {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  className: string;
  submissionCount: number;
}

export default function TeacherAssignmentsTab() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/teachers/assignments');
        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchAssignments();
    }
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle><Skeleton className="h-4 w-[200px]" /></CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader>
            <CardTitle>{assignment.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Class: {assignment.className}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Due: {format(new Date(assignment.dueDate), 'PPP')}
            </p>
            <p className="text-sm text-muted-foreground">
              Submissions: {assignment.submissionCount}
            </p>
          </CardContent>
        </Card>
      ))}
      {assignments.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground">
          No assignments created yet.
        </div>
      )}
    </div>
  );
}
