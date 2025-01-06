'use client';

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Users, FileText, Wand2, Loader2, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AssignmentDetailsModal } from "./AssignmentDetailsModal";
import { CreateAssignmentDialog } from "./CreateAssignmentDialog";
import { toast } from "@/components/ui/use-toast";

interface Assignment {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  class: {
    id: string;
    name: string;
  };
  _count: {
    submissions: number;
  };
}

export default function TeacherAssignmentsTab() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment({
      id: assignment.id,
      title: assignment.title,
      content: assignment.content,
      dueDate: assignment.dueDate,
      class: { 
        id: assignment.class.id,
        name: assignment.class.name 
      },
      _count: assignment._count
    });
    setIsDetailsOpen(true);
  };

  const handleOpenCreateDialog = () => {
    setIsCreateOpen(true);
  };

  const handleAssignmentCreated = (newAssignment: Assignment) => {
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/teachers/assignments');
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
        <Button onClick={handleOpenCreateDialog}>Create Assignment</Button>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>{assignment.title}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {assignment.class.name}
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {assignment._count?.submissions ?? 0} {assignment._count?.submissions === 1 ? 'submission' : 'submissions'}
                  </span>
                </div>
                {assignment.content && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">
                      {JSON.parse(assignment.content).questions?.length ?? 0} questions
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <Button
              variant="ghost"
              className="absolute inset-0 w-full h-full opacity-0"
              onClick={() => handleViewAssignment(assignment)}
            >
              View Details
            </Button>
          </Card>
        ))}
      </div>

      {selectedAssignment && (
        <AssignmentDetailsModal
          assignment={selectedAssignment}
          open={isDetailsOpen}
          onOpenChange={(open) => {
            setIsDetailsOpen(open);
            if (!open) setSelectedAssignment(null);
          }}
        />
      )}

      <CreateAssignmentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onAssignmentCreated={handleAssignmentCreated}
      />
    </div>
  );
}
