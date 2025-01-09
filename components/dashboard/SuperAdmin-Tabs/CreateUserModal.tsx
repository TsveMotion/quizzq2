'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface School {
  id: string;
  name: string;
  description?: string;
  roleNumber?: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  schools: School[];
}

const roleOptions = [
  { value: 'SUPERADMIN', label: 'Super Admin' },
  { value: 'SCHOOLADMIN', label: 'School Admin' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'PRO', label: 'Pro User' },
  { value: 'FREE', label: 'Free User' },
];

const defaultFormData = {
  name: '',
  email: '',
  password: '',
  role: 'STUDENT',
  schoolId: 'none',
};

export function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
  schools,
}: CreateUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          schoolId: formData.schoolId === 'none' ? null : formData.schoolId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }

      toast.success('User created successfully');
      onSuccess();
      onClose();
      setFormData(defaultFormData);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f2850] border border-blue-800/40 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-blue-50">Create New User</DialogTitle>
          <DialogDescription className="text-blue-200">
            Add a new user to the system. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-blue-200">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="rounded-xl bg-[#0f2850] border-blue-800/40 text-blue-100 placeholder:text-blue-300/50 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-200">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="rounded-xl bg-[#0f2850] border-blue-800/40 text-blue-100 placeholder:text-blue-300/50 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-200">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="rounded-xl bg-[#0f2850] border-blue-800/40 text-blue-100 placeholder:text-blue-300/50 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-blue-200">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="rounded-xl bg-[#0f2850] border-blue-800/40 text-blue-100">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f2850] border border-blue-800/40 rounded-xl">
                {roleOptions.map((role) => (
                  <SelectItem 
                    key={role.value} 
                    value={role.value}
                    className="text-blue-200 focus:bg-blue-900/60 focus:text-blue-50"
                  >
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school" className="text-blue-200">School</Label>
            <Select
              value={formData.schoolId}
              onValueChange={(value) => setFormData({ ...formData, schoolId: value })}
            >
              <SelectTrigger className="rounded-xl bg-[#0f2850] border-blue-800/40 text-blue-100">
                <SelectValue placeholder="Select school" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f2850] border border-blue-800/40 rounded-xl">
                <SelectItem 
                  value="none"
                  className="text-blue-200 focus:bg-blue-900/60 focus:text-blue-50"
                >
                  None
                </SelectItem>
                {schools.map((school) => (
                  <SelectItem 
                    key={school.id} 
                    value={school.id}
                    className="text-blue-200 focus:bg-blue-900/60 focus:text-blue-50"
                  >
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData(defaultFormData);
                onClose();
              }}
              disabled={isLoading}
              className="rounded-xl bg-blue-900/50 text-blue-200 hover:bg-blue-900/70 border-blue-800/40"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="rounded-xl bg-blue-600/90 text-blue-50 hover:bg-blue-600 shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
