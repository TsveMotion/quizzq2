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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Wand2, BookOpen, Calendar, Users } from "lucide-react";
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Error creating assignment:', error);
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
                <CardTitle>{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Class: {assignment.class.name}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {assignment._count.submissions} submissions
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedAssignmentId(assignment.id)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Create AI-Generated Assignment</DialogTitle>
            <DialogDescription>
              Specify the parameters for your assignment and let AI generate it for you.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 px-1">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Algebra, Poetry, Chemistry"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearGroup">Year Group</Label>
                  <Select value={yearGroup} onValueChange={setYearGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year group" />
                    </SelectTrigger>
                    <SelectContent>
                      {[7, 8, 9, 10, 11, 12, 13].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complexity">Complexity</Label>
                  <Select value={complexity} onValueChange={setComplexity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="challenging">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerateAssignment}
                disabled={isGenerating || !subject || !category || !yearGroup}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Assignment
                  </>
                )}
              </Button>

              {generatedAssignment.title && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Generated Assignment</Label>
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">{generatedAssignment.title}</h3>
                      <div className="whitespace-pre-wrap text-sm">
                        {generatedAssignment.content}
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateAssignment}
              disabled={!generatedAssignment.title || !selectedClass || !dueDate}
            >
              Create Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedAssignmentId && (
        <ViewAssignmentModal
          isOpen={!!selectedAssignmentId}
          onClose={() => setSelectedAssignmentId(null)}
          assignmentId={selectedAssignmentId}
        />
      )}
    </div>
  );
}
