'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  grade: string;
  studentId: string;
  school: string;
  joinedAt: string;
  totalAssignments: number;
  completedAssignments: number;
  averageGrade?: number;
}

export function StudentProfileTab() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const userId = session?.user?.id;
      if (!userId) return;
      
      const response = await fetch(`/api/student/${userId}/profile`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground">Profile not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              {profile.avatarUrl ? (
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              ) : (
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Student ID</p>
                <p className="text-sm text-muted-foreground">{profile.studentId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Grade</p>
                <p className="text-sm text-muted-foreground">{profile.grade}</p>
              </div>
              <div>
                <p className="text-sm font-medium">School</p>
                <p className="text-sm text-muted-foreground">{profile.school}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Joined</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="pt-4">
              <h3 className="text-lg font-medium">Progress Overview</h3>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{profile.totalAssignments}</div>
                    <p className="text-xs text-muted-foreground">Total Assignments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{profile.completedAssignments}</div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {profile.averageGrade ? `${profile.averageGrade}%` : 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">Average Grade</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
