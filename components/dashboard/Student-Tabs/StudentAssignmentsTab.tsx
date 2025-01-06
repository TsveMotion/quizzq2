'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Filter,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
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

export default function StudentAssignmentsTab() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded' | 'upcoming' | 'past-due'>('all');
  const { toast } = useToast();

  const fetchAssignments = useCallback(async () => {
    try {
      if (!session?.user?.id) return;
      const response = await fetch(`/api/student/${session.user.id}/assignments`);
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

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
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isPastDue = isBefore(dueDate, now);
    const isUpcoming = isAfter(dueDate, now) && isBefore(dueDate, addDays(now, 7));

    switch (filter) {
      case 'pending':
        return assignment.status === 'pending' && !isPastDue;
      case 'submitted':
        return assignment.status === 'submitted';
      case 'graded':
        return assignment.status === 'graded';
      case 'upcoming':
        return isUpcoming && assignment.status === 'pending';
      case 'past-due':
        return isPastDue && assignment.status === 'pending';
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats and filter */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold">
                {assignments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-sm font-medium">Past Due</p>
              <p className="text-2xl font-bold">
                {assignments.filter(a => 
                  a.status === 'pending' && new Date(a.dueDate) < new Date()
                ).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Submitted</p>
              <p className="text-2xl font-bold">
                {assignments.filter(a => a.status === 'submitted').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">Graded</p>
              <p className="text-2xl font-bold">
                {assignments.filter(a => a.status === 'graded').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter assignments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="upcoming">Due This Week</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="past-due">Past Due</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assignments List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map((assignment) => {
          const dueDate = new Date(assignment.dueDate);
          const isPastDue = dueDate < new Date();
          const isUpcoming = isAfter(dueDate, new Date()) && isBefore(dueDate, addDays(new Date(), 7));
          
          return (
            <Card 
              key={assignment.id} 
              className={`p-4 transition-all hover:shadow-md ${
                isPastDue && assignment.status === 'pending' ? 'border-red-200' : ''
              } ${isUpcoming ? 'border-yellow-200' : ''}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusBadgeVariant(assignment.status, isPastDue)}>
                    {isPastDue && assignment.status === 'pending'
                      ? 'Past Due'
                      : assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </Badge>
                  {assignment.grade !== undefined && (
                    <Badge variant="outline">{assignment.grade}%</Badge>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold truncate">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {assignment.className}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(dueDate, 'PPP')}</span>
                </div>

                <Button
                  className="w-full"
                  variant={isPastDue && assignment.status === 'pending' ? 'destructive' : 'default'}
                  onClick={() => setSelectedAssignment(assignment)}
                >
                  {assignment.status === 'pending' && !isPastDue 
                    ? 'Submit Assignment' 
                    : 'View Details'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <Card className="p-8">
          <div className="text-center">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Assignments Found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all' 
                ? "You don't have any assignments yet."
                : `No ${filter.replace('-', ' ')} assignments found.`}
            </p>
          </div>
        </Card>
      )}

      {selectedAssignment && (
        <AssignmentDialog
          assignment={selectedAssignment}
          isOpen={true}
          onClose={() => {
            setSelectedAssignment(null);
            fetchAssignments();
          }}
        />
      )}
    </div>
  );
}
