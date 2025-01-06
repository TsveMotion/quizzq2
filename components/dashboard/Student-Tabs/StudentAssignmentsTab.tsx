'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import { AssignmentDialog } from './AssignmentDialog';
import { useSession } from 'next-auth/react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  className: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  attachments?: string[];
  submission?: {
    content: string;
    files: string[];
    submittedAt: string;
    feedback?: string;
  };
}

export function StudentAssignmentsTab() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const { toast } = useToast();

  useEffect(() => {
    console.log('Current session:', session);
    fetchAssignments();
  }, [session]);

  const fetchAssignments = async () => {
    try {
      if (!session?.user?.id) {
        console.log('No user session found');
        return;
      }

      console.log('Fetching assignments for user:', session.user.id);
      const response = await fetch('/api/students/assignments');
      if (!response.ok) {
        console.error('Failed to fetch assignments:', response.status, response.statusText);
        const text = await response.text();
        console.error('Response text:', text);
        throw new Error('Failed to fetch assignments');
      }
      const data = await response.json();
      console.log('Assignments received:', data);
      setAssignments(data);
    } catch (error) {
      console.error('Error in fetchAssignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load assignments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: Assignment['status'], isPastDue: boolean) => {
    if (isPastDue && status === 'pending') return 'destructive';
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'submitted':
        return 'default';
      case 'graded':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Assignments Found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            You don't have any assignments yet.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assignments List */}
      <div className="grid gap-4">
        {filteredAssignments.map((assignment) => {
          const isPastDue = new Date(assignment.dueDate) < new Date();
          return (
            <Card key={assignment.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {assignment.className}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(assignment.status, isPastDue)}>
                    {isPastDue && assignment.status === 'pending'
                      ? 'Past Due'
                      : assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Due: {format(new Date(assignment.dueDate), 'PPP')}
                    </span>
                  </div>
                  {assignment.grade !== undefined && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Grade: {assignment.grade}%</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    View Details
                  </Button>
                  {assignment.status === 'pending' && !isPastDue && (
                    <Button onClick={() => setSelectedAssignment(assignment)}>
                      Submit Assignment
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Assignment Dialog */}
      {selectedAssignment && (
        <AssignmentDialog
          assignment={selectedAssignment}
          isOpen={true}
          onClose={() => {
            setSelectedAssignment(null);
            fetchAssignments(); // Refresh the list after submission
          }}
        />
      )}
    </div>
  );
}
