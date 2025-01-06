"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import useSWR from "swr";

interface AssignmentStats {
  overview: {
    totalStudents: number;
    submittedStudents: number;
    averageScore: number;
    submissionRate: number;
  };
  questionStats: {
    questionId: string;
    question: string;
    correctAnswers: number;
    totalAttempts: number;
    averageScore: number;
    successRate: number;
  }[];
  studentSubmissions: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    submitted: boolean;
    grade: number;
    submittedAt: string | null;
    percentageCorrect: number;
  }[];
}

interface AssignmentStatsViewProps {
  assignmentId: string;
  activeTab?: "overview" | "submissions";
}

export function AssignmentStatsView({ assignmentId, activeTab = "overview" }: AssignmentStatsViewProps) {
  const { data, isLoading } = useSWR<{ data: AssignmentStats }>(
    assignmentId ? `/api/teachers/assignments/${assignmentId}/stats` : null
  );

  const stats = data?.data;

  if (isLoading) return <div>Loading statistics...</div>;
  if (!stats) return <div>No statistics available</div>;

  if (activeTab === "submissions") {
    return (
      <Table>
        <TableCaption>Student Submissions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Submitted At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.studentSubmissions.map((student) => (
            <TableRow key={student.studentId}>
              <TableCell className="font-medium">
                <div>
                  <div>{student.studentName}</div>
                  <div className="text-sm text-gray-500">
                    {student.studentEmail}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    student.submitted
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {student.submitted ? "Submitted" : "Not Submitted"}
                </span>
              </TableCell>
              <TableCell>
                {student.submitted ? (
                  <div className="flex items-center gap-2">
                    <Progress
                      value={student.percentageCorrect}
                      className="w-[100px]"
                    />
                    <span>{student.percentageCorrect.toFixed(1)}%</span>
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                {student.submittedAt
                  ? formatDate(new Date(student.submittedAt))
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Submission Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {stats.overview.submittedStudents} / {stats.overview.totalStudents}
            </div>
            <Progress
              value={stats.overview.submissionRate * 100}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.overview.averageScore.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableCaption>Question Performance Analysis</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Success Rate</TableHead>
            <TableHead>Average Score</TableHead>
            <TableHead>Attempts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.questionStats.map((q) => (
            <TableRow key={q.questionId}>
              <TableCell className="font-medium">{q.question}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={q.successRate * 100} className="w-[100px]" />
                  <span>{(q.successRate * 100).toFixed(1)}%</span>
                </div>
              </TableCell>
              <TableCell>{q.averageScore.toFixed(1)}</TableCell>
              <TableCell>
                {q.correctAnswers} / {q.totalAttempts}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
