-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "registrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "HomeworkSubmission" 
ADD COLUMN "content" TEXT,
ADD COLUMN "submittedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "QuestionSubmission" 
ADD COLUMN "score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "UserActivity" 
ADD COLUMN "action" TEXT NOT NULL,
DROP COLUMN "type",
DROP COLUMN "details",
DROP COLUMN "timestamp",
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
