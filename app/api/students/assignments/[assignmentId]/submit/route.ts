import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { gradeAnswer } from "@/lib/openai";

interface Question {
  id: string;
  text: string;
  type: string;
  options: any;
  points: number;
  correctAnswer: string | null;
}

interface QuestionSubmission {
  id: string;
  questionId: string;
  submissionId: string;
  answer: string;
  isCorrect: boolean | null;
  points: number | null;
  score: number | null;
  feedback: string | null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    // Authenticate user
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    const content = (formData.get("content") as string) || "";
    const answersJson = formData.get("answers") as string;
    const files = formData.getAll("files") as File[];

    if (!answersJson) {
      return NextResponse.json(
        { success: false, error: "Answers are required" },
        { status: 400 }
      );
    }

    let answers;
    try {
      answers = JSON.parse(answersJson) as Array<{
        questionId: string;
        answer: string;
      }>;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid answers format" },
        { status: 400 }
      );
    }

    const fileNames = files.map((file) => file.name);
    const filesJson = JSON.stringify(fileNames);

    // Fetch assignment and validate existence
    const assignment = await prisma.assignment.findUnique({
      where: { id: params.assignmentId },
      include: { questions: true },
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    const studentId = session.user.id;
    const gradedAnswers = await Promise.all(
      answers.map(async ({ questionId, answer }) => {
        const question = await prisma.question.findUnique({
          where: { id: questionId }
        });

        if (!question) {
          return {
            questionId,
            answer,
            isCorrect: false,
            score: 0
          };
        }

        const isCorrect = answer === question.correctAnswer;
        const score = isCorrect ? question.points : 0;

        return {
          questionId,
          answer,
          isCorrect,
          score
        };
      })
    );

    const existingSubmission = await prisma.homeworkSubmission.findFirst({
      where: {
        assignmentId: params.assignmentId,
        studentId,
      },
    });

    const submissionData = {
      content,
      files: filesJson,
      status: 'submitted',
      submittedAt: new Date(),
    };

    const submission = existingSubmission
      ? await prisma.homeworkSubmission.update({
          where: { id: existingSubmission.id },
          data: submissionData,
        })
      : await prisma.homeworkSubmission.create({
          data: {
            ...submissionData,
            assignmentId: params.assignmentId,
            studentId,
          },
        });

    return NextResponse.json({
      success: true,
      data: {
        submission,
        grade: gradedAnswers.reduce((total, ans) => total + ans.score, 0),
        answers: gradedAnswers,
      },
    });
  } catch (error) {
    console.error("[ASSIGNMENT_SUBMIT_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
