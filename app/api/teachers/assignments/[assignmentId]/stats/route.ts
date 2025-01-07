import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get assignment with questions and class details
    const assignment = await prisma.assignment.findUnique({
      where: { id: params.assignmentId },
      include: {
        class: {
          include: {
            students: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        questions: true,
      },
    });

    if (!assignment) {
      return new NextResponse("Assignment not found", { status: 404 });
    }

    // Get all submissions for this assignment
    const submissions = await prisma.homeworkSubmission.findMany({
      where: {
        assignmentId: params.assignmentId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    // Transform submissions data
    const submissionStats = submissions.map(submission => {
      const answers = submission.answers.map(answer => ({
        questionId: answer.question.id,
        isCorrect: answer.isCorrect,
        score: answer.score,
      }));

      return {
        studentId: submission.student.id,
        studentName: submission.student.name,
        studentEmail: submission.student.email,
        submittedAt: submission.submittedAt,
        answers,
      };
    });

    // Calculate statistics
    const totalStudents = assignment.class.students.length;
    const submittedStudents = submissionStats.length;
    const totalMarks = assignment.totalMarks;

    // Calculate average score
    const totalScores = submissionStats.reduce(
      (sum: number, sub: { answers: Array<{ score: number | null }> }) =>
        sum + sub.answers.reduce((sum: number, ans: { score: number | null }) => sum + (ans.score || 0), 0),
      0
    );
    const averageScore =
      submittedStudents > 0 ? totalScores / submittedStudents : 0;

    // Calculate per-question statistics
    const questionStats = assignment.questions.map((question: {
      id: string;
      question: string;
    }) => {
      const questionSubmissions = submissionStats.flatMap((sub: {
        answers: Array<{ questionId: string; isCorrect: boolean; score: number | null }>;
      }) =>
        sub.answers.filter((ans: { questionId: string }) => ans.questionId === question.id)
      );
      const correctAnswers = questionSubmissions.filter((sub: { isCorrect: boolean }) => sub.isCorrect).length;
      const totalAttempts = questionSubmissions.length;
      const averageScore =
        questionSubmissions.reduce(
          (sum: number, sub: { score: number | null }) => sum + (sub.score || 0),
          0
        ) / (totalAttempts || 1);

      return {
        questionId: question.id,
        question: question.question,
        correctAnswers,
        totalAttempts,
        averageScore,
        successRate: totalAttempts > 0 ? correctAnswers / totalAttempts : 0,
      };
    });

    // Get submission status for all students
    const studentSubmissions = assignment.class.students.map((student: {
      id: string;
      name: string;
      email: string;
    }) => {
      const submission = submissionStats.find(
        (sub: { studentId: string }) => sub.studentId === student.id
      );
      return {
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        submitted: !!submission,
        grade: submission
          ? submission.answers.reduce((sum: number, ans: { score: number | null }) => sum + (ans.score || 0), 0)
          : 0,
        submittedAt: submission?.submittedAt || null,
        percentageCorrect: submission
          ? ((submission.answers.reduce((sum: number, ans: { score: number | null }) => sum + (ans.score || 0), 0)) / totalMarks) * 100
          : 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          submittedStudents,
          averageScore,
          submissionRate: totalStudents > 0 ? submittedStudents / totalStudents : 0,
        },
        questionStats,
        studentSubmissions,
      },
    });
  } catch (error) {
    console.error("[ASSIGNMENT_STATS]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
}
