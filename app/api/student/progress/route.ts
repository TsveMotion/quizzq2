import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student's assignments through submissions
    const submissions = await prisma.homeworkSubmission.findMany({
      where: {
        studentId: session.user.id,
      },
      include: {
        assignment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Process data for timeline chart (recent assignments)
    const recentAssignments = submissions.slice(0, 10).map(submission => ({
      date: submission.createdAt.toISOString().split('T')[0],
      score: submission.score || 0,
      assignment: submission.assignment.title,
    }));

    // Process data for subject distribution
    const subjectCounts: Record<string, number> = {};
    submissions.forEach(submission => {
      const subject = submission.assignment.subject || 'General';
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    });

    const subjectDistribution = Object.entries(subjectCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Process data for performance by subject
    const subjectPerformance: Record<string, { total: number; scored: number; count: number }> = {};
    submissions.forEach(submission => {
      const subject = submission.assignment.subject || 'General';
      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = { total: 0, scored: 0, count: 0 };
      }
      subjectPerformance[subject].total += submission.assignment.totalPoints || 0;
      subjectPerformance[subject].scored += submission.score || 0;
      subjectPerformance[subject].count += 1;
    });

    const progressBySubject = Object.entries(subjectPerformance).map(([subject, data]) => ({
      subject,
      score: Math.round(data.scored / data.count) || 0,
      total: Math.round(data.total / data.count) || 0,
    }));

    return NextResponse.json({
      recentAssignments,
      subjectDistribution,
      progressBySubject,
    });

  } catch (error) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    );
  }
}
