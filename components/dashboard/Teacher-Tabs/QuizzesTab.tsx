'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  class: string;
  duration: number;
  questions: number;
  averageScore: number;
  lastUsed: Date;
}

interface TeacherQuizzesTabProps {
  quizzes: Quiz[];
  onAddQuiz: (quiz: Partial<Quiz>) => void;
  onDeleteQuiz: (id: string) => void;
  onEditQuiz: (quiz: Quiz) => void;
  onSearch: (term: string) => void;
  onSubjectFilter: (subject: string | null) => void;
}

export function TeacherQuizzesTab({
  quizzes,
  onAddQuiz,
  onDeleteQuiz,
  onEditQuiz,
  onSearch,
  onSubjectFilter,
}: TeacherQuizzesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quizzes</h2>
          <p className="text-muted-foreground">
            Manage your quizzes
          </p>
        </div>
        <Button onClick={() => onAddQuiz({})}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search quizzes..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => onSubjectFilter(value === 'all' ? null : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="math">Mathematics</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="history">History</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="cursor-pointer" onClick={() => onEditQuiz(quiz)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Subject</p>
                  <p className="text-sm text-muted-foreground capitalize">{quiz.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Class</p>
                  <p className="text-sm text-muted-foreground">{quiz.class}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{quiz.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Questions</p>
                  <p className="text-sm text-muted-foreground">{quiz.questions}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Average Score</p>
                  <p className="text-sm text-muted-foreground">{quiz.averageScore}%</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteQuiz(quiz.id);
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
