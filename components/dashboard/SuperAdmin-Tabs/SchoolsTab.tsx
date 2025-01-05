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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Search, School as SchoolIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { SchoolModal } from './SchoolModal';

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

interface SuperAdminSchoolsTabProps {
  schools: School[];
  onAddSchool: () => void;
  onDeleteSchool: (id: string) => void;
  onEditSchool: (school: School) => void;
  onSaveSchool: (school: School) => Promise<void>;
  selectedSchool: School | null;
  isSchoolModalOpen: boolean;
  setIsSchoolModalOpen: (open: boolean) => void;
  isLoading?: boolean;
}

export function SuperAdminSchoolsTab({
  schools,
  onAddSchool,
  onDeleteSchool,
  onEditSchool,
  onSaveSchool,
  selectedSchool,
  isSchoolModalOpen,
  setIsSchoolModalOpen,
  isLoading = false,
}: SuperAdminSchoolsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof School;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  // Filter schools based on search term
  const filteredSchools = Array.isArray(schools) ? schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Sort schools based on current sort config
  const sortedSchools = [...filteredSchools].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: keyof School) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
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
        <Button onClick={onAddSchool}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add School
        </Button>
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

      {/* Search and filter section */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
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
              <TableHead>Students</TableHead>
              <TableHead>Teachers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading schools...
                </TableCell>
              </TableRow>
            ) : sortedSchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No schools found
                </TableCell>
              </TableRow>
            ) : (
              sortedSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {school.studentCount || 0} Students
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {school.teacherCount || 0} Teachers
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEditSchool(school)}>
                          Edit School
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => onDeleteSchool(school.id)}
                        >
                          Delete School
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <SchoolModal 
        isOpen={isSchoolModalOpen}
        setIsOpen={setIsSchoolModalOpen}
        selectedSchool={selectedSchool}
        onSaveSchool={onSaveSchool}
        isLoading={isLoading}
      />
    </div>
  );
}
