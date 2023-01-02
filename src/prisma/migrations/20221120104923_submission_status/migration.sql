-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Processing', 'Pass', 'Fail');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'Processing';
