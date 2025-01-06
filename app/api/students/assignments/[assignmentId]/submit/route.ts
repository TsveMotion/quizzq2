import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { gradeAnswer } from "@/lib/openai";

export async function POST(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    // Get the token from the request
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await req.formData();
    const content = formData.get('content') as string || "";
    const answersJson = formData.get('answers') as string;
    const answers = JSON.parse(answersJson);
    const files = formData.getAll('files') as File[];
    const fileNames = files.map(file => file.name);
    const filesJson = JSON.stringify(fileNames);

    // Validate assignment exists and get questions
    const assignment = await prisma.assignment.findUnique({
      where: { 
        id: params.assignmentId 
      },
      include: {
        questions: true
      }
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Find existing submission
    const existingSubmission = await prisma.homeworkSubmission.findFirst({
      where: {
        studentId: token.sub,
        assignmentId: params.assignmentId,
      },
    });

    // Calculate total grade
    let totalGrade = 0;
    const gradedAnswers = await Promise.all(
      Object.entries(answers).map(async ([questionId, answer]) => {
        const question = assignment.questions.find(q => q.id === questionId);
        if (!question) return null;

        const result = await gradeAnswer(
          question.question,
          answer as number,
          question.correctAnswerIndex,
          question.marks
        );

        totalGrade += result.score;
        return {
          questionId,
          answer: answer as number,
          isCorrect: result.isCorrect,
          feedback: result.feedback,
          score: result.score
        };
      })
    );

    let submission;
    if (existingSubmission) {
      // Update existing submission
      submission = await prisma.homeworkSubmission.update({
        where: {
          id: existingSubmission.id,
        },
        data: {
          content,
          files: filesJson,
          status: 'graded',
          grade: totalGrade,
          submittedAt: new Date(),
        },
      });

      // Update question submissions
      for (const answer of gradedAnswers) {
        if (!answer) continue;
        await prisma.questionSubmission.upsert({
          where: {
            questionId_submissionId: {
              questionId: answer.questionId,
              submissionId: submission.id
            }
          },
          create: {
            questionId: answer.questionId,
            submissionId: submission.id,
            answer: answer.answer,
            isCorrect: answer.isCorrect,
            feedback: answer.feedback,
            score: answer.score
          },
          update: {
            answer: answer.answer,
            isCorrect: answer.isCorrect,
            feedback: answer.feedback,
            score: answer.score
          }
        });
      }
    } else {
      // Create new submission
      submission = await prisma.homeworkSubmission.create({
        data: {
          content,
          files: filesJson,
          status: 'graded',
          grade: totalGrade,
          studentId: token.sub,
          assignmentId: params.assignmentId,
          submittedAt: new Date(),
        },
      });

      // Create question submissions
      for (const answer of gradedAnswers) {
        if (!answer) continue;
        await prisma.questionSubmission.create({
          data: {
            questionId: answer.questionId,
            submissionId: submission.id,
            answer: answer.answer,
            isCorrect: answer.isCorrect,
            feedback: answer.feedback,
            score: answer.score
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        submission,
        grade: totalGrade,
        answers: gradedAnswers
      }
    });

  } catch (error) {
    console.error("[ASSIGNMENT_SUBMIT]", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      }, 
      { status: 500 }
    );
  }
}
