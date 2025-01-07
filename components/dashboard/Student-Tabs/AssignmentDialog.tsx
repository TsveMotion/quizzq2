'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Loader2, Upload, Download, CheckCircle, Clock, FileText, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AssignmentDialogProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    className: string;
    status: 'pending' | 'submitted' | 'graded';
    grade?: number;
    attachments?: {
      id: string;
      fileName: string;
      url: string;
    }[];
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
      answers?: { [key: string]: number };
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentDialog({ assignment, isOpen, onClose }: AssignmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionContent, setSubmissionContent] = useState(assignment.submission?.content || '');
  const [files, setFiles] = useState<File[]>([]);
  const [answers, setAnswers] = useState<{[key: string]: number}>(
    assignment.submission?.answers || {}
  );
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (Object.keys(answers).length !== assignment.questions.length) {
        toast({
          title: "Warning",
          description: "Please answer all questions before submitting.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('content', submissionContent);
      formData.append('answers', JSON.stringify(answers));
      
      // Add files if any
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`/api/students/assignments/${assignment.id}/submit`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit assignment');
      }

      toast({
        title: 'Success',
        description: 'Assignment submitted successfully',
      });

      router.refresh();
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit assignment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPastDue = new Date(assignment.dueDate) < new Date();
  const canSubmit = !isPastDue && assignment.status === 'pending';
  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = assignment.questions.length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle>{assignment.title}</DialogTitle>
          <DialogDescription>
            {assignment.className} • Due {format(new Date(assignment.dueDate), 'PPP')}
          </DialogDescription>
          
          {/* Assignment Status */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-sm">
              {assignment.status === 'graded' ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">Graded • Score: {assignment.grade}%</span>
                </>
              ) : assignment.status === 'submitted' ? (
                <>
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-600 font-medium">Submitted • Awaiting Grade</span>
                </>
              ) : isPastDue ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600 font-medium">Past Due</span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-600 font-medium">Due {format(new Date(assignment.dueDate), 'PPP')}</span>
                </>
              )}
            </div>
            {canSubmit && (
              <div className="text-sm text-muted-foreground">
                {answeredQuestions}/{totalQuestions} questions answered
              </div>
            )}
          </div>
          
          {canSubmit && (
            <Progress 
              value={progressPercentage}
              className={cn(
                "h-2 mt-2",
                progressPercentage === 100 ? "bg-green-500" : "bg-blue-200"
              )}
            />
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <Card className="p-4">
            <h3 className="font-medium mb-2">Description</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {assignment.description}
            </div>
          </Card>

          {/* Questions */}
          <div className="space-y-4">
            <h3 className="font-medium">Questions</h3>
            {assignment.questions?.map((question, index) => {
              const options = Array.isArray(question.options) 
                ? question.options 
                : typeof question.options === 'string'
                  ? JSON.parse(question.options)
                  : [];
                
              const isAnswered = answers[question.id] !== undefined;
              return (
                <Card 
                  key={question.id} 
                  className={`p-4 ${
                    isAnswered ? 'border-green-200 bg-green-50/50' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        Question {index + 1}
                      </Label>
                      {isAnswered && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm font-medium">{question.question}</p>
                    {options.length > 0 && (
                      <RadioGroup
                        value={answers[question.id]?.toString()}
                        onValueChange={(value) => 
                          setAnswers({...answers, [question.id]: parseInt(value)})
                        }
                        disabled={assignment.status !== 'pending' || isPastDue}
                        className="space-y-2"
                      >
                        {options.map((option: string, optionIndex: number) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={optionIndex.toString()} id={`q${question.id}-${optionIndex}`} />
                            <Label htmlFor={`q${question.id}-${optionIndex}`} className="text-sm">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Additional Comments */}
          <Card className="p-4">
            <Label htmlFor="comments" className="font-medium">Additional Comments</Label>
            <Textarea
              id="comments"
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              placeholder="Add any comments or notes about your submission..."
              className="mt-2"
              disabled={assignment.status !== 'pending' || isPastDue}
            />
          </Card>

          {/* File Attachments */}
          <Card className="p-4">
            <Label className="font-medium">Attachments</Label>
            {canSubmit && (
              <div className="mt-2 space-y-2">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Accepted file types: PDF, DOC, DOCX, TXT
                </p>
              </div>
            )}
            {assignment.submission?.files && assignment.submission.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Submitted Files:</h4>
                {assignment.submission.files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    <a 
                      href={file} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500 hover:underline"
                    >
                      {file.split('/').pop()}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Teacher Feedback */}
          {assignment.status === 'graded' && assignment.submission?.feedback && (
            <Card className="p-4 bg-muted">
              <h3 className="font-medium mb-2">Teacher Feedback</h3>
              <div className="text-sm whitespace-pre-wrap">
                {assignment.submission.feedback}
              </div>
            </Card>
          )}
        </div>

        {/* Submit Button */}
        {canSubmit && (
          <div className="sticky bottom-0 bg-background pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredQuestions !== totalQuestions}
              className="w-full"
              size="lg"
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
            {answeredQuestions !== totalQuestions && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Please answer all questions to submit
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
