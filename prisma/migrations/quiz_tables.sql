-- Add new columns to Quiz table
ALTER TABLE "Quiz" 
ADD COLUMN IF NOT EXISTS "subject" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "topic" TEXT NOT NULL DEFAULT '';

-- Create QuizQuestion table if not exists
CREATE TABLE IF NOT EXISTS "QuizQuestion" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "question" TEXT NOT NULL DEFAULT '',
    "options" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- Create QuizAnswer table if not exists
CREATE TABLE IF NOT EXISTS "QuizAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL DEFAULT '',
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "QuizQuestion"
ADD CONSTRAINT "QuizQuestion_quizId_fkey"
FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "QuizAnswer"
ADD CONSTRAINT "QuizAnswer_questionId_fkey"
FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "QuizAnswer_submissionId_fkey"
FOREIGN KEY ("submissionId") REFERENCES "QuizSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes
CREATE INDEX IF NOT EXISTS "QuizQuestion_quizId_idx" ON "QuizQuestion"("quizId");
CREATE INDEX IF NOT EXISTS "QuizAnswer_questionId_idx" ON "QuizAnswer"("questionId");
CREATE INDEX IF NOT EXISTS "QuizAnswer_submissionId_idx" ON "QuizAnswer"("submissionId");
