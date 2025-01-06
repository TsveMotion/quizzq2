'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, UserPlus, Download, AlertCircle, FileText, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  schoolId: string;
}

export function CreateStudentModal({
  isOpen,
  onClose,
  onSuccess,
  schoolId,
}: CreateStudentModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/schools/${schoolId}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || formData.email, // Use email as default password if none provided
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create student');
      }

      toast({
        title: "Success",
        description: `Student created successfully. They can login using their ${formData.password ? 'provided password' : 'email as password'}.`,
      });
      onSuccess();
      onClose();
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create student",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('schoolId', schoolId);

    try {
      const response = await fetch('/api/admin/users/bulk-import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to import students');
      }

      toast({
        title: 'Success',
        description: `Successfully imported ${data.count} students`,
      });

      onSuccess();
      onClose();
      setFile(null);
    } catch (error) {
      console.error('Error importing students:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to import students',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "text/csv") {
        setFile(file);
      } else {
        toast({
          title: "Error",
          description: "Please upload an Excel (.xlsx) or CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'File size should be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Read the first line to validate headers
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const firstLine = content.split('\n')[0].trim();
      const expectedHeaders = ['email', 'name'];
      const actualHeaders = firstLine.split(',').map(header => header.trim().toLowerCase());

      // Check required headers
      const missingHeaders = expectedHeaders.filter(header => !actualHeaders.includes(header));
      if (missingHeaders.length > 0) {
        toast({
          title: 'Invalid CSV format',
          description: `Missing required columns: ${missingHeaders.join(', ')}. Please check the documentation for the correct format.`,
          variant: 'destructive',
        });
        return;
      }

      setFile(selectedFile);
    };

    reader.readAsText(selectedFile);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Students</DialogTitle>
          <DialogDescription>
            Create students manually or import them from an Excel file.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="flex-1">
          <TabsList className="w-full justify-start border-b mb-4 bg-transparent">
            <TabsTrigger
              value="manual"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 text-base"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger
              value="import"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 text-base"
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pr-2">
            <TabsContent value="manual" className="mt-0">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john.doe@example.com"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">
                      Password (Optional - will be auto-generated if empty)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" onClick={onClose} type="button">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Student'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Upload Student List</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Drag and drop your CSV file here or click to browse
                      </p>
                    </div>
                    <Input
                      type="file"
                      className="hidden"
                      accept=".csv"
                      onChange={handleFileSelect}
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                </div>
                {file && (
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Make sure your Excel file follows the required format.{' '}
                    <Link href="/docs/user-management/bulk-import" className="font-medium underline underline-offset-4">
                      View documentation
                    </Link>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" onClick={onClose} type="button">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!file || isLoading}
                    onClick={handleBulkImport}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      'Import Students'
                    )}
                  </Button>
                </div>
              </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
