import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Users, FileText, BarChart3 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: string;
  points: number;
  options?: string[];
  correctAnswer?: string;
}

interface AssignmentContent {
  title: string;
  description: string;
  questions: Question[];
  totalPoints: number;
}

interface AssignmentDetailsDialogProps {
  assignment: {
    id: string;
    title: string;
    content: string;
    dueDate: string;
    class: {
      name: string;
    };
    _count?: {
      submissions: number;
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignmentDetailsDialog({
  assignment,
  open,
  onOpenChange,
}: AssignmentDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [parsedContent, setParsedContent] = useState<AssignmentContent | null>(null);

  useEffect(() => {
    if (assignment?.content) {
      try {
        const content = JSON.parse(assignment.content);
        setParsedContent(content);
      } catch (error) {
        console.error("Error parsing assignment content:", error);
        setParsedContent(null);
      }
    }
  }, [assignment]);

  if (!assignment) return null;

  const submissionCount = assignment._count?.submissions ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>{assignment.title}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {assignment.class.name}
              </Badge>
              <Badge variant="outline" className="font-normal">
                Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Assignment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {submissionCount} {submissionCount === 1 ? 'submission' : 'submissions'}
                      </span>
                    </div>
                    {parsedContent && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">
                          {parsedContent.questions.length} {parsedContent.questions.length === 1 ? 'question' : 'questions'}
                        </span>
                      </div>
                    )}
                  </div>
                  {parsedContent?.description && (
                    <div className="pt-4 border-t">
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="mt-1.5 text-sm text-muted-foreground whitespace-pre-wrap">
                        {parsedContent.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Questions</span>
                  {parsedContent && (
                    <Badge variant="secondary">
                      Total Points: {parsedContent.totalPoints}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {parsedContent?.questions?.map((question, index) => (
                  <div key={question.id || index} className="space-y-2 p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between">
                      <Label className="text-base font-medium">
                        Question {index + 1}
                      </Label>
                      <Badge variant="outline">{question.points} points</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {question.text}
                    </p>
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm">Options:</Label>
                        <ul className="list-disc list-inside space-y-1">
                          {question.options.map((option, optionIndex) => (
                            <li
                              key={optionIndex}
                              className={`text-sm ${
                                option === question.correctAnswer
                                  ? 'text-green-600 dark:text-green-400 font-medium'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {submissionCount === 0
                    ? 'No submissions yet'
                    : `${submissionCount} student${submissionCount === 1 ? ' has' : 's have'} submitted this assignment`}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Analytics coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
