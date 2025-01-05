'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubjectProgress {
  subject: string;
  score: number;
  quizzesTaken: number;
  improvement: number;
  lastQuizDate: Date;
}

interface StudentProgressTabProps {
  progress: SubjectProgress[];
  onSubjectFilter: (subject: string | null) => void;
}

export function StudentProgressTab({
  progress,
  onSubjectFilter,
}: StudentProgressTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Progress</h2>
          <p className="text-muted-foreground">
            Track your academic progress
          </p>
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
        {progress.map((item) => (
          <Card key={item.subject}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium capitalize">{item.subject}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Average Score</p>
                  <p className="text-sm text-muted-foreground">{item.score}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Quizzes Taken</p>
                  <p className="text-sm text-muted-foreground">{item.quizzesTaken}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Improvement</p>
                  <p className="text-sm text-muted-foreground">
                    {item.improvement > 0 ? '+' : ''}{item.improvement}% from last month
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Quiz</p>
                  <p className="text-sm text-muted-foreground">
                    {item.lastQuizDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
