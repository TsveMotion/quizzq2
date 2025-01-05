'use client';

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, School as SchoolIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface School {
  id: string;
  name: string;
  description?: string;
  roleNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  studentCount?: number;
  teacherCount?: number;
}

interface SchoolModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedSchool: School | null;
  onSaveSchool: (school: School) => Promise<void>;
  isLoading?: boolean;
}

export function SchoolModal({
  isOpen,
  setIsOpen,
  selectedSchool,
  onSaveSchool,
  isLoading = false,
}: SchoolModalProps) {
  const [formData, setFormData] = useState<Partial<School>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedSchool) {
      setFormData({
        id: selectedSchool.id,
        name: selectedSchool.name,
        description: selectedSchool.description,
      });
    } else {
      setFormData({});
    }
    setErrors({});
  }, [selectedSchool]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const validationErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      validationErrors.name = 'School name is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSaveSchool({
        id: selectedSchool?.id,
        name: formData.name || '',
        description: formData.description || '',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving school:', error);
      setErrors({
        submit: 'Failed to save school. Please try again.'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SchoolIcon className="h-5 w-5" />
            {selectedSchool ? 'Edit School' : 'Add New School'}
          </DialogTitle>
          <DialogDescription>
            {selectedSchool 
              ? `Editing school ${selectedSchool.name}`
              : 'Create a new school by filling out the information below.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <SchoolIcon className="h-4 w-4" />
                School Name
              </Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter school name"
                className={cn(
                  "transition-colors",
                  errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <SchoolIcon className="h-4 w-4" />
                Description
              </Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter school description"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedSchool ? 'Save Changes' : 'Create School'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
