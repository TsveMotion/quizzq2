'use client';

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit, MoreVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface School {
  id: string;
  name: string;
  address?: string;
  roleNumber?: string;
  users: any[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    users: number;
    classes: number;
  };
}

interface SchoolsTabProps {
  schools: School[];
  onAddSchool: (school: { name: string; address: string }) => Promise<void>;
  onDeleteSchool: (id: string) => Promise<void>;
  onEditSchool: (school: School) => void;
  onViewDetails: (school: School) => void;
}

export function SchoolsTab({ 
  schools, 
  onAddSchool, 
  onDeleteSchool, 
  onEditSchool,
  onViewDetails 
}: SchoolsTabProps) {
  return (
    <TabsContent value="schools" className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schools</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add School
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New School</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onAddSchool({
                name: formData.get('name') as string,
                address: formData.get('address') as string
              });
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">School Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" required />
                </div>
                <Button type="submit">Add School</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <Card key={school.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">{school.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onViewDetails(school)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditSchool(school)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDeleteSchool(school.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{school.address}</p>
                <div className="mt-2 flex gap-4">
                  <div>
                    <p className="text-sm font-medium">Students</p>
                    <p className="text-2xl font-bold">{school._count?.users || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Classes</p>
                    <p className="text-2xl font-bold">{school._count?.classes || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </TabsContent>
  );
}
