"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, BookOpen, CheckCircle, XCircle, BarChart3, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface StudentStats {
  totalAssignments: number;
  completedAssignments: number;
  averageScore: number;
  totalQuizzes: number;
  correctAnswers: number;
  totalQuestions: number;
  averageTimePerQuestion: number;
  recentActivity: {
    type: string;
    title: string;
    score?: number;
    date: string;
  }[];
}

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export function StudentDetailsModal({
  isOpen,
  onClose,
  student,
}: StudentDetailsModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StudentStats | null>(null);

  useEffect(() => {
    const fetchStudentStats = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/students/${student.id}/stats`);
        if (!response.ok) throw new Error('Failed to fetch student statistics');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching student stats:', error);
        toast({
          title: "Error",
          description: "Failed to load student statistics",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentStats();
  }, [isOpen, student.id, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{student.name}'s Progress</DialogTitle>
          <DialogDescription>
            View detailed statistics and progress for this student.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : stats ? (
          <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 p-4">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quiz Performance</CardTitle>
                      <CardDescription>Overall quiz statistics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Accuracy</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((stats.correctAnswers / stats.totalQuestions) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(stats.correctAnswers / stats.totalQuestions) * 100} 
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            {stats.correctAnswers} correct answers
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm">
                            {stats.totalQuestions - stats.correctAnswers} incorrect answers
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            {Math.round(stats.averageTimePerQuestion)} seconds per question
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Assignment Progress</CardTitle>
                      <CardDescription>Assignment completion status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Completion Rate</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((stats.completedAssignments / stats.totalAssignments) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(stats.completedAssignments / stats.totalAssignments) * 100} 
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {stats.completedAssignments} of {stats.totalAssignments} assignments completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {stats.averageScore}% average score
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="assignments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment History</CardTitle>
                    <CardDescription>Recent assignment submissions and scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {stats.recentActivity
                          .filter(activity => activity.type === 'assignment')
                          .map((assignment, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between border-b pb-2 last:border-0"
                            >
                              <div>
                                <p className="font-medium">{assignment.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(assignment.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{assignment.score}%</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest quizzes and assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {stats.recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b pb-2 last:border-0"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                {activity.type === 'quiz' ? (
                                  <BarChart3 className="h-4 w-4 text-primary" />
                                ) : (
                                  <BookOpen className="h-4 w-4 text-primary" />
                                )}
                                <p className="font-medium">{activity.title}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                            {activity.score !== undefined && (
                              <div className="text-right">
                                <p className="font-medium">{activity.score}%</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Failed to load student statistics</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
