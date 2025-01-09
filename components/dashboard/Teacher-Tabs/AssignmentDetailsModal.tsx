"use client";

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
import { Calendar, Users, FileText, BarChart3, Loader2 } from "lucide-react";

interface AssignmentDetailsModalProps {
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

export function AssignmentDetailsModal({
  assignment,
  open,
  onOpenChange,
}: AssignmentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [parsedContent, setParsedContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset states when modal is opened/closed
  useEffect(() => {
    if (!open) {
      setParsedContent(null);
      setError(null);
      setLoading(true);
    }
  }, [open]);

  // Parse content when assignment changes
  useEffect(() => {
    if (!assignment?.content) {
      setLoading(false);
      setParsedContent(null);
      return;
    }

    setLoading(true);
    try {
      const content = JSON.parse(assignment.content);
      setParsedContent(content);
      setError(null);
    } catch (error) {
      console.error("Error parsing assignment content:", error);
      setError("Failed to parse assignment content");
      setParsedContent(null);
    } finally {
      setLoading(false);
    }
  }, [assignment?.content]);

  // Add debug logging
  useEffect(() => {
    if (parsedContent) {
      console.log('Parsed content:', parsedContent);
      console.log('Questions:', parsedContent.questions);
    }
  }, [parsedContent]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Error</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mt-4">{error}</p>
          </div>
        ) : (
          <>
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
                  {parsedContent?.totalPoints && (
                    <Badge variant="outline" className="font-normal">
                      Total: {parsedContent.totalPoints} points
                    </Badge>
                  )}
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
                            {assignment._count?.submissions ?? 0} {assignment._count?.submissions === 1 ? 'submission' : 'submissions'}
                          </span>
                        </div>
                        {parsedContent?.questions && (
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
                {parsedContent?.questions?.length > 0 ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Questions</span>
                        {parsedContent.totalPoints && (
                          <Badge variant="secondary">
                            Total Points: {parsedContent.totalPoints}
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {parsedContent.questions.map((question: any, index: number) => (
                        <div key={index} className="space-y-2 p-4 rounded-lg border bg-card">
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
                                {question.options.map((option: string, optionIndex: number) => (
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
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No questions available
                  </div>
                )}
              </TabsContent>

              <TabsContent value="submissions" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {assignment._count?.submissions === 0
                        ? 'No submissions yet'
                        : `${assignment._count?.submissions} student${assignment._count?.submissions === 1 ? ' has' : 's have'} submitted this assignment`}
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
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center space-y-2">
                        <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Analytics will be available after students submit their work
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
