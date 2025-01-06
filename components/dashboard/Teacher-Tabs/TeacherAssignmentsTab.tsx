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
import { AssignmentDetailsDialog } from './AssignmentDetailsDialog';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

interface MultipleChoiceQuestion {
  type: 'multiple-choice';
  prompt: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

interface MatchUpQuestion {
  type: 'match-up';
  prompt: string;
  options: string[];
  correctAnswer: string[];
  points: number;
}

interface EssayQuestion {
  type: 'essay';
  prompt: string;
  correctAnswer: string | number;
  points: number;
}

interface ShortAnswerQuestion {
  type: 'short-answer';
  prompt: string;
  correctAnswer: string;
  points: number;
}

interface AssignmentContent {
  title: string;
  description: string;
  questions: (MultipleChoiceQuestion | MatchUpQuestion | EssayQuestion | ShortAnswerQuestion)[];
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
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [deleteAssignmentId, setDeleteAssignmentId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [generatedAssignment, setGeneratedAssignment] = useState<AssignmentContent>({
    title: "",
    description: "",
    questions: []
  });
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
          topic,
          questionTypes: selectedQuestionTypes,
          difficulty,
          numberOfQuestions,
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          max_tokens: 1000,
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
    if (!selectedClass || generatedAssignment.questions.length === 0 || !dueDate) {
      toast({
        title: "Error",
        description: "Please select a class, generate questions, and set a due date.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/teachers/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: generatedAssignment.title,
          content: JSON.stringify(generatedAssignment),
          dueDate: dueDate.toISOString(),
          classId: selectedClass,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create assignment");
      }

      toast({
        title: "Success",
        description: "Assignment created successfully!",
      });

      setIsCreateOpen(false);
      resetForm();
      await fetchAssignments();
    } catch (error) {
      console.error("[ASSIGNMENT_CREATE]", error);
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
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
    setGeneratedAssignment({
      title: "",
      description: "",
      questions: []
    });
    setSelectedQuestionTypes([]);
    setTopic("");
    setDifficulty("");
    setNumberOfQuestions(1);
    setDueDate(undefined);
  };

  const handleViewDetails = async (assignment: Assignment) => {
    try {
      // Fetch full assignment details including questions
      const response = await fetch(`/api/teachers/assignments/${assignment.id}`);
      if (!response.ok) throw new Error('Failed to fetch assignment details');
      const data = await response.json();
      setSelectedAssignment(data);
      setIsDetailsOpen(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load assignment details',
        variant: 'destructive',
      });
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
          <p className="text-sm text-muted-foreground">Manage and track your class assignments</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <BookOpen className="h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <div className="flex items-center space-x-4 py-4">
        <Select
          value={selectedClass || "all"}
          onValueChange={(value) => setSelectedClass(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="active">Active Assignments</SelectItem>
            <SelectItem value="past">Past Assignments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4 pr-4">
          {assignments
            .filter(assignment => {
              if (selectedClass && assignment.classId !== selectedClass) return false;
              if (activeTab === "active") {
                return new Date(assignment.dueDate) >= new Date();
              }
              if (activeTab === "past") {
                return new Date(assignment.dueDate) < new Date();
              }
              return true;
            })
            .map((assignment) => (
              <Card key={assignment.id} className="hover:bg-accent/5 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {assignment.title}
                        {new Date(assignment.dueDate) >= new Date() && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Class: {assignment.class.name}
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
                        onClick={() => handleViewDetails(assignment)}
                        className="gap-2"
                      >
                        <BookOpen className="h-4 w-4" />
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
                      {new Date(assignment.dueDate) < new Date() && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                          Past Due
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {assignment._count.submissions} {assignment._count.submissions === 1 ? 'submission' : 'submissions'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          {assignments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No assignments found. Create one to get started!
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create AI-Powered Assignment</DialogTitle>
            <DialogDescription>
              Let AI help you create engaging assignments for your students.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-6 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="class">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    type="datetime-local"
                    id="dueDate"
                    value={dueDate ? dueDate.toISOString().slice(0, 16) : ''}
                    onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : undefined)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., World War II, Photosynthesis, Quadratic Equations"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Question Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {['multiple-choice', 'match-up', 'essay', 'short-answer'].map((type) => (
                      <Button
                        key={type}
                        variant={selectedQuestionTypes.includes(type) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedQuestionTypes(prev =>
                            prev.includes(type)
                              ? prev.filter(t => t !== type)
                              : [...prev, type]
                          );
                        }}
                        className="capitalize"
                      >
                        {type.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                    <Input
                      id="numberOfQuestions"
                      type="number"
                      min="1"
                      max="10"
                      value={numberOfQuestions}
                      onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerateAssignment}
                  disabled={isGenerating || !topic || selectedQuestionTypes.length === 0}
                  className="w-full"
                  variant="secondary"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Assignment...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Assignment
                    </>
                  )}
                </Button>

                {generatedAssignment.questions.length > 0 && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{generatedAssignment.title}</h3>
                      <p className="text-sm text-muted-foreground">Total Points: {generatedAssignment.questions.reduce((sum, q) => sum + q.points, 0)}</p>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{generatedAssignment.description}</p>

                    <div className="space-y-4">
                      {generatedAssignment.questions.map((question, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center justify-between">
                              <span>Question {index + 1} ({question.points} points)</span>
                              <Badge>{question.type.replace('-', ' ')}</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p>{question.prompt}</p>
                              
                              {question.type === 'multiple-choice' && (
                                <div className="grid gap-2">
                                  {question.options?.map((option, i) => (
                                    <div
                                      key={i}
                                      className={cn(
                                        "p-2 rounded-lg border",
                                        option === question.correctAnswer && "border-green-500 bg-green-50"
                                      )}
                                    >
                                      {option}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {question.type === 'match-up' && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    {question.options?.map((item, i) => (
                                      <div key={i} className="p-2 rounded-lg border">
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-2">
                                    {(question.correctAnswer as string[])?.map((answer, i) => (
                                      <div key={i} className="p-2 rounded-lg border border-green-500 bg-green-50">
                                        {answer}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {question.type === 'essay' && (
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">Rubric:</p>
                                  <p className="text-sm">{question.rubric}</p>
                                </div>
                              )}

                              {question.type === 'short-answer' && (
                                <div className="p-2 rounded-lg border border-green-500 bg-green-50">
                                  <p className="text-sm">Sample Answer: {question.correctAnswer}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 mt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsCreateOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateAssignment}
              disabled={!selectedClass || generatedAssignment.questions.length === 0 || !dueDate}
            >
              Create Assignment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedAssignment && (
        <AssignmentDetailsDialog
          assignment={selectedAssignment}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedAssignment(null);
          }}
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
