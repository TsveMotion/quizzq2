'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Users, BookOpen, Calendar } from 'lucide-react';

interface Class {
  id: string;
  name: string;
  description: string;
  teacherName: string;
  schedule: string;
}

export function StudentClassesTab() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/students/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load classes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  if (classes.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Classes Found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            You are not enrolled in any classes yet.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {classes.map((classItem) => (
        <Card key={classItem.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{classItem.name}</h3>
              <Button variant="outline">View Details</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {classItem.description}
            </p>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Teacher: {classItem.teacherName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Schedule: {classItem.schedule}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
