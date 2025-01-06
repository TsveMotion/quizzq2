'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  BriefcaseIcon,
  Bell,
  Settings,
  Palette,
  Globe,
} from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  subjects: string[] | null;
  education: string | null;
  experience: string | null;
  phoneNumber: string | null;
  officeHours: string[] | null;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    timezone: string;
  };
}

interface ThemeOption {
  label: string;
  value: 'light' | 'dark' | 'system';
}

const themeOptions: ThemeOption[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Chinese', value: 'zh' },
];

function TeacherProfileTab() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/teachers/profile');
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch profile');
      }
      const data = await response.json();
      setProfileData({
        ...data,
        preferences: data.preferences || {
          theme: 'system',
          emailNotifications: true,
          pushNotifications: true,
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profileData) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/teachers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setProfileData(updatedData);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-[200px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Failed to load profile data. Please try again.</p>
      </div>
    );
  }

  if (!session?.user || !profileData) return null;

  const initials = session.user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <BriefcaseIcon className="h-4 w-4" />
            Professional
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatar || ''} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <Input
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                        className="max-w-[300px]"
                      />
                      <Input
                        value={profileData.avatar || ''}
                        onChange={(e) =>
                          setProfileData({ ...profileData, avatar: e.target.value })
                        }
                        placeholder="Avatar URL"
                        className="max-w-[300px]"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold">{profileData.name}</h3>
                      <p className="text-sm text-muted-foreground">{profileData.email}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={profileData.phoneNumber || ''}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phoneNumber: e.target.value })
                        }
                        placeholder="Your contact number"
                      />
                    ) : (
                      <span className="text-sm">
                        {profileData.phoneNumber || 'No phone number provided'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Office Hours</Label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={profileData.officeHours?.join(', ') || ''}
                        onChange={(e) =>
                          setProfileData({ ...profileData, officeHours: e.target.value.split(', ') })
                        }
                        placeholder='Enter office hours (e.g., ["Mon 9-11", "Wed 2-4"])'
                      />
                    ) : (
                      <span className="text-sm">
                        {profileData.officeHours
                          ? Array.isArray(profileData.officeHours) 
                            ? profileData.officeHours.join(', ')
                            : 'No office hours specified'
                          : 'No office hours specified'}
                      </span>
                    )}
                  </div>
                </div>
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
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {profileData.bio || 'No biography provided'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Your teaching qualifications and expertise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Education</Label>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={profileData.education || ''}
                        onChange={(e) =>
                          setProfileData({ ...profileData, education: e.target.value })
                        }
                        placeholder="Your educational background"
                      />
                    ) : (
                      <span className="text-sm">
                        {profileData.education || 'No education information provided'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Teaching Experience</Label>
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={profileData.experience || ''}
                        onChange={(e) =>
                          setProfileData({ ...profileData, experience: e.target.value })
                        }
                        placeholder="Years of teaching experience"
                      />
                    ) : (
                      <span className="text-sm">
                        {profileData.experience || 'No experience information provided'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={profileData.subjects?.join(', ') || ''}
                      onChange={(e) =>
                        setProfileData({ ...profileData, subjects: e.target.value.split(', ') })
                      }
                      placeholder='Enter subjects (e.g., ["Math", "Physics"])'
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.subjects
                        ? profileData.subjects.map((subject: string) => (
                            <Badge key={subject} variant="secondary">
                              {subject}
                            </Badge>
                          ))
                        : 'No subjects specified'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-y-2">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about assignments and student submissions
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences?.emailNotifications}
                  onCheckedChange={(checked) =>
                    setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences!,
                        emailNotifications: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between space-y-2">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences?.pushNotifications}
                  onCheckedChange={(checked) =>
                    setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences!,
                        pushNotifications: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={profileData.preferences?.theme}
                      onValueChange={(value: 'light' | 'dark' | 'system') =>
                        setProfileData({
                          ...profileData,
                          preferences: {
                            ...profileData.preferences!,
                            theme: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {themeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={profileData.preferences?.language}
                      onValueChange={(value) =>
                        setProfileData({
                          ...profileData,
                          preferences: {
                            ...profileData.preferences!,
                            language: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TeacherProfileTab;
