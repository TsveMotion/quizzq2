'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface Class {
  id: string;
  name: string;
  grade: string;
  students: number;
  averageScore: number;
  lastQuizDate: Date;
}

interface TeacherClassesTabProps {
  classes: Class[];
  onAddClass: (classData: Partial<Class>) => void;
  onDeleteClass: (id: string) => void;
  onEditClass: (classData: Class) => void;
  onSearch: (term: string) => void;
}

export function TeacherClassesTab({
  classes,
  onAddClass,
  onDeleteClass,
  onEditClass,
  onSearch,
}: TeacherClassesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Classes</h2>
          <p className="text-muted-foreground">
            Manage your classes
          </p>
        </div>
        <Button onClick={() => onAddClass({})}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search classes..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="cursor-pointer" onClick={() => onEditClass(classItem)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{classItem.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Grade</p>
                  <p className="text-sm text-muted-foreground">{classItem.grade}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Students</p>
                  <p className="text-sm text-muted-foreground">{classItem.students}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Average Score</p>
                  <p className="text-sm text-muted-foreground">{classItem.averageScore}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Quiz</p>
                  <p className="text-sm text-muted-foreground">
                    {classItem.lastQuizDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClass(classItem.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
