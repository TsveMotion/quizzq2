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
  const [difficulty, setDifficulty] = useState("medium");
  const [ageGroup, setAgeGroup] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
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
    if (!topic || selectedQuestionTypes.length === 0 || !ageGroup || !gradeLevel) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
          questionTypes: selectedQuestionTypes,
          difficulty,
          numberOfQuestions,
          ageGroup,
          gradeLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate assignment');
      }

      const data = await response.json();
      setGeneratedAssignment(data);
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
    if (!selectedClass || generatedAssignment.questions.length === 0 || !dueDate) {
      toast({
        title: "Error",
        description: "Please select a class, generate questions, and set a due date.",
        variant: "destructive",
      });
      return;
    }

    try {
      const assignmentContent = {
        title: generatedAssignment.title,
        description: generatedAssignment.description,
        questions: generatedAssignment.questions,
        targetLevel: gradeLevel,
        ageGroup: ageGroup,
        totalPoints: generatedAssignment.questions.reduce((acc: number, q: any) => acc + (q.points || 0), 0),
        createdAt: new Date().toISOString()
      };

      const response = await fetch("/api/teachers/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: generatedAssignment.title,
          content: JSON.stringify(assignmentContent),
          dueDate: dueDate.toISOString(),
          classId: selectedClass,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create assignment");
      }

      const newAssignment = await response.json();
      onAssignmentCreated(newAssignment);

      toast({
        title: "Success",
        description: "Assignment created successfully!",
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("[ASSIGNMENT_CREATE]", error);
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
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
    setDifficulty("medium");
    setAgeGroup("");
    setGradeLevel("");
    setNumberOfQuestions(5);
    setDueDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            Create AI-Powered Assignment
          </DialogTitle>
          <DialogDescription>
            Let AI help you create engaging assignments for your students.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-6 py-6">
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
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., World War II, Photosynthesis, Quadratic Equations"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ageGroup">Age Group</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ks3">Key Stage 3 (11-14)</SelectItem>
                    <SelectItem value="ks4">Key Stage 4 (14-16)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gradeLevel">Target Grade Level</Label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroup === 'ks3' ? (
                      <>
                        <SelectItem value="developing">Developing (1-3)</SelectItem>
                        <SelectItem value="secure">Secure (4-6)</SelectItem>
                        <SelectItem value="extending">Extending (7-9)</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="9">Grade 9</SelectItem>
                        <SelectItem value="8">Grade 8</SelectItem>
                        <SelectItem value="7">Grade 7</SelectItem>
                        <SelectItem value="6">Grade 6</SelectItem>
                        <SelectItem value="5">Grade 5</SelectItem>
                        <SelectItem value="4">Grade 4</SelectItem>
                        <SelectItem value="3">Grade 3</SelectItem>
                        <SelectItem value="2">Grade 2</SelectItem>
                        <SelectItem value="1">Grade 1</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
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
                      className={cn(
                        "capitalize",
                        selectedQuestionTypes.includes(type) && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                      )}
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

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  type="datetime-local"
                  id="dueDate"
                  value={dueDate ? dueDate.toISOString().slice(0, 16) : ''}
                  onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>

              <Button
                onClick={handleGenerateAssignment}
                disabled={isGenerating || !topic || selectedQuestionTypes.length === 0 || !ageGroup || !gradeLevel}
                className="w-full h-12 mt-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Assignment...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Assignment
                  </>
                )}
              </Button>
            </div>

            {generatedAssignment.questions.length > 0 && (
              <div className="border rounded-lg p-6 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h3 className="text-xl font-semibold">{generatedAssignment.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{generatedAssignment.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {generatedAssignment.questions.length} Questions
                    </Badge>
                    <Badge variant="secondary">
                      {generatedAssignment.questions.reduce((sum: number, q: any) => sum + q.points, 0)} Points
                    </Badge>
                  </div>
                </div>

                <div className="space-y-6">
                  {generatedAssignment.questions.map((question: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg border space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Badge>{question.points} points</Badge>
                      </div>
                      <p className="text-sm">{question.prompt}</p>
                      {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option: string, i: number) => (
                            <div
                              key={i}
                              className={cn(
                                "p-3 rounded-lg border text-sm",
                                option === question.correctAnswer && "border-green-500/50 bg-green-50/50 text-green-900"
                              )}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleCreateAssignment}
            disabled={!selectedClass || generatedAssignment.questions.length === 0 || !dueDate}
          >
            Create Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
