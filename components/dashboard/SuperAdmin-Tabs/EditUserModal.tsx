'use client';

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId: string | null;
  school?: { name: string } | null;
  status: string;
}

interface School {
  id: string;
  name: string;
}

interface EditUserModalProps {
  user: User | null;
  schools: School[];
  onClose: () => void;
  onSuccess: () => void;
}

const roleOptions = [
  { value: 'SUPERADMIN', label: 'Super Admin' },
  { value: 'SCHOOLADMIN', label: 'School Admin' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'PRO', label: 'Pro User' },
  { value: 'FREE', label: 'Free User' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

const defaultFormData = {
  name: '',
  email: '',
  role: 'STUDENT',
  schoolId: null,
  status: 'ACTIVE',
};

export function EditUserModal({
  user,
  schools,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: string;
    schoolId: string | null;
    status: string;
  }>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'STUDENT',
    schoolId: user?.schoolId || null,
    status: user?.status || 'ACTIVE',
  });
  const [isOpen, setIsOpen] = useState(!!user);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId || null,
        status: user.status
      });
      setIsOpen(true);
    } else {
      setFormData(defaultFormData);
      setIsOpen(false);
    }
  }, [user]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          ...formData,
          schoolId: formData.schoolId === "none" ? null : formData.schoolId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      toast.success('User updated successfully');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0f2850] border border-blue-800/40 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-blue-50">Edit User</DialogTitle>
          <DialogDescription className="text-blue-200">
            Make changes to the user account here. Click save when you're done.
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
              value={formData.schoolId || "none"}
              onValueChange={(value) => setFormData({ ...formData, schoolId: value === "none" ? null : value })}
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

          <div className="space-y-2">
            <Label htmlFor="status" className="text-blue-200">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="rounded-xl bg-[#0f2850] border-blue-800/40 text-blue-100">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f2850] border border-blue-800/40 rounded-xl">
                {statusOptions.map((status) => (
                  <SelectItem 
                    key={status.value} 
                    value={status.value}
                    className="text-blue-200 focus:bg-blue-900/60 focus:text-blue-50"
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
