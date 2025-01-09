'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isPro: boolean;
  settings: {
    language: string;
    notifications: boolean;
  } | null;
  createdAt: string;
}

export function UserProfileTab() {
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    language: 'en',
    notifications: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || '',
          language: data.settings?.language || 'en',
          notifications: data.settings?.notifications ?? true
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          settings: {
            language: formData.language,
            notifications: formData.notifications
          }
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      // Update session to reflect changes
      await updateSession();
      
      toast.success('Profile updated successfully', {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Personal Information */}
      <Card className="p-4 bg-gray-900/40 border-white/10">
        <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-400">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-0.5 h-8 bg-white/5 border-white/10 text-white text-sm"
              placeholder={profile?.email}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Email</Label>
            <div className="text-sm text-white mt-0.5">{profile?.email}</div>
          </div>
          <div>
            <Label className="text-xs text-gray-400">Account Type</Label>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-white">
                {profile?.isPro ? 'Premium' : 'Free'}
              </span>
              {profile?.isPro && <Crown className="h-4 w-4 text-yellow-500" />}
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-400">Role</Label>
            <div className="text-sm text-white mt-0.5">{profile?.role}</div>
          </div>
          <div>
            <Label className="text-xs text-gray-400">Member Since</Label>
            <div className="text-sm text-white mt-0.5">
              {new Date(profile?.createdAt || '').toLocaleDateString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Account Settings */}
      <Card className="p-4 bg-gray-900/40 border-white/10">
        <h3 className="text-lg font-semibold text-white mb-3">Account Settings</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-400" htmlFor="language">Preferred Language</Label>
            <select 
              id="language"
              className="w-full mt-0.5 h-8 rounded-md bg-white/5 border-white/10 text-white text-sm px-3"
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <Label className="text-xs text-gray-400" htmlFor="notifications">Email Notifications</Label>
            <div className="flex items-center mt-0.5">
              <input 
                type="checkbox" 
                id="notifications"
                className="rounded border-white/10 bg-white/5"
                checked={formData.notifications}
                onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
              />
              <label htmlFor="notifications" className="ml-2 text-xs text-white">
                Receive updates and important notifications
              </label>
            </div>
          </div>
          <div className="pt-2">
            <Button 
              className="h-8 text-sm bg-white/10 text-white hover:bg-white/20"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
