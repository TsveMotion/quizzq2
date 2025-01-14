'use client';

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User2, Mail, BookOpen, Crown } from "lucide-react";

export function ProfileTab() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

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
                disabled={!isEditing}
                className="bg-[#2a2b2e]/50 border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="bg-[#2a2b2e]/50 border-white/10"
              />
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
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
                {session?.user?.role === 'pro' ? 'Pro' : 'Free'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#2a2b2e]/50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <span>Questions Created</span>
              </div>
              <span>0</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#2a2b2e]/50">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-400" />
                <span>Email Verified</span>
              </div>
              <span>{session?.user?.email ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
