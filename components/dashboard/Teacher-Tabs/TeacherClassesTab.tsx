'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Class {
  id: string;
  name: string;
  school: {
    name: string;
  };
  _count: {
    students: number;
    assignments: number;
  };
}

export default function TeacherClassesTab() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/teachers/classes');
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchClasses();
    }
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle><Skeleton className="h-4 w-[200px]" /></CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[150px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((cls) => (
        <Card key={cls.id}>
          <CardHeader>
            <CardTitle>{cls.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">School: {cls.school.name}</p>
            <p className="text-sm text-muted-foreground mb-2">Students: {cls._count.students}</p>
            <p className="text-sm text-muted-foreground">Assignments: {cls._count.assignments}</p>
          </CardContent>
        </Card>
      ))}
      {classes.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground">
          No classes assigned yet.
        </div>
      )}
    </div>
  );
}
