import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { gradeAnswer } from "@/lib/openai";

export async function POST(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    // Authenticate user
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
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
      answers = JSON.parse(answersJson);
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

    // Check for existing submission
    const existingSubmission = await prisma.homeworkSubmission.findFirst({
      where: {
        studentId: token.sub,
        assignmentId: params.assignmentId,
      },
    });

    // Grade answers
    let totalGrade = 0;
    const gradedAnswers = await Promise.all(
      Object.entries(answers).map(async ([questionId, answer]) => {
        const question = assignment.questions.find((q: { id: string; question: string; correctAnswerIndex: number; marks: number }) => q.id === questionId);
        if (!question) return null;

        const result = await gradeAnswer(
          question.question,
          parseInt(answer as string),
          question.correctAnswerIndex,
          question.marks
        );

        totalGrade += result.score;
        return {
          questionId,
          answer: answer as string,
          isCorrect: result.isCorrect,
          score: result.score,
        };
      })
    );

    // Save submission
    let submission;
    if (existingSubmission) {
      submission = await prisma.homeworkSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          content,
          files: filesJson,
          status: "graded",
          submittedAt: new Date(),
        },
      });
    } else {
      submission = await prisma.homeworkSubmission.create({
        data: {
          content,
          files: filesJson,
          status: "graded",
          studentId: token.sub,
          assignmentId: params.assignmentId,
          submittedAt: new Date(),
        },
      });
    }

    // Create or update question submissions in a transaction
    await prisma.$transaction(async (tx) => {
      for (const answer of gradedAnswers) {
        if (!answer) continue;

        const existingSubmission = await tx.questionSubmission.findFirst({
          where: {
            submissionId: submission.id,
            questionId: answer.questionId,
          },
        });

        if (existingSubmission) {
          // Update existing submission
          await tx.questionSubmission.update({
            where: { id: existingSubmission.id },
            data: {
              answer: String(answer.answer),
              isCorrect: answer.isCorrect,
              submittedAt: new Date(),
            },
          });
        } else {
          // Create new submission
          await tx.questionSubmission.create({
            data: {
              submission: { connect: { id: submission.id } },
              question: { connect: { id: answer.questionId } },
              answer: String(answer.answer),
              isCorrect: answer.isCorrect,
              submittedAt: new Date(),
            },
          });
        }
      }
    });

    // Return response
    return NextResponse.json({
      success: true,
      data: {
        submission,
        grade: totalGrade,
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
