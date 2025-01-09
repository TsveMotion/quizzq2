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
import { AICard } from "@/components/ui/ai-card";
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

export default function AssignmentStatsView({ assignmentId, activeTab = "overview" }: AssignmentStatsViewProps) {
  const { data, isLoading } = useSWR<{ data: AssignmentStats }>(
    assignmentId ? `/api/teachers/assignments/${assignmentId}/stats` : null
  );

  const stats = data?.data;

  if (isLoading) return <div>Loading statistics...</div>;
  if (!stats) return <div>No statistics available</div>;

  const sortedSubmissions = stats.studentSubmissions.sort((a: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    submitted: boolean;
    grade: number;
    submittedAt: string | null;
    percentageCorrect: number;
  }, b: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    submitted: boolean;
    grade: number;
    submittedAt: string | null;
    percentageCorrect: number;
  }) => {
    if (a.submitted && !b.submitted) return -1;
    if (!a.submitted && b.submitted) return 1;
    return 0;
  });

  const submissionRate = stats.overview.submissionRate || 0;
  const averageScore = stats.overview.averageScore || 0;

  const questionStats = stats.questionStats.map((q: {
    questionId: string;
    question: string;
    correctAnswers: number;
    totalAttempts: number;
    averageScore: number;
    successRate: number;
  }) => ({
    ...q,
    successRate: Math.round(q.successRate * 100),
  }));

  const studentSubmissions = stats.studentSubmissions.map((student: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    submitted: boolean;
    grade: number;
    submittedAt: string | null;
    percentageCorrect: number;
  }) => ({
    ...student,
    submittedAt: student.submittedAt ? formatDate(student.submittedAt) : 'Not submitted',
  }));

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
          {sortedSubmissions.map((student) => (
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AICard
          title="Total Assignments"
          description="Number of assignments created"
          glowColor="rgba(147, 197, 253, 0.3)"
        >
          <div className="text-2xl font-bold ai-text-gradient animate-glow">24</div>
        </AICard>
        <AICard
          title="Active Assignments"
          description="Currently ongoing assignments"
          glowColor="rgba(167, 139, 250, 0.3)"
        >
          <div className="text-2xl font-bold ai-text-gradient animate-glow">12</div>
        </AICard>
        <AICard
          title="Average Score"
          description="Across all assignments"
          glowColor="rgba(147, 197, 253, 0.3)"
        >
          <div className="text-2xl font-bold ai-text-gradient animate-glow">85%</div>
        </AICard>
        <AICard
          title="Total Students"
          description="Students assigned work"
          glowColor="rgba(167, 139, 250, 0.3)"
        >
          <div className="text-2xl font-bold ai-text-gradient animate-glow">156</div>
        </AICard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <AICard className="col-span-4" title="Recent Assignment Performance">
          {/* Add your chart component here */}
        </AICard>
        <AICard className="col-span-3" title="Top Performing Students">
          {/* Add your table component here */}
        </AICard>
      </div>
    </div>
  );
}
