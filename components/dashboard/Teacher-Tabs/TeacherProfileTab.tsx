'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileData {
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  subjects: string | null;
  education: string | null;
  experience: string | null;
  phoneNumber: string | null;
  officeHours: string | null;
}

export default function TeacherProfileTab() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/teachers/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profileData) return;

    setSaving(true);
    try {
      const response = await fetch('/api/teachers/profile', {
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
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session?.user || !profileData) return null;

  const initials = session.user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Information</CardTitle>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profileData.avatar || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            {isEditing ? (
              <Input
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="max-w-[300px]"
              />
            ) : (
              <h3 className="text-2xl font-semibold">{profileData.name}</h3>
            )}
            <p className="text-sm text-muted-foreground">{profileData.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Avatar URL</Label>
            {isEditing ? (
              <Input
                value={profileData.avatar || ''}
                onChange={(e) =>
                  setProfileData({ ...profileData, avatar: e.target.value })
                }
                placeholder="Enter avatar URL"
              />
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Biography</Label>
            {isEditing ? (
              <Textarea
                value={profileData.bio || ''}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                placeholder="Tell us about yourself"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profileData.bio || 'No biography provided'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Subjects</Label>
            {isEditing ? (
              <Input
                value={profileData.subjects || ''}
                onChange={(e) =>
                  setProfileData({ ...profileData, subjects: e.target.value })
                }
                placeholder='Enter subjects (e.g., ["Math", "Physics"])'
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profileData.subjects
                  ? JSON.parse(profileData.subjects).join(', ')
                  : 'No subjects specified'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Education</Label>
            {isEditing ? (
              <Input
                value={profileData.education || ''}
                onChange={(e) =>
                  setProfileData({ ...profileData, education: e.target.value })
                }
                placeholder="Your educational background"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profileData.education || 'No education information provided'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Teaching Experience</Label>
            {isEditing ? (
              <Input
                value={profileData.experience || ''}
                onChange={(e) =>
                  setProfileData({ ...profileData, experience: e.target.value })
                }
                placeholder="Years of teaching experience"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profileData.experience || 'No experience information provided'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            {isEditing ? (
              <Input
                value={profileData.phoneNumber || ''}
                onChange={(e) =>
                  setProfileData({ ...profileData, phoneNumber: e.target.value })
                }
                placeholder="Your contact number"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profileData.phoneNumber || 'No phone number provided'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Office Hours</Label>
            {isEditing ? (
              <Input
                value={profileData.officeHours || ''}
                onChange={(e) =>
                  setProfileData({ ...profileData, officeHours: e.target.value })
                }
                placeholder='Enter office hours (e.g., ["Mon 9-11", "Wed 2-4"])'
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profileData.officeHours
                  ? JSON.parse(profileData.officeHours).join(', ')
                  : 'No office hours specified'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
