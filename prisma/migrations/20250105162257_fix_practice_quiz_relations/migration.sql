/*
  Warnings:

  - You are about to alter the column `answer` on the `QuestionSubmission` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `correctOption` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `optionA` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `optionB` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `optionC` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `optionD` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `questionText` on the `QuizQuestion` table. All the data in the column will be lost.
  - Added the required column `status` to the `HomeworkSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correctAnswerIndex` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `options` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PracticeQuiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PracticeQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PracticeQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "optionsJson" TEXT NOT NULL,
    "correctOption" INTEGER NOT NULL,
    "explanation" TEXT,
    "practiceQuizId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PracticeQuestion_practiceQuizId_fkey" FOREIGN KEY ("practiceQuizId") REFERENCES "PracticeQuiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HomeworkSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "content" TEXT,
    "grade" INTEGER,
    "feedback" TEXT,
    "studentId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HomeworkSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HomeworkSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HomeworkSubmission" ("assignmentId", "content", "createdAt", "feedback", "grade", "id", "studentId", "updatedAt") SELECT "assignmentId", "content", "createdAt", "feedback", "grade", "id", "studentId", "updatedAt" FROM "HomeworkSubmission";
DROP TABLE "HomeworkSubmission";
ALTER TABLE "new_HomeworkSubmission" RENAME TO "HomeworkSubmission";
CREATE TABLE "new_QuestionSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "answer" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuestionSubmission_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuestionSubmission_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "HomeworkSubmission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QuestionSubmission" ("answer", "createdAt", "id", "isCorrect", "questionId", "submissionId", "updatedAt") SELECT "answer", "createdAt", "id", "isCorrect", "questionId", "submissionId", "updatedAt" FROM "QuestionSubmission";
DROP TABLE "QuestionSubmission";
ALTER TABLE "new_QuestionSubmission" RENAME TO "QuestionSubmission";
CREATE UNIQUE INDEX "QuestionSubmission_questionId_submissionId_key" ON "QuestionSubmission"("questionId", "submissionId");
CREATE TABLE "new_QuizQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctAnswerIndex" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuizQuestion_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QuizQuestion" ("assignmentId", "createdAt", "explanation", "id", "updatedAt") SELECT "assignmentId", "createdAt", "explanation", "id", "updatedAt" FROM "QuizQuestion";
DROP TABLE "QuizQuestion";
ALTER TABLE "new_QuizQuestion" RENAME TO "QuizQuestion";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "powerLevel" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "schoolId" TEXT,
    "teacherId" TEXT,
    CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "powerLevel", "role", "schoolId", "status", "teacherId", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "powerLevel", "role", "schoolId", "status", "teacherId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_schoolId_idx" ON "User"("schoolId");
CREATE INDEX "User_teacherId_idx" ON "User"("teacherId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
