'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, 
  Users, 
  BookOpen, 
  Calendar,
  GraduationCap,
  LineChart,
  Settings,
  Mail,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format } from 'date-fns';
import { AssignmentDetailsDialog } from './AssignmentDetailsDialog';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  name: string;
  email: string;
  submission?: {
    id: string;
    createdAt: string;
    status: string;
    grade?: number;
  };
  submissionRate?: number;
  averageGrade?: number;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'upcoming' | 'active' | 'past';
  submissionCount: number;
  _count: {
    submissions: number;
  };
}

interface ClassDetails {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  students: Student[];
  assignments: Assignment[];
  school: {
    name: string;
  };
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
  const [isAssignmentDetailsOpen, setIsAssignmentDetailsOpen] = useState(false);

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
  }, [isOpen, classId]);

  const getAssignmentStatusBadge = (assignment: Assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isUpcoming = dueDate > now;
    const isPast = dueDate < now;

    if (isUpcoming) {
      return <Badge variant="outline" className="bg-blue-50">Upcoming</Badge>;
    } else if (isPast) {
      return <Badge variant="outline" className="bg-gray-50">Past</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50">Active</Badge>;
    }
  };

  const handleViewAssignment = async (assignment: Assignment) => {
    try {
      // Fetch full assignment details
      const response = await fetch(`/api/teachers/assignments/${assignment.id}`);
      if (!response.ok) throw new Error('Failed to fetch assignment details');
      const data = await response.json();
      setSelectedAssignment(data);
      setIsAssignmentDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching assignment details:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{classDetails?.name || 'Class Details'}</DialogTitle>
            <DialogDescription>
              {classDetails?.school.name} • Created {classDetails?.createdAt ? format(new Date(classDetails.createdAt), 'MMM d, yyyy') : ''}
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
              <TabsList className="grid grid-cols-5 gap-4 h-auto p-2">
                <TabsTrigger value="overview" className="flex items-center gap-2 py-2">
                  <LineChart className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="students" className="flex items-center gap-2 py-2">
                  <GraduationCap className="h-4 w-4" />
                  Students
                </TabsTrigger>
                <TabsTrigger value="assignments" className="flex items-center gap-2 py-2">
                  <BookOpen className="h-4 w-4" />
                  Assignments
                </TabsTrigger>
                <TabsTrigger value="communication" className="flex items-center gap-2 py-2">
                  <Mail className="h-4 w-4" />
                  Communication
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 py-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="flex-1 overflow-hidden mt-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Class Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Average Grade</span>
                              <span className="font-medium">{classDetails?.stats?.averageGrade || 0}%</span>
                            </div>
                            <Progress 
                              value={classDetails?.stats?.averageGrade || 0} 
                              className="bg-muted h-2"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Submission Rate</span>
                              <span className="font-medium">{classDetails?.stats?.submissionRate || 0}%</span>
                            </div>
                            <Progress 
                              value={classDetails?.stats?.submissionRate || 0} 
                              className="bg-muted h-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Assignment Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">Upcoming</span>
                            </div>
                            <Badge variant="outline" className="bg-blue-50">
                              {classDetails?.stats?.upcomingAssignments || 0}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Active</span>
                            </div>
                            <Badge variant="outline" className="bg-green-50">
                              {classDetails?.stats?.activeAssignments || 0}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {classDetails?.assignments.slice(0, 3).map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div>
                              <p className="font-medium">{assignment.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                                </p>
                              </div>
                            </div>
                            {getAssignmentStatusBadge(assignment)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="students" className="flex-1 overflow-hidden mt-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {classDetails?.students.map((student) => (
                      <Card key={student.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{student.name || student.email}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Submission Rate</p>
                              <p className="font-medium">{student.submissionRate || 0}%</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Average Grade</p>
                              <p className="font-medium">{student.averageGrade || 0}%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="assignments" className="flex-1 overflow-hidden mt-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {classDetails?.assignments.map((assignment) => (
                      <Card key={assignment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{assignment.title}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    {assignment.submissionCount} submissions
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getAssignmentStatusBadge(assignment)}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewAssignment(assignment)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="communication" className="flex-1 overflow-hidden mt-4">
                <ScrollArea className="h-[500px] pr-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Class Communication</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Communication features coming soon...</p>
                        <div className="flex gap-2">
                          <Button variant="outline" disabled>Send Announcement</Button>
                          <Button variant="outline" disabled>Message Students</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="settings" className="flex-1 overflow-hidden mt-4">
                <ScrollArea className="h-[500px] pr-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Class Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Class settings and configuration options coming soon...</p>
                        <div className="flex gap-2">
                          <Button variant="outline" disabled>Edit Class Details</Button>
                          <Button variant="outline" disabled>Manage Access</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {selectedAssignment && (
        <AssignmentDetailsDialog
          assignment={selectedAssignment}
          isOpen={isAssignmentDetailsOpen}
          onClose={() => {
            setIsAssignmentDetailsOpen(false);
            setSelectedAssignment(null);
          }}
        />
      )}
    </>
  );
}
