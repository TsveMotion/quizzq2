import { useState, useEffect } from 'react';
import { Card, Button, Text, Badge, Group, Stack, Modal, Textarea, FileInput } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { notifications } from '@mantine/notifications';
import { formatDistanceToNow } from 'date-fns';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  submissions: any[];
  questions: {
    id: string;
    question: string;
    options: string;
  }[];
}

export function AssignmentsTab() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/students/assignments');
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

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('assignmentId', selectedAssignment!.id);
      formData.append('answers', JSON.stringify(answers));
      formData.append('comment', comment);
      files.forEach(file => formData.append('files', file));

      const response = await fetch('/api/students/assignments/submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Assignment submitted successfully',
          color: 'green'
        });
        setIsSubmitModalOpen(false);
        fetchAssignments();
      } else {
        throw new Error('Failed to submit assignment');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to submit assignment',
        color: 'red'
      });
    }
  };

  const getSubmissionStatus = (assignment: Assignment) => {
    const submission = assignment.submissions.find(
      sub => sub.studentId === session?.user?.id
    );
    return submission?.status || 'Not submitted';
  };

  const getSubmissionGrade = (assignment: Assignment) => {
    const submission = assignment.submissions.find(
      sub => sub.studentId === session?.user?.id
    );
    return submission?.grade;
  };

  return (
    <Stack spacing="md">
      {assignments.map((assignment) => (
        <Card key={assignment.id} shadow="sm" p="lg">
          <Group position="apart" mb="xs">
            <Text weight={500}>{assignment.title}</Text>
            <Badge color={getSubmissionStatus(assignment) === 'Not submitted' ? 'red' : 'green'}>
              {getSubmissionStatus(assignment)}
            </Badge>
          </Group>
          
          <Text size="sm" color="dimmed" mb="md">
            Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
          </Text>
          
          <Text size="sm" mb="md">
            {assignment.description}
          </Text>

          {getSubmissionStatus(assignment) === 'graded' && (
            <Text size="sm" weight={500} color="blue" mb="md">
              Grade: {getSubmissionGrade(assignment)}/100
            </Text>
          )}

          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            disabled={getSubmissionStatus(assignment) === 'graded'}
            onClick={() => {
              setSelectedAssignment(assignment);
              setIsSubmitModalOpen(true);
            }}
          >
            {getSubmissionStatus(assignment) === 'Not submitted' ? 'Submit Assignment' : 'View Submission'}
          </Button>
        </Card>
      ))}

      <Modal
        opened={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Assignment"
        size="lg"
      >
        {selectedAssignment && (
          <Stack spacing="md">
            <Text weight={500} size="lg">{selectedAssignment.title}</Text>
            
            {selectedAssignment.questions.map((question, index) => {
              const options = JSON.parse(question.options);
              return (
                <Card key={question.id} shadow="sm" p="md">
                  <Text weight={500} mb="xs">Question {index + 1}: {question.question}</Text>
                  <Stack spacing="xs">
                    {options.map((option: string, optionIndex: number) => (
                      <Button
                        key={optionIndex}
                        variant={answers[question.id] === optionIndex ? "filled" : "light"}
                        onClick={() => setAnswers({...answers, [question.id]: optionIndex})}
                        fullWidth
                      >
                        {option}
                      </Button>
                    ))}
                  </Stack>
                </Card>
              );
            })}

            <Textarea
              label="Additional Comments"
              value={comment}
              onChange={(e) => setComment(e.currentTarget.value)}
              minRows={3}
            />

            <FileInput
              label="Attach Files"
              placeholder="Upload files"
              multiple
              onChange={setFiles}
            />

            <Button onClick={handleSubmit} fullWidth>
              Submit Assignment
            </Button>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
