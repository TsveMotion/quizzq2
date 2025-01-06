'use client';

import { useState, useEffect } from "react";
import { Wand2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface CreateAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignmentCreated: (assignment: any) => void;
}

export function CreateAssignmentDialog({
  open,
  onOpenChange,
  onAssignmentCreated,
}: CreateAssignmentDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [numberOfQuestions, setNumberOfQuestions] = useState(3);
  const [totalMarks, setTotalMarks] = useState(100);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [generatedAssignment, setGeneratedAssignment] = useState<any>({
    title: "",
    description: "",
    questions: []
  });
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (open) {
      fetchClasses();
    }
  }, [open]);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/teachers/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive",
      });
    }
  };

  const handleGenerateAssignment = async () => {
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/teachers/assignments/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          numberOfQuestions,
          totalMarks,
          gradeLevel: "9", // Default to grade 9 for now
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate assignment');
      }

      const data = await response.json();
      
      // Add marks per question
      const marksPerQuestion = Math.floor(totalMarks / numberOfQuestions);
      const questions = data.questions.map((q: any) => ({
        ...q,
        marks: marksPerQuestion,
      }));
      
      setGeneratedAssignment({
        ...data,
        questions,
        totalMarks
      });
    } catch (error) {
      console.error('Error generating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to generate assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!selectedClass || !generatedAssignment.questions?.length || !dueDate) {
      toast({
        title: "Error",
        description: "Please select a class, generate questions, and set a due date",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', generatedAssignment.title);
      formData.append('description', generatedAssignment.description);
      formData.append('content', JSON.stringify(generatedAssignment));
      formData.append('dueDate', dueDate.toISOString());
      formData.append('classId', selectedClass);
      formData.append('questions', JSON.stringify(generatedAssignment.questions));
      formData.append('totalMarks', totalMarks.toString());

      const response = await fetch("/api/teachers/assignments", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create assignment");
      }

      const newAssignment = await response.json();
      onAssignmentCreated(newAssignment.data);
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "Assignment created successfully!",
      });
    } catch (error) {
      console.error("[ASSIGNMENT_CREATE]", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create AI-Powered Assignment</DialogTitle>
          <DialogDescription>
            Let AI help you create engaging assignments for your students.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic" className="text-right">
                Topic
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class" className="text-right">
                Class
              </Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="difficulty" className="text-right">
                Difficulty
              </Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="questions" className="text-right">
                Questions
              </Label>
              <Input
                id="questions"
                type="number"
                min={1}
                max={10}
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalMarks" className="text-right">
                Total Marks
              </Label>
              <Input
                id="totalMarks"
                type="number"
                min={10}
                max={100}
                value={totalMarks}
                onChange={(e) => setTotalMarks(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate?.toISOString().slice(0, 16) || ''}
                onChange={(e) => setDueDate(new Date(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Scrollable Questions Preview */}
          {generatedAssignment.questions.length > 0 && (
            <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg mt-4">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold sticky top-0 bg-white py-2 border-b">
                  {generatedAssignment.title}
                </h3>
                <p className="text-sm text-gray-500">{generatedAssignment.description}</p>
                
                <div className="space-y-4">
                  {generatedAssignment.questions.map((q: any, idx: number) => (
                    <div key={idx} className="border rounded p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Question {idx + 1}</p>
                        <Badge variant="secondary">
                          {q.marks} marks
                        </Badge>
                      </div>
                      <p>{q.question}</p>
                      <div className="space-y-1 pl-4">
                        {(Array.isArray(q.options) ? q.options : []).map((option: string, optIdx: number) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <Badge variant={optIdx === q.correctAnswerIndex ? "default" : "outline"}>
                              {option}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Explanation:</span> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 mt-4">
          <div className="flex justify-between w-full gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerateAssignment}
                disabled={isGenerating || !topic}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Questions"
                )}
              </Button>
              <Button
                onClick={handleCreateAssignment}
                disabled={!generatedAssignment.questions?.length || !selectedClass || !dueDate}
              >
                Create Assignment
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
