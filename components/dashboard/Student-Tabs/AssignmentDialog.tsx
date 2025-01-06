'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, Download, CheckCircle, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface AssignmentDialogProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    className: string;
    status: 'pending' | 'submitted' | 'graded';
    grade?: number;
    attachments?: string[];
    questions: {
      id: string;
      question: string;
      options: string;
    }[];
    submission?: {
      content: string;
      files: string[];
      submittedAt: string;
      feedback?: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentDialog({ assignment, isOpen, onClose }: AssignmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionContent, setSubmissionContent] = useState(assignment.submission?.content || '');
  const [files, setFiles] = useState<File[]>([]);
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('content', submissionContent);
      formData.append('answers', JSON.stringify(answers));
      
      // Log the submission data for debugging
      console.log('Submitting assignment:', {
        assignmentId: assignment.id,
        content: submissionContent,
        answers
      });

      const response = await fetch(`/api/students/assignments/${assignment.id}/submit`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Submission failed:', text);
        throw new Error('Failed to submit assignment');
      }

      const data = await response.json();
      console.log('Submission successful:', data);

      toast({
        title: 'Success',
        description: 'Assignment submitted successfully',
      });

      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit assignment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPastDue = new Date(assignment.dueDate) < new Date();
  const canSubmit = !isPastDue && assignment.status === 'pending';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle>{assignment.title}</DialogTitle>
          <DialogDescription>
            {assignment.className} • Due {format(new Date(assignment.dueDate), 'PPP')}
          </DialogDescription>
          {/* Assignment Status */}
          <div className="flex items-center gap-2 text-sm mt-2">
            {assignment.status === 'graded' ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Graded • Score: {assignment.grade}%</span>
              </>
            ) : assignment.status === 'submitted' ? (
              <>
                <Clock className="h-4 w-4 text-yellow-500" />
                <span>Submitted • Awaiting Grade</span>
              </>
            ) : isPastDue ? (
              <>
                <Clock className="h-4 w-4 text-red-500" />
                <span>Past Due</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Due {format(new Date(assignment.dueDate), 'PPP')}</span>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {assignment.description}
            </div>
          </div>

          {/* Questions */}
          {assignment.questions.length > 0 && (
            <div>
              <h3 className="font-medium mb-4">Questions</h3>
              <div className="space-y-6">
                {assignment.questions.map((question, index) => {
                  const options = JSON.parse(question.options);
                  return (
                    <div key={question.id} className="space-y-3">
                      <Label>
                        {index + 1}. {question.question}
                      </Label>
                      <div className="grid gap-2">
                        {options.map((option: string, optionIndex: number) => (
                          <div key={optionIndex} className="flex items-center">
                            <input
                              type="radio"
                              id={`${question.id}-${optionIndex}`}
                              name={question.id}
                              value={optionIndex}
                              checked={answers[question.id] === optionIndex}
                              onChange={() => setAnswers({...answers, [question.id]: optionIndex})}
                              className="mr-2"
                              disabled={assignment.status !== 'pending' || isPastDue}
                            />
                            <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Additional Comments */}
          <div>
            <Label htmlFor="comments">Additional Comments (Optional)</Label>
            <Textarea
              id="comments"
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              placeholder="Add any comments or notes..."
              className="mt-2"
              disabled={assignment.status !== 'pending' || isPastDue}
            />
          </div>

          {/* File Attachments */}
          <div>
            <Label>Attachments</Label>
            {canSubmit && (
              <div className="mt-2">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted file types: PDF, DOC, DOCX, TXT
                </p>
              </div>
            )}
            {assignment.submission?.files && assignment.submission.files.length > 0 && (
              <div className="mt-2 space-y-2">
                <h4 className="text-sm font-medium">Submitted Files:</h4>
                {assignment.submission.files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {file.split('/').pop()}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teacher Feedback */}
          {assignment.status === 'graded' && assignment.submission?.feedback && (
            <div>
              <h3 className="font-medium mb-2">Teacher Feedback</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-4 rounded-lg">
                {assignment.submission.feedback}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {canSubmit && (
          <div className="sticky bottom-0 bg-background pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(answers).length !== assignment.questions.length}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Assignment
                </>
              )}
            </Button>
            {Object.keys(answers).length !== assignment.questions.length && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Answer all questions to submit ({Object.keys(answers).length}/{assignment.questions.length})
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
