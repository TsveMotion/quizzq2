'use client';

import { useSession, signOut } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { User2, Mail, BookOpen, Crown } from "lucide-react";
import { Role } from '@prisma/client';
import { useToast } from "@/components/ui/use-toast";

export function ProfileTab() {
  const { data: session, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Update form data when session changes
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // If email was changed, sign out to force re-authentication
      if (formData.email !== session?.user?.email) {
        toast({
          title: "Success",
          description: "Profile updated successfully. Please sign in again with your new email.",
        });
        await signOut({ redirect: true, callbackUrl: '/signin' });
        return;
      }

      // Update local session
      await updateSession();

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to current session data
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Profile Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card className="p-6 bg-[#1a1b1e]/50 border-white/10 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User2 className="h-5 w-5" />
            Profile Information
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing || isLoading}
                className="bg-[#2a2b2e]/50 border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing || isLoading}
                className="bg-[#2a2b2e]/50 border-white/10"
              />
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Edit Profile
              </Button>
            )}
          </form>
        </Card>

        {/* Account Status */}
        <Card className="p-6 bg-[#1a1b1e]/50 border-white/10 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Account Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#2a2b2e]/50">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-400" />
                <span>Subscription</span>
              </div>
              <span className="text-purple-400 font-medium">
                {session.user.role === Role.PROUSER ? 'Pro' : 'Free'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#2a2b2e]/50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <span>Member Since</span>
              </div>
              <span className="text-blue-400 font-medium">
                {new Date(session.user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
