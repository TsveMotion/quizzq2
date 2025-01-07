import { useState, useEffect } from 'react';
import { Card, Button, Text, Badge, Group, Stack, Modal, NumberInput, Textarea } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { notifications } from '@mantine/notifications';
import { format } from 'date-fns';

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

  const handleGradeChange = (value: string | number) => {
    setGrade(typeof value === 'string' ? parseInt(value) : value);
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  return (
    <Stack gap="md">
      {assignments.map((assignment) => (
        <Card key={assignment.id} shadow="sm" p="lg">
          <Text fw={500} size="lg" mb="md">{assignment.title}</Text>
          
          <Text size="sm" c="dimmed" mb="md">
            Due {format(new Date(assignment.dueDate), 'PPP')}
          </Text>
          
          <Text size="sm" mb="xl">{assignment.description}</Text>

          <Text fw={500} mb="md">Submissions:</Text>
          
          <Stack gap="sm">
            {assignment.submissions.map((submission) => (
              <Card key={submission.id} withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>{submission.student.name}</Text>
                  <Badge color={submission.status === 'graded' ? 'green' : 'yellow'}>
                    {submission.status}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" mb="md">
                  Submitted {format(new Date(submission.submittedAt), 'PPP')}
                </Text>

                {submission.grade && (
                  <Text size="sm" fw={500} c="blue" mb="md">
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
          <Stack gap="md">
            <Text fw={500}>Student: {selectedSubmission.student.name}</Text>
            
            <Text fw={500} mt="md">Answers:</Text>
            {selectedSubmission.answers.map((answer, index) => {
              const options = JSON.parse(answer.question.options);
              return (
                <Card key={answer.id} withBorder p="md">
                  <Text fw={500} mb="xs">
                    Question {index + 1}: {answer.question.question}
                  </Text>
                  <Text c={answer.answer === answer.question.correctAnswerIndex ? "green" : "red"}>
                    Student's Answer: {options[answer.answer]}
                  </Text>
                  <Text c="green">
                    Correct Answer: {options[answer.question.correctAnswerIndex]}
                  </Text>
                </Card>
              );
            })}

            {selectedSubmission.content && (
              <>
                <Text fw={500}>Additional Comments:</Text>
                <Text>{selectedSubmission.content}</Text>
              </>
            )}

            {selectedSubmission.files && selectedSubmission.files.length > 0 && (
              <>
                <Text fw={500}>Attached Files:</Text>
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
              onChange={handleGradeChange}
              min={0}
              max={100}
              required
            />

            <Textarea
              label="Feedback"
              value={feedback}
              onChange={handleFeedbackChange}
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
