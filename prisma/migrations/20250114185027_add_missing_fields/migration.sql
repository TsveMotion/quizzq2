/*
  Warnings:

  - You are about to drop the column `createdAt` on the `QuestionSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `QuestionSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `QuestionSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `QuestionSubmission` table. All the data in the column will be lost.
  - Made the column `answer` on table `QuestionSubmission` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `totalQuestions` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionSubmission" DROP COLUMN "createdAt",
DROP COLUMN "feedback",
DROP COLUMN "score",
DROP COLUMN "updatedAt",
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "answer" SET NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalQuestions" INTEGER NOT NULL;
