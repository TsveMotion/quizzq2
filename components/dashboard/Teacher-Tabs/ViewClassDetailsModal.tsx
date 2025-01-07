'use client';

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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Users, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { AssignmentDetailsModal } from "./AssignmentDetailsModal";

interface Assignment {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  class?: {
    id: string;
    name: string;
  };
  _count?: {
    submissions: number;
  };
}

interface ClassDetails {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  students: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  assignments: Assignment[];
  stats: {
    averageGrade: number;
    submissionRate: number;
    activeAssignments: number;
    upcomingAssignments: number;
  };
}

interface ViewClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
}

export function ViewClassDetailsModal({
  isOpen,
  onClose,
  classId,
}: ViewClassDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!classId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/teachers/classes/${classId}/details`);
        if (!response.ok) throw new Error('Failed to fetch class details');
        const data = await response.json();
        setClassDetails(data);
      } catch (error) {
        console.error('Error fetching class details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchClassDetails();
    }
  }, [classId, isOpen]);

  const handleViewAssignment = (assignment: Assignment) => {
    // Make sure we're passing all required fields
    setSelectedAssignment({
      id: assignment.id,
      title: assignment.title,
      content: assignment.content,
      dueDate: assignment.dueDate,
      class: classDetails ? {
        id: classDetails.id,
        name: classDetails.name
      } : undefined,
      _count: assignment._count
    });
    setIsDetailsOpen(true);
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!classDetails) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center justify-between">
              <span>{classDetails.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-normal">
                  {classDetails.students.length} Students
                </Badge>
                <Badge variant="outline" className="font-normal">
                  Created {format(new Date(classDetails.createdAt), 'MMM d, yyyy')}
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Class Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Average Grade</dt>
                        <dd className="font-medium">
                          {classDetails?.stats?.averageGrade ? `${classDetails.stats.averageGrade.toFixed(1)}%` : 'N/A'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Submission Rate</dt>
                        <dd className="font-medium">
                          {classDetails?.stats?.submissionRate ? `${(classDetails.stats.submissionRate * 100).toFixed(1)}%` : 'N/A'}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Assignment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Active Assignments</dt>
                        <dd className="font-medium">{classDetails?.stats?.activeAssignments ?? 0}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Upcoming Assignments</dt>
                        <dd className="font-medium">{classDetails?.stats?.upcomingAssignments ?? 0}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              {classDetails.description && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {classDetails.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
              {classDetails.assignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No assignments created yet
                </div>
              ) : (
                <div className="space-y-4">
                  {classDetails.assignments.map((assignment) => {
                    const dueDate = new Date(assignment.dueDate);
                    const isUpcoming = dueDate > new Date();
                    const isOverdue = dueDate < new Date();
                    const submissionCount = assignment._count?.submissions ?? 0;

                    return (
                      <Card key={assignment.id} className="relative group">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              <span>{assignment.title}</span>
                              <Badge variant={isOverdue ? "destructive" : isUpcoming ? "default" : "secondary"}>
                                {isOverdue ? "Overdue" : isUpcoming ? "Upcoming" : "Completed"}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleViewAssignment(assignment)}
                            >
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Due {format(dueDate, 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{submissionCount} {submissionCount === 1 ? 'submission' : 'submissions'}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="grid gap-4">
                {classDetails.students.map((student) => (
                  <Card key={student.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{student.name}</span>
                        <span className="text-sm text-muted-foreground">{student.email}</span>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {selectedAssignment && (
        <AssignmentDetailsModal
          assignment={{
            ...selectedAssignment,
            class: selectedAssignment.class || { name: 'No Class' }
          }}
          open={isDetailsOpen}
          onOpenChange={(open) => {
            setIsDetailsOpen(open);
            if (!open) setSelectedAssignment(null);
          }}
        />
      )}
    </>
  );
}
