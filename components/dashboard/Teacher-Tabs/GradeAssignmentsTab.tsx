import { useState, useEffect } from 'react';
import { Card, Button, Text, Badge, Group, Stack, Modal, NumberInput, Textarea } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { notifications } from '@mantine/notifications';
import { formatDistanceToNow } from 'date-fns';

interface Submission {
  id: string;
  status: string;
  content: string;
  grade: number | null;
  feedback: string | null;
  files: string[];
  studentId: string;
  student: {
    name: string;
    email: string;
  };
  answers: {
    id: string;
    questionId: string;
    answer: number;
    isCorrect: boolean;
    question: {
      question: string;
      options: string;
      correctAnswerIndex: number;
    };
  }[];
  submittedAt: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  submissions: Submission[];
}

export function GradeAssignmentsTab() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [grade, setGrade] = useState<number | undefined>();
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/teachers/assignments');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch assignments',
        color: 'red'
      });
    }
  };

  const handleGradeSubmit = async () => {
    try {
      const response = await fetch('/api/teachers/assignments/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: selectedSubmission!.id,
          grade,
          feedback
        }),
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Assignment graded successfully',
          color: 'green'
        });
        setIsGradeModalOpen(false);
        fetchAssignments();
      } else {
        throw new Error('Failed to grade assignment');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to grade assignment',
        color: 'red'
      });
    }
  };

  return (
    <Stack spacing="md">
      {assignments.map((assignment) => (
        <Card key={assignment.id} shadow="sm" p="lg">
          <Text weight={500} size="lg" mb="md">{assignment.title}</Text>
          
          <Text size="sm" color="dimmed" mb="md">
            Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
          </Text>
          
          <Text size="sm" mb="xl">{assignment.description}</Text>

          <Text weight={500} mb="md">Submissions:</Text>
          
          <Stack spacing="sm">
            {assignment.submissions.map((submission) => (
              <Card key={submission.id} withBorder>
                <Group position="apart" mb="xs">
                  <Text weight={500}>{submission.student.name}</Text>
                  <Badge color={submission.status === 'graded' ? 'green' : 'yellow'}>
                    {submission.status}
                  </Badge>
                </Group>

                <Text size="sm" color="dimmed" mb="md">
                  Submitted {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                </Text>

                {submission.grade && (
                  <Text size="sm" weight={500} color="blue" mb="md">
                    Grade: {submission.grade}/100
                  </Text>
                )}

                <Button
                  variant="light"
                  color="blue"
                  onClick={() => {
                    setSelectedSubmission(submission);
                    setGrade(submission.grade || undefined);
                    setFeedback(submission.feedback || '');
                    setIsGradeModalOpen(true);
                  }}
                >
                  {submission.status === 'graded' ? 'View Grade' : 'Grade Submission'}
                </Button>
              </Card>
            ))}
          </Stack>
        </Card>
      ))}

      <Modal
        opened={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title="Grade Submission"
        size="lg"
      >
        {selectedSubmission && (
          <Stack spacing="md">
            <Text weight={500}>Student: {selectedSubmission.student.name}</Text>
            
            <Text weight={500} mt="md">Answers:</Text>
            {selectedSubmission.answers.map((answer, index) => {
              const options = JSON.parse(answer.question.options);
              return (
                <Card key={answer.id} withBorder p="md">
                  <Text weight={500} mb="xs">
                    Question {index + 1}: {answer.question.question}
                  </Text>
                  <Text color={answer.answer === answer.question.correctAnswerIndex ? "green" : "red"}>
                    Student's Answer: {options[answer.answer]}
                  </Text>
                  <Text color="green">
                    Correct Answer: {options[answer.question.correctAnswerIndex]}
                  </Text>
                </Card>
              );
            })}

            {selectedSubmission.content && (
              <>
                <Text weight={500}>Additional Comments:</Text>
                <Text>{selectedSubmission.content}</Text>
              </>
            )}

            {selectedSubmission.files && selectedSubmission.files.length > 0 && (
              <>
                <Text weight={500}>Attached Files:</Text>
                {selectedSubmission.files.map((file, index) => (
                  <Button
                    key={index}
                    variant="light"
                    component="a"
                    href={file}
                    target="_blank"
                  >
                    View File {index + 1}
                  </Button>
                ))}
              </>
            )}

            <NumberInput
              label="Grade (0-100)"
              value={grade}
              onChange={(val) => setGrade(val)}
              min={0}
              max={100}
              required
            />

            <Textarea
              label="Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.currentTarget.value)}
              minRows={3}
            />

            <Button onClick={handleGradeSubmit} fullWidth>
              Submit Grade
            </Button>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
