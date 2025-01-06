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
      files.forEach(file => formData.append('files', file));

      const response = await fetch(`/api/students/assignments/${assignment.id}/submit`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to submit assignment');

      toast({
        title: 'Success',
        description: 'Assignment submitted successfully',
      });

      onClose();
    } catch (error) {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{assignment.title}</DialogTitle>
          <DialogDescription>
            {assignment.className} • Due {format(new Date(assignment.dueDate), 'PPP')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignment Status */}
          <div className="flex items-center gap-2 text-sm">
            {assignment.status === 'graded' ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Graded • Score: {assignment.grade}%</span>
              </>
            ) : assignment.status === 'submitted' ? (
              <>
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span>Submitted</span>
              </>
            ) : isPastDue ? (
              <>
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Past Due</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-yellow-500" />
                <span>Due {format(new Date(assignment.dueDate), 'PPP')}</span>
              </>
            )}
          </div>

          {/* Assignment Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <div className="rounded-lg bg-muted p-4">
              <p className="whitespace-pre-wrap">{assignment.description}</p>
            </div>
          </div>

          {/* Assignment Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Assignment Files</Label>
              <div className="space-y-2">
                {assignment.attachments.map((file, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => window.open(file, '_blank')}
                  >
                    <FileText className="h-4 w-4" />
                    {file.split('/').pop()}
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Submission Section */}
          {canSubmit && (
            <div className="space-y-4">
              <Label>Your Work</Label>
              <Textarea
                placeholder="Enter your work here..."
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                className="min-h-[200px]"
              />

              <div className="space-y-2">
                <Label>Attach Files</Label>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {files.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {files.length} file(s) selected
                  </div>
                )}
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Submit Assignment
              </Button>
            </div>
          )}

          {/* Previous Submission */}
          {assignment.submission && (
            <div className="space-y-2">
              <Label>Your Submission</Label>
              <div className="rounded-lg bg-muted p-4 space-y-4">
                <p className="whitespace-pre-wrap">{assignment.submission.content}</p>
                {assignment.submission.files && assignment.submission.files.length > 0 && (
                  <div className="space-y-2">
                    <Label>Submitted Files</Label>
                    {assignment.submission.files.map((file, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => window.open(file, '_blank')}
                      >
                        <FileText className="h-4 w-4" />
                        {file.split('/').pop()}
                        <Download className="h-4 w-4 ml-auto" />
                      </Button>
                    ))}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Submitted on {format(new Date(assignment.submission.submittedAt), 'PPP')}
                </div>
              </div>

              {assignment.submission.feedback && (
                <div className="space-y-2">
                  <Label>Teacher Feedback</Label>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="whitespace-pre-wrap">{assignment.submission.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
