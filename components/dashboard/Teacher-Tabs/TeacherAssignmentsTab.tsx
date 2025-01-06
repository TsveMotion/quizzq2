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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Assignment {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  class?: {
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment({
      id: assignment.id,
      title: assignment.title,
      content: assignment.content,
      dueDate: assignment.dueDate,
      class: assignment.class ? { 
        id: assignment.class.id,
        name: assignment.class.name 
      } : null,
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

  const handleDeleteClick = (assignment: Assignment, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the assignment details
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;

    try {
      const response = await fetch(`/api/teachers/assignments/${assignmentToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAssignments(prev => prev.filter(a => a.id !== assignmentToDelete.id));
        toast({
          title: "Success",
          description: "Assignment deleted successfully",
        });
      } else {
        throw new Error('Failed to delete assignment');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    }
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
          <Card
            key={assignment.id}
            className={cn(
              "cursor-pointer hover:bg-accent/10 transition-colors",
              loading && "opacity-50 pointer-events-none"
            )}
            onClick={() => handleViewAssignment(assignment)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>{assignment.title}</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => handleDeleteClick(assignment, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-normal">
                  {assignment.class?.name ?? 'No Class Assigned'}
                </Badge>
                <Badge variant="outline" className="font-normal">
                  Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{assignment._count.submissions} submissions</span>
                </div>
              </div>
            </CardContent>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the assignment and all associated submissions.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
