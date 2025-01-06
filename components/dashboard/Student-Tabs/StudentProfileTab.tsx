'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Mail, User, Phone, School, BookOpen } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  phoneNumber: string | null;
  grade: string | null;
  subjects: string[] | null;
}

export default function StudentProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      if (!session?.user?.id) return;
      const response = await fetch(`/api/student/${session.user.id}/profile`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, setProfileData, setIsLoading, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    if (!profileData) return;

    try {
      const response = await fetch('/api/students/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
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

  if (!profileData) {
    return (
      <Card className="p-4">
        <div className="text-center">Failed to load profile data</div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profileData.avatar || ''} />
              <AvatarFallback>{profileData.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">{profileData.name}</h3>
              <div className="text-sm text-muted-foreground">{profileData.email}</div>
            </div>
          </div>
          <Button
            variant={isEditing ? 'default' : 'secondary'}
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-4">Personal Information</h4>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                ) : (
                  <span className="text-sm">{profileData.name}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={profileData.phoneNumber || ''}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phoneNumber: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                ) : (
                  <span className="text-sm">
                    {profileData.phoneNumber || 'No phone number specified'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={profileData.grade || ''}
                    onChange={(e) =>
                      setProfileData({ ...profileData, grade: e.target.value })
                    }
                    placeholder="Enter grade level"
                  />
                ) : (
                  <span className="text-sm">
                    {profileData.grade || 'No grade specified'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={profileData.subjects?.join(', ') || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        subjects: e.target.value.split(', ').filter(Boolean),
                      })
                    }
                    placeholder="Enter subjects (comma-separated)"
                  />
                ) : (
                  <span className="text-sm">
                    {profileData.subjects?.join(', ') || 'No subjects specified'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Biography</h4>
            {isEditing ? (
              <Textarea
                value={profileData.bio || ''}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-sm">{profileData.bio || 'No biography specified'}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
