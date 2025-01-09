'use client';

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, User, Trash2, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditUserModal } from "./EditUserModal";
import { CreateUserModal } from "./CreateUserModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import cn from "classnames";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId: string | null;
  school: { name: string } | null;
  createdAt: Date;
  status: string;
  powerLevel?: number;
  isPro?: boolean;
}

interface School {
  id: string;
  name: string;
  description?: string;
  roleNumber?: string;
}

function UsersTab() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersRes, schoolsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/schools')
      ]);

      if (!usersRes.ok || !schoolsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [usersData, schoolsData] = await Promise.all([
        usersRes.json(),
        schoolsRes.json()
      ]);

      setUsers(usersData);
      setSchools(schoolsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load users data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.school?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      toast.success('User deleted successfully');
      fetchData(); // Refresh the user list
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      SUPERADMIN: 'bg-red-500',
      SCHOOLADMIN: 'bg-blue-500',
      TEACHER: 'bg-green-500',
      STUDENT: 'bg-yellow-500',
      PRO: 'bg-purple-500',
      FREE: 'bg-gray-400'
    };
    return colors[role] || 'bg-gray-500';
  };

  if (error) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchData} className="bg-blue-500 hover:bg-blue-600 text-white">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md rounded-xl bg-[#0f2850] border-blue-800/40 text-blue-100 placeholder:text-blue-300/50 focus-visible:ring-blue-500 focus-visible:ring-offset-0 shadow-sm"
            />
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-xl bg-blue-600/90 hover:bg-blue-600 text-blue-50 shadow-md shadow-blue-900/20 hover:shadow-lg transition-all duration-200"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="rounded-2xl border border-blue-800/40 bg-[#0f2850] shadow-lg shadow-blue-900/20">
        <ScrollArea className="h-[calc(100vh-12rem)] rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow className="border-blue-800/40 hover:bg-blue-900/30">
                <TableHead className="text-blue-200 font-medium">Name</TableHead>
                <TableHead className="text-blue-200 font-medium">Email</TableHead>
                <TableHead className="text-blue-200 font-medium">Role</TableHead>
                <TableHead className="text-blue-200 font-medium">School</TableHead>
                <TableHead className="text-blue-200 font-medium">Status</TableHead>
                <TableHead className="text-blue-200 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-400" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-blue-200">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-blue-800/40 hover:bg-blue-900/30 transition-colors">
                    <TableCell className="font-medium text-blue-100">{user.name}</TableCell>
                    <TableCell className="text-blue-200">{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "rounded-lg font-medium shadow-sm",
                          user.role === 'PRO' && "bg-purple-500/20 text-purple-200 border-purple-500/30",
                          user.role === 'SCHOOLADMIN' && "bg-blue-500/20 text-blue-200 border-blue-500/30",
                          user.role === 'STUDENT' && "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
                          user.role === 'FREE' && "bg-gray-500/20 text-gray-200 border-gray-500/30"
                        )}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-blue-200">{user.school?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "rounded-lg font-medium shadow-sm",
                          user.status === 'ACTIVE' && "bg-green-500/20 text-green-200 border-green-500/30",
                          user.status === 'INACTIVE' && "bg-red-500/20 text-red-200 border-red-500/30"
                        )}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        onClick={() => setSelectedUser(user)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 rounded-lg"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog open={isDeleteDialogOpen && userToDelete?.id === user.id}>
                        <AlertDialogTrigger asChild>
                          <Button
                            onClick={() => {
                              setUserToDelete(user);
                              setIsDeleteDialogOpen(true);
                            }}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-300 hover:text-red-200 hover:bg-red-900/30 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#0f2850] border border-blue-800/40 rounded-2xl shadow-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-blue-50">Delete User</AlertDialogTitle>
                            <AlertDialogDescription className="text-blue-200">
                              Are you sure you want to delete this user? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel 
                              className="rounded-xl bg-blue-900/50 text-blue-200 hover:bg-blue-900/70 border-blue-800/40"
                              onClick={() => setIsDeleteDialogOpen(false)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="rounded-xl bg-red-600/90 text-red-50 hover:bg-red-600 shadow-md"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          schools={schools}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => {
            setSelectedUser(null);
            fetchData();
          }}
        />
      )}

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchData();
        }}
        schools={schools}
      />
    </div>
  );
}

export { UsersTab };
export default UsersTab;
