'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Search,
  UserPlus,
  Users,
  MoreVertical,
  Edit,
  Trash,
  AlertCircle,
  Building,
  School,
  GraduationCap,
  ShieldCheck,
  User,
  UserCog,
  X
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  powerLevel: number;
  createdAt: string;
  schoolId?: string;
}

interface School {
  id: string;
  name: string;
  roleNumber: string;
  description?: string;
  createdAt: string;
}

export default function SuperAdminDashboard({ user }: { user: any }) {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateSchoolDialog, setShowCreateSchoolDialog] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [activeView, setActiveView] = useState<'users' | 'schools' | 'school-details'>('users');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'member',
    password: '',
    schoolId: ''
  });
  const [newSchool, setNewSchool] = useState({
    name: '',
    description: ''
  });
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/admin/schools');
      if (response.ok) {
        const data = await response.json();
        setSchools(data.schools);
      }
    } catch (error) {
      console.error('Failed to fetch schools:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSchools();
  }, []);

  const getSchoolUsers = (schoolId: string) => {
    return users.filter(user => user.schoolId === schoolId);
  };

  const handleCreateUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "User created successfully",
        });

        // Close create dialog
        setShowCreateDialog(false);

        // Reset form
        setNewUser({
          name: '',
          email: '',
          role: 'member',
          password: '',
          schoolId: ''
        });

        // Refresh users
        await fetchUsers();

        // If we were creating a user for a specific school, reopen the school details dialog
        if (selectedSchool) {
          setTimeout(() => {
            setActiveView('school-details');
          }, 100);
        }
      } else {
        throw new Error(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateSchool = async () => {
    try {
      if (!newSchool.name) {
        toast({
          title: "Error",
          description: "School name is required",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch('/api/admin/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchool),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "School created successfully",
        });
        setShowCreateSchoolDialog(false);
        
        // Reset form
        setNewSchool({
          name: '',
          description: ''
        });
        
        // Refresh schools list
        await fetchSchools();
      } else {
        throw new Error(data.error || 'Failed to create school');
      }
    } catch (error) {
      console.error('Failed to create school:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create school. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateSchoolAdmin = (school: School) => {
    setSelectedSchool(school);
    setNewUser({
      name: '',
      email: '',
      role: 'schooladmin',
      password: '',
      schoolId: school.id
    });
    setShowCreateDialog(true);
  };

  const handleCreateSchoolUser = (role: string) => {
    if (!selectedSchool) return;
    
    // Reset the form
    setNewUser({
      name: '',
      email: '',
      role: role,
      password: '',
      schoolId: selectedSchool.id
    });
    
    // Close school details dialog and open create user dialog
    setActiveView('users');
    setTimeout(() => {
      setShowCreateDialog(true);
    }, 100);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        fetchUsers();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    try {
      const response = await fetch(`/api/admin/schools/${schoolId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "School deleted successfully",
        });
        fetchSchools();
      } else {
        throw new Error('Failed to delete school');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete school. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShowSchoolDetails = (school: School) => {
    setSelectedSchool(school);
    setActiveView('school-details');
  };

  const handleCreateUserDialogClose = () => {
    setShowCreateDialog(false);
    if (selectedSchool) {
      // If we were creating a user for a school, go back to school details
      setActiveView('school-details');
    } else {
      // If not, just reset everything
      setSelectedSchool(null);
      setNewUser({
        name: '',
        email: '',
        role: 'member',
        password: '',
        schoolId: ''
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.roleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Super Administrator Dashboard</h1>
        <p className="text-muted-foreground">Manage all users and schools in the system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{users.length}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Building className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Schools</p>
              <h3 className="text-2xl font-bold">{schools.length}</h3>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="schools">School Management</TabsTrigger>
          {selectedSchool && (
            <TabsTrigger value="school-details">
              {selectedSchool.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSchool(null);
                  setActiveView('schools');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">User Management</h2>
                <Dialog open={showCreateDialog} onOpenChange={handleCreateUserDialogClose}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        {selectedSchool 
                          ? `Create a new ${newUser.role} for ${selectedSchool.name}`
                          : 'Add a new user to the system. All fields are required.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label>Name</label>
                        <Input
                          placeholder="Enter full name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Email</label>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Password</label>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                      </div>
                      {!selectedSchool && (
                        <div className="space-y-2">
                          <label>Role</label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="schooladmin">School Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {selectedSchool && (
                        <div className="rounded-md bg-muted p-4">
                          <div className="flex items-center space-x-2">
                            <Building className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{selectedSchool.name}</p>
                              <p className="text-sm text-muted-foreground">Role Number: {selectedSchool.roleNumber}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={handleCreateUserDialogClose}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser}>Create User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            {schools.find(s => s.id === user.schoolId)?.name || '-'}
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete User
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
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="schools">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">School Management</h2>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowCreateSchoolDialog(true)}>
                  <Building className="w-4 h-4 mr-2" />
                  Create School
                </Button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schools..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role Number</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.map((school) => (
                      <TableRow 
                        key={school.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleShowSchoolDetails(school)}
                      >
                        <TableCell>{school.name}</TableCell>
                        <TableCell>{school.roleNumber}</TableCell>
                        <TableCell>{school.description || '-'}</TableCell>
                        <TableCell>{new Date(school.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit School
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSchool(school.id);
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete School
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="school-details">
          {selectedSchool && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedSchool.name}</h2>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="bg-primary/10 text-primary rounded-md px-3 py-1">
                        Role Number: {selectedSchool.roleNumber}
                      </div>
                      <div className="text-muted-foreground">
                        Created: {new Date(selectedSchool.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {selectedSchool.description && (
                      <p className="mt-2 text-muted-foreground">{selectedSchool.description}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCreateSchoolUser('schooladmin')}>
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Add School Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCreateSchoolUser('teacher')}>
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Add Teacher
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCreateSchoolUser('student')}>
                        <User className="w-4 h-4 mr-2" />
                        Add Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All Users</TabsTrigger>
                    <TabsTrigger value="admin">School Admins</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                  </TabsList>

                  {['all', 'admin', 'teachers', 'students'].map((tab) => (
                    <TabsContent key={tab} value={tab}>
                      <Card>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Created At</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loading ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                  Loading users...
                                </TableCell>
                              </TableRow>
                            ) : (
                              getSchoolUsers(selectedSchool.id)
                                .filter(user => {
                                  if (tab === 'all') return true;
                                  if (tab === 'admin') return user.role === 'schooladmin';
                                  if (tab === 'teachers') return user.role === 'teacher';
                                  if (tab === 'students') return user.role === 'student';
                                  return true;
                                })
                                .map((user) => (
                                  <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {user.role}
                                      </span>
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit User
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => handleDeleteUser(user.id)}
                                          >
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete User
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))
                            )}
                            {!loading && getSchoolUsers(selectedSchool.id).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                  No users found in this school
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showCreateDialog} onOpenChange={handleCreateUserDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              {selectedSchool 
                ? `Create a new ${newUser.role} for ${selectedSchool.name}`
                : 'Add a new user to the system. All fields are required.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>Name</label>
              <Input
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label>Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label>Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            {selectedSchool && (
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{selectedSchool.name}</p>
                    <p className="text-sm text-muted-foreground">Role Number: {selectedSchool.roleNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCreateUserDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateSchoolDialog} onOpenChange={setShowCreateSchoolDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New School</DialogTitle>
            <DialogDescription>
              Add a new school to the system. A unique role number will be generated automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>School Name</label>
              <Input
                placeholder="Enter school name"
                value={newSchool.name}
                onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label>Description (Optional)</label>
              <Textarea
                placeholder="Enter school description..."
                value={newSchool.description}
                onChange={(e) => setNewSchool({ ...newSchool, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateSchoolDialog(false);
                setNewSchool({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSchool}>Create School</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
