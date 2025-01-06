'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, BookOpen, Calendar, Clock, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Class {
  id: string;
  name: string;
  description: string;
  teacherName: string;
  schedule: string;
  subject?: string;
  nextAssignment?: {
    title: string;
    dueDate: string;
  };
}

export default function StudentClassesTab() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchClasses = useCallback(async () => {
    try {
      if (!session?.user?.id) return;
      const response = await fetch(`/api/student/${session.user.id}/classes`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const filteredClasses = classes.filter(cls => {
    if (filter === 'all') return true;
    return cls.subject?.toLowerCase() === filter;
  });

  const subjects = Array.from(new Set(classes.map(cls => cls.subject).filter(Boolean)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">My Classes</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject.toLowerCase()}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Class cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredClasses.map((cls) => (
          <Card key={cls.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {cls.subject || 'No Subject'}
                </Badge>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-base mb-0">{cls.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{cls.teacherName}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{cls.schedule}</span>
                </div>
                {cls.nextAssignment && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">Next: {cls.nextAssignment.title}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredClasses.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Classes Found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all' 
                ? "You're not enrolled in any classes yet."
                : "No classes found for the selected subject."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
