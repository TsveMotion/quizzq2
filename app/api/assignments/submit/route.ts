import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { assignmentId, answers } = body;

    if (!assignmentId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid submission data" },
        { status: 400 }
      );
    }

    // Verify assignment exists and student has access
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        questions: true,
        class: {
          include: {
            students: {
              where: {
                id: session.user.id,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    if (assignment.class.students.length === 0) {
      return NextResponse.json(
        { error: "You don't have access to this assignment" },
        { status: 403 }
      );
    }

    // Check for existing submission
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        assignmentId: assignmentId,
        studentId: session.user.id
      }
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "Assignment already submitted" },
        { status: 400 }
      );
    }

    // Validate answers format
    const invalidAnswers = answers.some(
      (a: any) => 
        typeof a.questionId !== 'string' || 
        typeof a.selectedOption !== 'number' ||
        a.selectedOption < 0 ||
        a.selectedOption > 3
    );

    if (invalidAnswers) {
      return NextResponse.json(
        { error: "Invalid answer format" },
        { status: 400 }
      );
    }

    // Calculate score
    let correctAnswers = 0;
    const submissionAnswers = answers.map((answer: any) => {
      const question = assignment.questions.find(q => q.id === answer.questionId);
      const isCorrect = question?.correctAnswerIndex === answer.selectedOption;
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect,
      };
    });

    const score = Math.round((correctAnswers / assignment.questions.length) * 100);

    // Create submission with transaction
    const submission = await prisma.$transaction(async (tx) => {
      // Create the submission first
      const sub = await tx.submission.create({
        data: {
          assignmentId,
          studentId: session.user.id,
          score
        }
      });

      // Create the answers
      await tx.answer.createMany({
        data: submissionAnswers.map(answer => ({
          submissionId: sub.id,
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect: answer.isCorrect
        }))
      });

      // Return the complete submission with answers
      return tx.submission.findUnique({
        where: { id: sub.id },
        include: { answers: true }
      });
    });

    if (!submission) {
      throw new Error("Failed to create submission");
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        score,
        answers: submission.answers
      }
    });

  } catch (error) {
    console.error("Error submitting assignment:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}
