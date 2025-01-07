'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusCircle, MoreHorizontal, Search, School as SchoolIcon, Trash2, Edit } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { SchoolModal } from './SchoolModal';
import { format } from 'date-fns';
import { toast } from "sonner";

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

type SortKey = keyof Pick<School, 'name' | 'createdAt'>;

interface SuperAdminSchoolsTabProps {
  schools: School[];
  onAddSchool: () => void;
  onEditSchool: (school: School) => void;
  onSaveSchool: (school: School) => Promise<void>;
  selectedSchool: School | null;
  isSchoolModalOpen: boolean;
  setIsSchoolModalOpen: (open: boolean) => void;
  isLoading?: boolean;
  onSchoolsChange: (schools: School[]) => void;
}

function SuperAdminSchoolsTab({
  schools,
  onAddSchool,
  onEditSchool,
  onSaveSchool,
  selectedSchool,
  isSchoolModalOpen,
  setIsSchoolModalOpen,
  isLoading = false,
  onSchoolsChange,
}: SuperAdminSchoolsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter schools based on search term
  const filteredSchools = Array.isArray(schools) ? schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Sort schools based on current sort config
  const sortedSchools = [...filteredSchools].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (!aValue || !bValue) return 0;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortConfig.direction === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDeleteClick = (school: School) => {
    setSchoolToDelete(school);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!schoolToDelete) return;

    try {
      const response = await fetch(`/api/schools?id=${schoolToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to delete school');
      }

      // Get updated schools list
      const updatedSchoolsResponse = await fetch('/api/schools');
      const updatedSchools = await updatedSchoolsResponse.json();
      onSchoolsChange(updatedSchools);
      
      toast.success('School deleted successfully');
    } catch (error) {
      console.error('Error deleting school:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete school');
    } finally {
      setIsDeleteDialogOpen(false);
      setSchoolToDelete(null);
    }
  };

  // Statistics cards
  const stats = {
    totalSchools: Array.isArray(schools) ? schools.length : 0,
    totalStudents: Array.isArray(schools) ? schools.reduce((acc, school) => acc + (school.studentCount || 0), 0) : 0,
    totalTeachers: Array.isArray(schools) ? schools.reduce((acc, school) => acc + (school.teacherCount || 0), 0) : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Schools</h2>
          <p className="text-muted-foreground">
            Manage and monitor all schools in the system
          </p>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <SchoolIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <SchoolIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <SchoolIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and add school */}
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={onAddSchool} className="ml-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add School
        </Button>
      </div>

      {/* Schools table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                School Name
                {sortConfig.key === 'name' && (
                  <span className="ml-2">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Teachers</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm ? (
                    <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                      <Search className="h-8 w-8 mb-2" />
                      <p>No schools found matching "{searchTerm}"</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                      <SchoolIcon className="h-8 w-8 mb-2" />
                      <p>No schools added yet</p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              sortedSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.description || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {school.studentCount || 0} students
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {school.teacherCount || 0} teachers
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {school.createdAt ? format(new Date(school.createdAt), 'PP') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditSchool(school)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(school)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the school &quot;{schoolToDelete?.name}&quot; and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* School Modal */}
      {isSchoolModalOpen && (
        <SchoolModal
          isOpen={isSchoolModalOpen}
          setIsOpen={setIsSchoolModalOpen}
          selectedSchool={selectedSchool}
          onSaveSchool={onSaveSchool}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export { SuperAdminSchoolsTab as SchoolsTab };
export default SuperAdminSchoolsTab;
