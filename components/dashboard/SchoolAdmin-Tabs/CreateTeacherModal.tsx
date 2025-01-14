'use client';

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface CreateTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  schoolId: string;
}

export function CreateTeacherModal({
  isOpen,
  onClose,
  onSuccess,
  schoolId,
}: CreateTeacherModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/schools/${schoolId}/teachers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create teacher");
      }

      toast({
        title: "Success",
        description: "Teacher created successfully",
      });

      setName("");
      setEmail("");
      setPassword("");
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create teacher",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f1729] border-blue-800/40 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-blue-50">Add New Teacher</DialogTitle>
          <DialogDescription className="text-blue-200">
            Add a new teacher to your school. They will receive an email with their login credentials.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-blue-200">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Teacher's name"
              className="bg-[#1a2335] border-blue-800/40 text-blue-50 placeholder:text-blue-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-200">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.com"
              className="bg-[#1a2335] border-blue-800/40 text-blue-50 placeholder:text-blue-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-200">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-[#1a2335] border-blue-800/40 text-blue-50 placeholder:text-blue-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-blue-50"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Teacher"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
