'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  Users, 
  GraduationCap, 
  Calendar, 
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

interface ClassDetails {
  id: string;
  name: string;
  description: string;
  teacherName: string;
  teacherEmail: string;
  schedule: string;
  subject: string;
  assignments: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'completed' | 'pending' | 'overdue';
  }[];
  students: {
    id: string;
    name: string;
    email: string;
  }[];
  announcements?: {
    id: string;
    title: string;
    content: string;
    date: string;
  }[];
}

interface ViewStudentClassDetailsModalProps {
  classId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewStudentClassDetailsModal({
  classId,
  open,
  onOpenChange,
}: ViewStudentClassDetailsModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchClassDetails = useCallback(async () => {
    try {
      if (!classId) return;
      const response = await fetch(`/api/classes/${classId}`);
      if (!response.ok) throw new Error('Failed to fetch class details');
      const data = await response.json();
      setClassDetails(data);
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast.error('Failed to fetch class details');
    }
  }, [classId, toast]);

  useEffect(() => {
    if (open && classId) {
      fetchClassDetails();
    }
  }, [open, classId, fetchClassDetails]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'overdue':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'overdue':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading class details...</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span>{classDetails?.name}</span>
                <Badge variant="outline">{classDetails?.subject}</Badge>
              </div>
            )}
          </DialogTitle>
          {!loading && classDetails && (
            <DialogDescription className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>{classDetails.teacherName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{classDetails.schedule}</span>
              </div>
            </DialogDescription>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : classDetails ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="classmates">Classmates</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Class Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{classDetails.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{classDetails.teacherEmail}</span>
                  </div>
                </CardContent>
              </Card>

              {classDetails.announcements && classDetails.announcements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classDetails.announcements.map((announcement) => (
                        <div key={announcement.id} className="space-y-2">
                          <h4 className="font-medium">{announcement.title}</h4>
                          <p className="text-sm text-muted-foreground">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground">
                            Posted on {format(new Date(announcement.date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="assignments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Class Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {classDetails.assignments.map((assignment) => (
                        <Card key={assignment.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">{assignment.title}</CardTitle>
                              </div>
                              <Badge className={getStatusColor(assignment.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(assignment.status)}
                                  <span className="capitalize">{assignment.status}</span>
                                </div>
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>{assignment.description}</CardDescription>
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</span>
                            </div>
                            <Button className="mt-4" variant="outline">
                              View Assignment
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="classmates" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Classmates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {classDetails.students.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Message
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Failed to Load Class Details</h3>
            <p className="text-sm text-muted-foreground">Please try again later.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
