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
        submissions: {
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
        },
      },
    });

    if (!assignment) {
      return new NextResponse("Assignment not found", { status: 404 });
    }

    // Calculate statistics
    const totalStudents = assignment.class.students.length;
    const submittedStudents = assignment.submissions.length;
    const totalMarks = assignment.totalMarks;

    // Calculate average score
    const totalScores = assignment.submissions.reduce(
      (sum, sub) => sum + (sub.grade || 0),
      0
    );
    const averageScore =
      submittedStudents > 0 ? totalScores / submittedStudents : 0;

    // Calculate per-question statistics
    const questionStats = assignment.questions.map((question) => {
      const questionSubmissions = assignment.submissions.flatMap((sub) =>
        sub.answers.filter((ans) => ans.questionId === question.id)
      );
      const correctAnswers = questionSubmissions.filter((sub) => sub.isCorrect)
        .length;
      const totalAttempts = questionSubmissions.length;
      const averageScore =
        questionSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) /
        (totalAttempts || 1);

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
    const studentSubmissions = assignment.class.students.map((student) => {
      const submission = assignment.submissions.find(
        (sub) => sub.student.id === student.id
      );
      return {
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        submitted: !!submission,
        grade: submission?.grade || 0,
        submittedAt: submission?.submittedAt || null,
        percentageCorrect: submission
          ? ((submission.grade || 0) / totalMarks) * 100
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
