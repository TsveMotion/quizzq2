'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Wand2, BookOpen, Calendar, Users, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { ViewAssignmentModal } from "./ViewAssignmentModal";

interface Class {
  id: string;
  name: string;
}

interface Assignment {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  classId: string;
  class: {
    name: string;
  };
  _count: {
    submissions: number;
  };
}

export default function TeacherAssignmentsTab() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [deleteAssignmentId, setDeleteAssignmentId] = useState<string | null>(null);

  // Form states
  const [selectedClass, setSelectedClass] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [complexity, setComplexity] = useState("medium");
  const [duration, setDuration] = useState("30");
  const [dueDate, setDueDate] = useState("");
  const [generatedAssignment, setGeneratedAssignment] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, assignmentsRes] = await Promise.all([
          fetch('/api/teachers/classes'),
          fetch('/api/teachers/assignments'),
        ]);

        if (!classesRes.ok || !assignmentsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [classesData, assignmentsData] = await Promise.all([
          classesRes.json(),
          assignmentsRes.json(),
        ]);

        setClasses(classesData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [session?.user?.id]);

  const handleGenerateAssignment = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/teachers/assignments/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          category,
          yearGroup,
          complexity,
          duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate assignment');
      }

      const data = await response.json();
      setGeneratedAssignment(data);
    } catch (error) {
      console.error('Error generating assignment:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      const response = await fetch('/api/teachers/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: generatedAssignment.title,
          content: generatedAssignment.content,
          classId: selectedClass,
          dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create assignment');
      }

      const newAssignment = await response.json();
      setAssignments(prev => [newAssignment, ...prev]);
      setIsCreateOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Assignment created successfully",
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAssignment = async () => {
    if (!deleteAssignmentId) return;

    try {
      const response = await fetch(`/api/teachers/assignments/${deleteAssignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete assignment');
      }

      setAssignments(prev => prev.filter(a => a.id !== deleteAssignmentId));
      setDeleteAssignmentId(null);
      
      toast({
        title: "Success",
        description: "Assignment deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedClass("");
    setSubject("");
    setCategory("");
    setYearGroup("");
    setComplexity("medium");
    setDuration("30");
    setDueDate("");
    setGeneratedAssignment({ title: "", content: "" });
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
        <Button onClick={() => setIsCreateOpen(true)}>Create Assignment</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Assignments</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{assignment.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {assignment.class.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteAssignmentId(assignment.id)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedAssignmentId(assignment.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Due: {format(new Date(assignment.dueDate), 'PPP')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Submissions: {assignment._count.submissions}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active">
          {/* Active assignments content */}
        </TabsContent>

        <TabsContent value="past">
          {/* Past assignments content */}
        </TabsContent>
      </Tabs>

      {/* Create Assignment Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        {/* ... existing create dialog content ... */}
      </Dialog>

      {/* View Assignment Modal */}
      {selectedAssignmentId && (
        <ViewAssignmentModal
          assignmentId={selectedAssignmentId}
          onClose={() => setSelectedAssignmentId(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteAssignmentId} onOpenChange={() => setDeleteAssignmentId(null)}>
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
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteAssignment}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
