-- Add submittedAt to HomeworkSubmission
ALTER TABLE "HomeworkSubmission" ADD COLUMN "submittedAt" TIMESTAMP;

-- Add content to HomeworkSubmission
ALTER TABLE "HomeworkSubmission" ADD COLUMN "content" TEXT;

-- Add score to QuestionSubmission
ALTER TABLE "QuestionSubmission" ADD COLUMN "score" FLOAT;
